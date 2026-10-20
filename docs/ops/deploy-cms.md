# Deploy CMS (`apps/cms`) — Railway + Postgres

## Rules

| Environment | Database |
|-------------|----------|
| Local laptop | **SQLite** `DATABASE_URL=file:./payload.db` |
| Railway / any host | **Postgres only** (`postgresql://…`) |

SQLite on a container filesystem is wiped on redeploy and is unsupported for prod.

Code selects the adapter from `DATABASE_URL` (`apps/cms/src/lib/dbAdapter.ts`). Health exposes `dbDialect` (no secrets): `GET /api/health`.

## Prerequisites (human)

1. GitHub repo access (done: `yashrajcc/cpa-ngo-scaffold`).
2. **Railway login** — see [human-login-checklist.md](./human-login-checklist.md). Agents cannot complete `railway login`.
3. Merge/deploy from a branch that includes `railway.toml` + Postgres adapter (this deploy branch).

## Path A — Railway dashboard (recommended; no CLI)

1. Open [railway.app/new](https://railway.app/new) → **Deploy from GitHub repo**.
2. Authorize GitHub if prompted → select **cpa-ngo-scaffold**.
3. Branch: `cursor/pipeline-deploy-05a1` (or `main` once merged).
4. **Add service** if needed → ensure it builds from **repo root** (not `apps/cms` alone — workspaces need the root `package.json`).
5. **Add → Database → PostgreSQL**.
6. CMS service → **Variables**:
   - `DATABASE_URL` = reference Postgres `DATABASE_URL` (Railway UI: Variable → Add reference → Postgres → `DATABASE_URL`)
   - `PAYLOAD_SECRET` = output of `openssl rand -base64 32` (generate on your machine; do not paste into chat)
   - `PAYLOAD_PUBLIC_SERVER_URL` = `https://<generated>.up.railway.app` (set after first public domain exists; update + redeploy)
   - `WEB_REVALIDATE_URL` = `https://cpa-ngo-web.vercel.app/api/revalidate`
   - `REVALIDATE_SECRET` = long random; **same value** on Vercel web env
   - Optional `R2_*` from [env-checklist.md](./env-checklist.md)
7. **Settings → Networking → Generate domain**.
8. Confirm build uses `railway.toml` (`npm ci && npm run build -w @cpa/cms`, start `npm run start -w @cpa/cms`).
9. Open `https://<domain>/api/health` — expect `"dbDialect":"postgres"`.
10. Open `https://<domain>/admin` → create first admin user.
11. Optional seed from a one-off Railway shell / local against prod URL (prefer local seed only against local DB).

## Path B — Railway CLI (after `railway login`)

```bash
cd ~/Projects/NGOCollabs/CPAProject   # or deploy worktree
npx @railway/cli login
npx @railway/cli init                 # link or create project
npx @railway/cli add --database postgres
# Set variables (interactive or railway variables set KEY=value)
npx @railway/cli up
npx @railway/cli domain
```

Use values from `apps/cms/.env.production.example`. Never commit filled `.env`.

## Wire web → CMS

On Vercel web project env:

| Var | Value |
|-----|--------|
| `CMS_URL` | `https://<cms>.up.railway.app` (no trailing slash) |
| `REVALIDATE_SECRET` | identical to CMS |

Redeploy web. Publish a post in admin → web ISR should refresh when hook is set.

## Verify

```bash
curl -sS https://<cms>.up.railway.app/api/health
# {"ok":true,"service":"cpa-cms","dbDialect":"postgres","storageMode":"local"|"r2",...}
```

| Check | Pass |
|-------|------|
| `dbDialect` | `postgres` |
| `/admin` | login / first-user form |
| Media without R2 | works until redeploy; plan R2 for durable media |
| Publish → web | revalidate 200 when secrets match |

## Failures

| Symptom | Likely cause |
|---------|----------------|
| Build can't find workspace | Root Directory not repo root |
| `dbDialect: sqlite` in prod | `DATABASE_URL` still `file:…` |
| Crash on boot | Missing `PAYLOAD_SECRET` or bad Postgres URL |
| Revalidate no-op | `WEB_REVALIDATE_URL` / secret mismatch |
