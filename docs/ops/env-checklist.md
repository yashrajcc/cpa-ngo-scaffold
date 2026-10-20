# Env checklist

**First time?** Step-by-step screenshots-in-words: [../setup-keys.md](../setup-keys.md) (Razorpay Test first; R2 optional / can wait).

Copy examples, then fill only what you have. **Missing R2 / Razorpay is OK for local boot** (local disk media + mock donate).

## Secrets Yashraj must provide for live wiring

No R2 or Razorpay credentials were found on this machine / project `.env` / keychain. To go live:

### Cloudflare R2 → set on **CMS** (`apps/cms`)

| Var | Example / notes |
|-----|-----------------|
| `R2_BUCKET` | bucket name |
| `R2_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_PUBLIC_BASE_URL` | public URL / custom domain for objects (recommended) |
| `R2_PREFIX` | optional, default `orgs/demo` |
| `R2_REGION` | optional, default `auto` |

### Razorpay → set on **web** (`apps/web`)

| Var | Notes |
|-----|-------|
| `RAZORPAY_KEY_ID` | test or live key id (`rzp_test_…` / `rzp_live_…`) |
| `RAZORPAY_KEY_SECRET` | **server only** — never commit, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | optional duplicate of key id for client |

---

## CMS (`apps/cms/.env`)

| Var | Required locally? | Notes |
|-----|-------------------|-------|
| `PAYLOAD_SECRET` | yes | long random string (`openssl rand -base64 32`) |
| `DATABASE_URL` | yes | **Local:** `file:./payload.db` (SQLite). **Hosted:** `postgresql://…` only — see [deploy-cms.md](./deploy-cms.md) |
| `PAYLOAD_PUBLIC_SERVER_URL` | yes for absolute media URLs | local `http://localhost:3001`; prod `https://<cms>.up.railway.app` |
| `R2_*` (see above) | no | if incomplete → `storageMode: local` (ephemeral on Railway) |
| `WEB_REVALIDATE_URL` | no | publish hook no-ops if unset |
| `REVALIDATE_SECRET` | with revalidate URL | must match web |

Templates: `apps/cms/.env.example` (local) · `apps/cms/.env.production.example` (Railway).

Health (no secrets): `GET /api/health` → `{ dbDialect: "sqlite" \| "postgres", storageMode: "r2" \| "local" }`.

## Web (`apps/web/.env`)

| Var | Required locally? | Notes |
|-----|-------------------|-------|
| `CMS_URL` | yes for live CMS | local `http://localhost:3001`; prod Railway CMS origin |
| `REVALIDATE_SECRET` | for publish hook | match CMS |
| `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` | no | both set → Orders API + Checkout.js; else mock |

Templates: `apps/web/.env.example` · `apps/web/.env.production.example` (Vercel).

Health (no secrets): `GET /api/health` → `{ donateMode: "live" \| "mock" }`.

## Hosting targets (quick)

| App | Where to set env |
|-----|------------------|
| Web | Vercel → Project → Settings → Environment Variables (today) |
| CMS | Railway → Service → Variables (+ Postgres plugin reference for `DATABASE_URL`) |

Full steps: [deploy.md](./deploy.md) · [human-login-checklist.md](./human-login-checklist.md).
