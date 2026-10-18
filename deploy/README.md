# Deployment

Merging to `main` deploys to the Hostinger server automatically. Pull requests
only run checks.

```
PR  ──► CI (.github/workflows/ci.yml)        frontend build · backend syntax · prisma validate
                                             · "schema change needs a migration" · shellcheck
main ─► Deploy (.github/workflows/deploy.yml)
          build job   : build frontend in CI, syntax-check backend
          deploy job  : rsync build → /var/www/vedessa-frontend/releases/<time>-<sha>/
                        ssh deploy@server → deploy/deploy.sh
                          git fast-forward → npm ci (if deps changed) → prisma generate
                          → prisma migrate deploy → pm2 reload → wait for /api/health
                          → flip frontend `current` symlink → verify via Nginx
                          any failure → automatic rollback (code, deps, frontend, API)
                        verify https://vedessa.in/api/health from GitHub
```

Server layout

| Path | What |
|---|---|
| `/var/www/vedessa` | git checkout (backend runs from `backend/`), owned by `deploy` |
| `/var/www/vedessa-frontend/releases/*` | uploaded frontend builds (last 5 kept) |
| `/var/www/vedessa-frontend/current` | symlink to the live release; Nginx `root` points here |
| PM2 app `vedessa-backend` | runs `backend/src/server.js` as user `deploy` |

## One-time setup (in this order)

1. **Back up the database** (Supabase dashboard backup, or `pg_dump`).
2. **Change the root password** (`passwd`). It was committed to the public repo.
3. **SSH key for GitHub Actions** – on your own computer:
   `ssh-keygen -t ed25519 -f vedessa_deploy -N "" -C github-actions`
   Keep `vedessa_deploy` (private) for step 6; the `.pub` goes to the server next.
4. **Run the setup script on the server, as root** (read it first):
   ```
   curl -fsSL https://raw.githubusercontent.com/SahilSagvekar/vedessa/main/deploy/server-setup.sh -o server-setup.sh
   less server-setup.sh
   bash server-setup.sh --pubkey "ssh-ed25519 AAAA... github-actions"   # paste the contents of vedessa_deploy.pub
   ```
   It asks before each risky step. It refuses to continue if the server has
   commits that are not on GitHub, and it never overwrites anything.
5. **Check the site and API still work** (`https://vedessa.in`, `/api/health`).
6. **Add the GitHub secrets/variables** the script prints at the end, and create the
   `production` environment (add yourself as required reviewer if you want a manual
   approval before every deploy).
7. **Merge this branch to `main`.** That merge is the first automatic deploy.

Do not merge before step 4: the deploy refuses to run until the server is prepared
(it checks for the `current` symlink and for the migration baseline).

## Everyday use

- Open a PR → CI runs. Merge → it deploys. Watch it under the **Actions** tab.
- Re-run a deploy: Actions → Deploy → *Run workflow*.
- **Changing the database**: edit `schema.prisma` *and* create a migration
  (`cd backend && npx prisma migrate dev --name what_changed`) in the same PR.
  CI fails if you forget. Production uses `migrate deploy`, never `db push`.
- **Make migrations backward compatible.** They run *before* the new code starts and
  are not rolled back. Add columns/tables first; remove old ones in a later deploy.
- **Server `.env`** lives only on the server (`/var/www/vedessa/backend/.env`). Edit it,
  then `sudo -u deploy pm2 reload vedessa-backend --update-env`.

## Rolling back by hand

Automatic rollback covers failed deploys. To go back to an older version later:

```
ssh deploy@server
cd /var/www/vedessa-frontend && ls releases           # pick an older release
ln -sfn releases/<name> current.tmp && mv -Tf current.tmp current    # frontend, instant
cd /var/www/vedessa && git reset --hard <older-sha>   # backend code
cd backend && npm ci --omit=dev && ./node_modules/.bin/prisma generate
pm2 reload vedessa-backend --update-env
```
Database migrations are not undone by this.

## Known limitations

- `pm2 reload` in fork mode restarts the API: expect ~1–3 seconds of failed API calls
  per deploy. Cluster mode removes that; say if you want it.
- No automatic database backup before a deploy. A deploy that includes a migration is
  the moment to take one.
- The deploy pulls from GitHub anonymously (the repo is public). If you make the repo
  private, add a read-only deploy key on the server.
- `frontend/.env` and `frontend/.env.production` are still tracked in git (the build
  reads `VITE_API_URL` from `.env.production`). They contain no server secrets, but
  consider moving the values into GitHub Variables.
- Removing the old files from git does **not** remove them from history. The root
  password in history is only safe once it has been changed; to purge it, rewrite
  history (`git filter-repo`) and force-push – ask before doing that, it affects every clone.
