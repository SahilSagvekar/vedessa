#!/usr/bin/env bash
# One-time server setup for the automated deploy pipeline.
# Safe to re-run: every step checks first and skips what is already done.
#
#   Run as root ON THE SERVER, from a terminal (it asks questions):
#     bash server-setup.sh [--pubkey "ssh-ed25519 AAAA... github-actions"]
#
# What it does, in order (it asks before the risky ones):
#   0. preflight checks (user, node/pm2 for the deploy user, nginx, git state)
#   1. ownership: /var/www/vedessa -> deploy, backend/.env -> mode 600
#   2. frontend releases: /var/www/vedessa-frontend/{releases,current}, seeded from
#      today's build; Nginx root -> .../current, upload limit 50M, asset caching
#   3. database: mark the 5 existing migrations as applied (baseline)
#   4. PM2: run the API as `deploy` (not root), start at boot
#   5. read-only report: firewall, SSH hardening, exposed ports
#   6. prints the GitHub secrets to add
#
# Take a database backup BEFORE running this (step 3 writes to _prisma_migrations).

set -Eeuo pipefail

APP_DIR="/var/www/vedessa"
FE_BASE="/var/www/vedessa-frontend"
DEPLOY_USER="deploy"
PM2_APP="vedessa-backend"
NGINX_SITE="vedessa.in"
BACKUP_DIR="/root/vedessa-setup-backups"
API_PORT=5000
# Exactly the migrations that already exist in the live database (created with
# `prisma db push`). Hard-coded on purpose: never baseline a migration added later.
BASELINE_MIGRATIONS=(
  20260125122012_add_razorpay_fields
  20260203040445_add_ekart_shipping_fields
  20260203182037_add_reviews
  20260203185513_add_coupons
  20260322060615_add_product_images_variants
)

PUBKEY=""
while [ $# -gt 0 ]; do
  case "$1" in
    --pubkey) PUBKEY="${2:-}"; shift 2 ;;
    -h|--help) sed -n '2,22p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

step() { printf '\n\033[1m== %s\033[0m\n' "$*"; }
ok()   { printf '  ok: %s\n' "$*"; }
warn() { printf '  WARNING: %s\n' "$*" >&2; }
die()  { printf '\nERROR: %s\n' "$*" >&2; exit 1; }
confirm() { local a; read -r -p "  $1 [y/N] " a; [[ "$a" =~ ^[Yy]$ ]]; }

[ "$(id -u)" -eq 0 ] || die "run as root"
[ -t 0 ] || die "run this from an interactive terminal (it asks questions)"
id "$DEPLOY_USER" >/dev/null 2>&1 || die "user '$DEPLOY_USER' does not exist"
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
DEPLOY_PATH="/usr/local/bin:/usr/bin:/bin"

# Run a shell snippet as the deploy user with the same minimal PATH a non-interactive
# SSH session gets - if this works, the pipeline's SSH commands will too.
as_deploy() {
  runuser -u "$DEPLOY_USER" -- env HOME="$DEPLOY_HOME" PATH="$DEPLOY_PATH" bash -c "$1"
}

# ------------------------------------------------------------------ 0. preflight
step "0. Preflight"
[ -d "$APP_DIR/.git" ] || die "$APP_DIR is not a git checkout"
command -v nginx >/dev/null   || die "nginx not found"
command -v python3 >/dev/null || die "python3 not found (needed to edit the Nginx config)"
as_deploy 'node -v && pm2 -v' >/dev/null 2>&1 \
  || die "the '$DEPLOY_USER' user cannot run node and pm2 from $DEPLOY_PATH. If node lives under /root/.nvm, install it system-wide (NodeSource) and 'npm i -g pm2', then re-run."
ok "deploy user can run node $(as_deploy 'node -v') and pm2 $(as_deploy 'pm2 -v')"

if ! command -v rsync >/dev/null; then
  confirm "rsync is missing (the pipeline uploads the frontend with it). Install via apt?" \
    || die "rsync is required"
  apt-get update -qq && apt-get install -y -qq rsync
fi
ok "rsync present"

NGINX_CONF="$(readlink -f "/etc/nginx/sites-enabled/$NGINX_SITE" 2>/dev/null || true)"
[ -f "$NGINX_CONF" ] || die "Nginx site file /etc/nginx/sites-enabled/$NGINX_SITE not found"
ok "Nginx site: $NGINX_CONF"

echo
echo "  This will change ownership under $APP_DIR, edit Nginx, mark migrations as"
echo "  applied in the live database, and move the API to PM2 under '$DEPLOY_USER'"
echo "  (a few seconds of API downtime). Have you taken a DATABASE BACKUP?"
confirm "Continue?" || die "aborted"

# ------------------------------------------------------------------ 1. ownership
step "1. Ownership and permissions"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"
ok "$APP_DIR owned by $DEPLOY_USER"
if [ -f "$APP_DIR/backend/.env" ]; then
  chmod 600 "$APP_DIR/backend/.env"
  ok "backend/.env is now mode 600 (it was world-readable)"
fi

if [ -n "$PUBKEY" ]; then
  case "$PUBKEY" in
    ssh-ed25519\ *|ssh-rsa\ *|ecdsa-sha2-*) ;;
    *) die "--pubkey does not look like an SSH public key" ;;
  esac
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$DEPLOY_HOME/.ssh"
  AK="$DEPLOY_HOME/.ssh/authorized_keys"
  touch "$AK"
  if grep -qxF "$PUBKEY" "$AK"; then
    ok "deploy key already authorised"
  else
    printf '%s\n' "$PUBKEY" >> "$AK"
    ok "deploy key added to $AK"
  fi
  chown "$DEPLOY_USER:$DEPLOY_USER" "$AK"
  chmod 600 "$AK"
fi

# ------------------------------------------------------------------ git state
step "1b. Git state of the server checkout"
as_deploy "cd '$APP_DIR' && git fetch --quiet origin main"
AHEAD="$(as_deploy "cd '$APP_DIR' && git rev-list --count origin/main..HEAD")"
if [ "$AHEAD" -gt 0 ]; then
  echo "  The server has $AHEAD commit(s) that are not on GitHub main:"
  as_deploy "cd '$APP_DIR' && git log --oneline origin/main..HEAD" | sed 's/^/    /'
  die "push these to GitHub (or deliberately discard them) first - the pipeline fast-forwards only and will never overwrite them"
fi
DIRTY="$(as_deploy "cd '$APP_DIR' && git status --porcelain --untracked-files=no")"
if [ -n "$DIRTY" ]; then
  printf '%s\n' "$DIRTY" | sed 's/^/    /'
  die "tracked files on the server have local edits - commit them or 'git checkout' them first"
fi
ok "server checkout matches origin/main and is clean"

# ------------------------------------------------------------------ 2. frontend + nginx
step "2. Frontend releases and Nginx"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$FE_BASE" "$FE_BASE/releases"
if [ ! -L "$FE_BASE/current" ]; then
  if [ -f "$APP_DIR/frontend/dist/index.html" ]; then
    SEED="$FE_BASE/releases/initial-$(date +%Y%m%d%H%M%S)"
    cp -a "$APP_DIR/frontend/dist" "$SEED"
    chown -R "$DEPLOY_USER:$DEPLOY_USER" "$SEED"
    ln -sfn "$SEED" "$FE_BASE/current"
    chown -h "$DEPLOY_USER:$DEPLOY_USER" "$FE_BASE/current"
    ok "seeded first release from the current build: $SEED"
  else
    die "no existing build at $APP_DIR/frontend/dist/index.html to seed from - build the frontend once first"
  fi
else
  ok "current release: $(readlink -f "$FE_BASE/current")"
fi

mkdir -p "$BACKUP_DIR"
if grep -q "root $FE_BASE/current;" "$NGINX_CONF" && grep -q 'managed by deploy/server-setup.sh' "$NGINX_CONF"; then
  ok "Nginx already configured"
else
  BACKUP="$BACKUP_DIR/nginx-$NGINX_SITE.$(date +%Y%m%d%H%M%S).bak"
  cp -a "$NGINX_CONF" "$BACKUP"
  ok "backed up Nginx config to $BACKUP"

  python3 - "$NGINX_CONF" "$FE_BASE" <<'PY'
import re, sys

conf, fe = sys.argv[1], sys.argv[2]
s = open(conf).read()

old = "root /var/www/vedessa/frontend/dist;"
new = "root %s/current;" % fe
if new not in s:
    if old not in s:
        sys.exit("could not find '%s' in %s" % (old, conf))
    s = s.replace(old, new)

if "managed by deploy/server-setup.sh" not in s:
    block = (
        "    # --- managed by deploy/server-setup.sh ---\n"
        "    client_max_body_size 50M;\n"
        "\n"
        "    # hashed build assets never change: cache for a year\n"
        "    location /assets/ {\n"
        "        expires 1y;\n"
        "        add_header Cache-Control \"public, immutable\";\n"
        "        try_files $uri =404;\n"
        "    }\n"
        "\n"
        "    # always revalidate the entry point so a new release shows up immediately\n"
        "    location = /index.html {\n"
        "        add_header Cache-Control \"no-cache\";\n"
        "    }\n"
        "    # --- end managed block ---\n"
        "\n"
    )
    m = re.search(r"^[ \t]*location\s+/\s*\{", s, re.M)
    if not m:
        sys.exit("could not find 'location / {' in %s" % conf)
    pos = m.start()
    # keep a comment that sits directly above `location /` attached to it
    c = re.search(r"^[ \t]*#[^\n]*\n\Z", s[:pos], re.M)
    if c:
        pos = c.start()
    s = s[:pos] + block + s[pos:]

open(conf, "w").write(s)
PY

  if nginx -t 2>/dev/null; then
    systemctl reload nginx
    ok "Nginx reloaded (root -> $FE_BASE/current, upload limit 50M, asset caching)"
  else
    nginx -t || true
    cp -a "$BACKUP" "$NGINX_CONF"
    die "nginx -t failed - restored the original config from $BACKUP"
  fi
fi

# ------------------------------------------------------------------ 3. migrations baseline
step "3. Database migration baseline"
PRISMA_CMD="cd '$APP_DIR/backend' && ./node_modules/.bin/prisma"
[ -x "$APP_DIR/backend/node_modules/.bin/prisma" ] || die "backend dependencies are not installed ($APP_DIR/backend/node_modules)"
STATUS="$(as_deploy "$PRISMA_CMD migrate status 2>&1" || true)"

if grep -qiE 'have failed|failed to apply' <<<"$STATUS"; then
  printf '%s\n' "$STATUS" | sed 's/^/    /'
  die "a migration is recorded as FAILED - resolve it by hand before continuing"
elif grep -q 'have not yet been applied' <<<"$STATUS" && grep -q "${BASELINE_MIGRATIONS[0]}" <<<"$STATUS"; then
  echo "  The database has none of its existing migrations recorded (it was built with 'db push')."
  echo "  Comparing the live database with prisma/schema.prisma (read-only):"
  DRIFT="$(as_deploy "$PRISMA_CMD migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script 2>&1" || true)"
  printf '%s\n' "$DRIFT" | sed 's/^/    /'
  if grep -qi 'empty migration' <<<"$DRIFT"; then
    ok "live database matches schema.prisma - no drift"
  else
    warn "the output above lists differences between the live database and the schema. Read it: CREATE/ALTER lines mean the database is missing something the code expects."
  fi
  echo
  echo "  Marking these as applied (records history only; no SQL is run against your tables):"
  printf '    %s\n' "${BASELINE_MIGRATIONS[@]}"
  read -r -p "  Type BASELINE to confirm (database backed up): " ANSWER
  [ "$ANSWER" = "BASELINE" ] || die "aborted before baselining"
  for m in "${BASELINE_MIGRATIONS[@]}"; do
    as_deploy "$PRISMA_CMD migrate resolve --applied '$m'" >/dev/null
    ok "baselined $m"
  done
  as_deploy "$PRISMA_CMD migrate status 2>&1" | sed 's/^/    /' || true
else
  ok "migrations already baselined"
fi

# ------------------------------------------------------------------ 4. PM2
step "4. PM2 under the '$DEPLOY_USER' user"
DEPLOY_HAS="$(as_deploy "pm2 describe '$PM2_APP' >/dev/null 2>&1 && echo yes || echo no")"
if [ "$DEPLOY_HAS" = "yes" ]; then
  ok "$PM2_APP already runs under $DEPLOY_USER"
else
  ROOT_HAS="no"
  pm2 describe "$PM2_APP" >/dev/null 2>&1 && ROOT_HAS="yes"
  if [ "$ROOT_HAS" = "yes" ]; then
    echo "  $PM2_APP currently runs under root's PM2. It will be stopped and restarted under '$DEPLOY_USER'."
  else
    echo "  $PM2_APP is not running anywhere right now; it will be started under '$DEPLOY_USER'."
  fi
  confirm "Continue (API restarts)?" || die "aborted"

  if [ "$ROOT_HAS" = "yes" ]; then
    pm2 delete "$PM2_APP"
    pm2 save --force >/dev/null
    ok "removed $PM2_APP from root's PM2"
  fi
  if systemctl is-enabled pm2-root >/dev/null 2>&1; then
    pm2 unstartup systemd >/dev/null 2>&1 || true
    ok "disabled root's PM2 boot service"
  fi
  if ss -ltnH "sport = :$API_PORT" | grep -q .; then
    die "something else is still listening on port $API_PORT - stop it first"
  fi

  as_deploy "cd '$APP_DIR/backend' && NODE_ENV=production pm2 start src/server.js --name '$PM2_APP' && pm2 save"
  ok "started $PM2_APP under $DEPLOY_USER (src/server.js, NODE_ENV=production)"
fi

if ! systemctl is-enabled "pm2-$DEPLOY_USER" >/dev/null 2>&1; then
  env PATH="$DEPLOY_PATH" pm2 startup systemd -u "$DEPLOY_USER" --hp "$DEPLOY_HOME" >/dev/null
  as_deploy "pm2 save" >/dev/null
  ok "PM2 will start $DEPLOY_USER's processes at boot (pm2-$DEPLOY_USER.service)"
else
  ok "PM2 boot service already enabled"
fi

echo "  waiting for the API..."
HEALTHY=no
for _ in $(seq 1 30); do
  if curl -fsS --max-time 3 "http://127.0.0.1:$API_PORT/api/health" 2>/dev/null | grep -q '"success":true'; then
    HEALTHY=yes; break
  fi
  sleep 1
done
if [ "$HEALTHY" = "yes" ]; then
  ok "API is healthy on port $API_PORT"
else
  warn "API did not answer on port $API_PORT - check: sudo -u $DEPLOY_USER pm2 logs $PM2_APP"
fi

# ------------------------------------------------------------------ 5. report only
step "5. Security report (nothing is changed here)"
if command -v ufw >/dev/null; then
  ufw status verbose 2>&1 | sed 's/^/    /'
  ufw status 2>/dev/null | grep -q 'Status: active' \
    || warn "ufw is installed but INACTIVE. Before enabling it, allow SSH first: ufw allow OpenSSH && ufw allow 80 && ufw allow 443"
else
  warn "ufw is not installed. Also check Hostinger hPanel -> VPS -> Firewall."
fi
if ss -ltnH "sport = :$API_PORT" | awk '{print $4}' | grep -Eq '^(0\.0\.0\.0|\*|\[::\]):'; then
  warn "port $API_PORT listens on ALL interfaces. Unless a firewall blocks it, anyone can reach the API directly and bypass Nginx. Fix: 'ufw deny $API_PORT' (or bind the app to 127.0.0.1)."
else
  ok "port $API_PORT is not exposed on a public interface"
fi
if command -v sshd >/dev/null; then
  SSHD="$(sshd -T 2>/dev/null || true)"
  for key in permitrootlogin passwordauthentication; do
    printf '    %s\n' "$(grep -i "^$key " <<<"$SSHD" || echo "$key (unknown)")"
  done
  grep -qi '^permitrootlogin yes' <<<"$SSHD" && warn "SSH allows root login with a password. Once the pipeline works: set 'PermitRootLogin prohibit-password' (or no) and 'PasswordAuthentication no' in /etc/ssh/sshd_config.d/, then 'systemctl reload ssh'."
fi

# ------------------------------------------------------------------ 6. summary
step "6. Add these to GitHub (repo -> Settings -> Secrets and variables -> Actions)"
SSH_PORT="22"
command -v sshd >/dev/null && SSH_PORT="$(sshd -T 2>/dev/null | awk '/^port /{print $2; exit}')"
HOSTKEY_FILE="/etc/ssh/ssh_host_ed25519_key.pub"
[ -f "$HOSTKEY_FILE" ] || HOSTKEY_FILE="/etc/ssh/ssh_host_rsa_key.pub"
HOSTKEY="$(cut -d' ' -f1,2 "$HOSTKEY_FILE")"
if [ "$SSH_PORT" = "22" ]; then
  KH="<SERVER_IP_OR_HOSTNAME> $HOSTKEY"
else
  KH="[<SERVER_IP_OR_HOSTNAME>]:$SSH_PORT $HOSTKEY"
fi
cat <<EOF

  Secrets:
    DEPLOY_HOST         the server IP or hostname (same value you put in the line below)
    DEPLOY_USER         $DEPLOY_USER
    DEPLOY_PORT         $SSH_PORT
    DEPLOY_SSH_KEY      the PRIVATE key whose public half is in $DEPLOY_HOME/.ssh/authorized_keys
    DEPLOY_KNOWN_HOSTS  (this server's own host key - replace the placeholder, keep the rest)
                        $KH

  Variables (Firebase web config - public identifiers):
    VITE_FIREBASE_API_KEY  VITE_FIREBASE_AUTH_DOMAIN  VITE_FIREBASE_PROJECT_ID  VITE_FIREBASE_APP_ID

  Then create an environment called 'production' (Settings -> Environments) and,
  if you want a manual approval before each deploy, add yourself as a required reviewer.
EOF

step "Done"
