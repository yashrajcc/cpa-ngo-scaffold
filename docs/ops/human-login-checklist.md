# Human login checklist (Yashraj)

Agents **cannot** invent secrets or finish interactive OAuth for Railway / Wrangler. Do these on your machine (browser + terminal). Tick in Project `notes.md` when done.

## Already done

- [x] GitHub: repo https://github.com/yashrajcc/cpa-ngo-scaffold
- [x] Vercel: web demo https://cpa-ngo-web.vercel.app
- [x] `gh` auth on this machine (`yashrajcc`)

## Still owed

### 1. Railway — unblock CMS deploy

**Goal:** logged-in Railway account that can deploy `cpa-ngo-scaffold` + Postgres.

| # | Click / command |
|---|-----------------|
| 1 | Open [railway.app](https://railway.app) → **Login** (GitHub recommended — same `yashrajcc`) |
| 2 | Accept GitHub OAuth → ensure **cpa-ngo-scaffold** is visible under GitHub app permissions |
| 3 | (Optional CLI) In terminal: `npx @railway/cli login` → complete browser prompt |
| 4 | Follow [deploy-cms.md](./deploy-cms.md) Path A (dashboard) or Path B (CLI) |
| 5 | Generate `PAYLOAD_SECRET` locally: `openssl rand -base64 32` — paste **only** into Railway Variables |
| 6 | After domain exists, set Vercel `CMS_URL` + matching `REVALIDATE_SECRET` ([deploy-web.md](./deploy-web.md)) |
| 7 | Smoke: `/api/health` → `dbDialect: postgres`; `/admin` first user |

**Do not** set `DATABASE_URL=file:…` on Railway.

### 2. Cloudflare Wrangler — unblock CF Pages (optional; Vercel OK)

**Goal:** Wrangler session so Pages project `cpa-ngo-web` can be created later.

| # | Click / command |
|---|-----------------|
| 1 | Terminal: `npx wrangler login` |
| 2 | Browser → allow Cloudflare account API access |
| 3 | Confirm: `npx wrangler whoami` |
| 4 | Only then: create Pages project per [deploy-web.md](./deploy-web.md) CF section |

Keep Vercel as production until a CF preview is verified.

### 3. Secrets still off-machine (not deploy-blockers for CMS shell)

| Secret | Doc | Needed for |
|--------|-----|------------|
| Razorpay Test keys | [setup-keys.md](../setup-keys.md) | Live donate (else mock) |
| R2 API tokens | [setup-keys.md](../setup-keys.md) | Durable media on CMS host |

## After you finish

1. Tick items in Project store `notes.md`.
2. Paste **public** URLs only (CMS Railway domain) into `docs/v0.1.md` Deploy status — never paste secrets into chat or git.
