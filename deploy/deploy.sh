#!/usr/bin/env bash
# Runs ON THE SERVER as the `deploy` user. The GitHub Actions deploy job streams
# this file over SSH, so the version from the commit being deployed is always the
# one that runs (never a stale copy on the server).
#
#   usage: deploy.sh <target_commit_sha> <release_name>
#
# The frontend build must already be uploaded to $FE_BASE/releases/<release_name>/
#
# What it does:
#   1. fast-forwards the repo to the target commit (refuses if the server has
#      local commits or edits - nothing is ever overwritten)
#   2. installs backend deps (only when package files changed), prisma generate,
#      prisma migrate deploy
#   3. reloads the API under PM2 and waits for /api/health
#   4. flips the frontend `current` symlink to the new release
#   5. verifies the API and the site through Nginx
#   Any failure after step 1 -> automatic rollback to the previous commit/release.
#
# Database migrations are NOT rolled back. Write them so the previous code keeps
# working against the new schema (add columns/tables first, remove them in a later deploy).

set -Eeuo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

TARGET_SHA="${1:?usage: deploy.sh <target_commit_sha> <release_name>}"
RELEASE="${2:?usage: deploy.sh <target_commit_sha> <release_name>}"

APP_DIR="${APP_DIR:-/var/www/vedessa}"
FE_BASE="${FE_BASE:-/var/www/vedessa-frontend}"
PM2_APP="${PM2_APP:-vedessa-backend}"
API_URL="${API_URL:-http://127.0.0.1:5000/api/health}"
SITE_HOST="${SITE_HOST:-vedessa.in}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
LOCK_FILE="${LOCK_FILE:-/tmp/vedessa-deploy.lock}"
HEALTH_TRIES="${HEALTH_TRIES:-30}"

BACKEND_DIR="$APP_DIR/backend"
PRISMA="$BACKEND_DIR/node_modules/.bin/prisma"

log()  { printf '\n==> %s\n' "$*"; }
die()  { printf '\nERROR: %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------- one at a time
exec 9>"$LOCK_FILE"
flock -n 9 || die "another deploy is already running"

# ---------------------------------------------------------------- helpers
install_deps() {
  ( cd "$BACKEND_DIR" && npm ci --omit=dev --no-audit --no-fund )
}

generate_client() {
  ( cd "$BACKEND_DIR" && "$PRISMA" generate )
}

restart_backend() {
  local eco="$APP_DIR/deploy/ecosystem.config.js"
  if [ -f "$eco" ]; then
    pm2 startOrReload "$eco" --only "$PM2_APP" --update-env
  else
    # e.g. rolling back to a commit from before this file existed
    pm2 restart "$PM2_APP" --update-env
  fi
  pm2 save
}

switch_release() {
  local target="$1"
  ln -sfn "$target" "$FE_BASE/current.tmp"
  mv -Tf "$FE_BASE/current.tmp" "$FE_BASE/current"
}

# (Responses are captured into variables rather than piped into `grep -q`:
# with pipefail, grep exiting early can make curl fail with SIGPIPE.)

# Wait until the API answers {"success":true,...}
wait_for_api() {
  local i body
  for ((i = 1; i <= HEALTH_TRIES; i++)); do
    body="$(curl -fsS --max-time 3 "$API_URL" 2>/dev/null || true)"
    if grep -q '"success":true' <<<"$body"; then
      return 0
    fi
    sleep 1
  done
  return 1
}

# Check the public path end-to-end through Nginx, pinned to this machine so it
# does not depend on DNS or an external network.
verify_site() {
  local body
  body="$(curl -fsS --max-time 10 --resolve "$SITE_HOST:443:127.0.0.1" "https://$SITE_HOST/" 2>/dev/null || true)"
  grep -qi '<div id="root"' <<<"$body" || return 1
  body="$(curl -fsS --max-time 10 --resolve "$SITE_HOST:443:127.0.0.1" "https://$SITE_HOST/api/health" 2>/dev/null || true)"
  grep -q '"success":true' <<<"$body" || return 1
}

# The database was originally created with `prisma db push`. Until the existing
# migrations have been marked as applied (server-setup.sh does that), running
# `migrate deploy` would try to re-create existing tables and leave a failed
# migration behind. Refuse instead.
assert_baselined() {
  local out
  out="$("$PRISMA" migrate status 2>&1 || true)"
  if grep -qiE 'have failed|failed to apply' <<<"$out"; then
    printf '%s\n' "$out"
    die "a previous migration is marked as failed - resolve it manually (prisma migrate resolve) before deploying"
  fi
  if grep -q 'have not yet been applied' <<<"$out" && grep -q '20260125122012_add_razorpay_fields' <<<"$out"; then
    printf '%s\n' "$out"
    die "migrations have not been baselined on this database - run deploy/server-setup.sh first"
  fi
}

prune_releases() {
  local current
  current="$(readlink -f "$FE_BASE/current")"
  # newest first; skip the first KEEP_RELEASES, never delete the live one
  find "$FE_BASE/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -rn | cut -d' ' -f2- | tail -n +"$((KEEP_RELEASES + 1))" \
    | while IFS= read -r dir; do
        [ "$(readlink -f "$dir")" = "$current" ] || rm -rf -- "$dir"
      done
}

# ---------------------------------------------------------------- preflight
log "Preflight"
cd "$APP_DIR"
[ -L "$FE_BASE/current" ] || die "$FE_BASE/current is missing - run deploy/server-setup.sh first"
[ -f "$FE_BASE/releases/$RELEASE/index.html" ] || die "frontend release '$RELEASE' was not uploaded (no index.html)"
[ -z "$(git status --porcelain --untracked-files=no)" ] || die "the server checkout has local changes - refusing to touch it"
grep -rqs "$FE_BASE/current" /etc/nginx/sites-enabled/ \
  || echo "WARNING: could not confirm Nginx serves $FE_BASE/current (server-setup.sh not run?)"

PREV_SHA="$(git rev-parse HEAD)"
PREV_RELEASE="$(readlink -f "$FE_BASE/current")"

git fetch --quiet origin main
git cat-file -e "$TARGET_SHA^{commit}" 2>/dev/null || die "commit $TARGET_SHA not found after fetch"
git merge-base --is-ancestor "$PREV_SHA" "$TARGET_SHA" \
  || die "server is at $PREV_SHA which is not an ancestor of $TARGET_SHA (local commits on the server?) - refusing"

DEPS_CHANGED=0
if [ ! -d "$BACKEND_DIR/node_modules" ] \
   || git diff --name-only "$PREV_SHA" "$TARGET_SHA" -- backend/package.json backend/package-lock.json | grep -q .; then
  DEPS_CHANGED=1
fi

echo "current commit : $PREV_SHA"
echo "target commit  : $TARGET_SHA"
echo "current release: $PREV_RELEASE"
echo "new release    : $FE_BASE/releases/$RELEASE"
echo "deps changed   : $DEPS_CHANGED"

# ---------------------------------------------------------------- rollback
rollback() {
  log "ROLLING BACK to $PREV_SHA"
  set +e
  git reset --hard "$PREV_SHA"
  [ "$DEPS_CHANGED" = 1 ] && install_deps
  generate_client
  [ -d "$PREV_RELEASE" ] && switch_release "$PREV_RELEASE"
  restart_backend
  if wait_for_api && verify_site; then
    echo "Rollback complete - site is healthy on $PREV_SHA"
  else
    echo "ROLLBACK FINISHED BUT THE SITE IS STILL UNHEALTHY - check 'pm2 logs $PM2_APP'" >&2
  fi
}

# ---------------------------------------------------------------- deploy
# Runs in a subshell (not inside an `if`) so `set -e` stays in force for every step.
deploy_steps() {
  set -Eeuo pipefail

  log "Updating code"
  git merge --ff-only "$TARGET_SHA"

  if [ "$DEPS_CHANGED" = 1 ]; then
    log "Installing backend dependencies"
    install_deps
  fi

  log "Generating Prisma client"
  generate_client

  log "Applying database migrations"
  assert_baselined
  ( cd "$BACKEND_DIR" && "$PRISMA" migrate deploy )

  log "Reloading API ($PM2_APP)"
  restart_backend
  wait_for_api || { echo "API did not become healthy" >&2; return 1; }

  log "Switching frontend to $RELEASE"
  switch_release "$FE_BASE/releases/$RELEASE"

  log "Verifying site through Nginx"
  verify_site || { echo "site verification failed" >&2; return 1; }
}

set +e
( deploy_steps )
rc=$?
set -e

if [ "$rc" -ne 0 ]; then
  rollback
  die "deploy of $TARGET_SHA failed and was rolled back"
fi

prune_releases
log "Deployed $TARGET_SHA (release $RELEASE) successfully"
