# CPA Project — NGO/CBO website scaffold (v0.1)

Blog-first **Publish** layer: Payload CMS + Next.js public site + optional R2/Razorpay.

Decision lock: Project store `docs/v0.1.md` (architecture / SKUs live there too).

## Stack (locked)

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 15.4 (App Router) — `apps/web` |
| CMS + Auth | Payload CMS 3 — `apps/cms` |
| DB | SQLite local (`file:./payload.db`); Postgres later |
| Media | Local `media/` or Cloudflare R2 when env set |
| Payments | Razorpay (mock if keys unset) |
| Hosting targets | Cloudflare Pages (web) · Railway (cms) |

## Repo shape

```
apps/web          Public site (:3000)
apps/cms          Payload admin + API (:3001)
packages/theme    Minimal visual tokens
packages/payments Razorpay helpers (mockable)
packages/config   Shared env / layer types
content/demo-org  Seed notes
docs/ops          Mode A/B, backup, env checklist
```

## Local run

```bash
cd ~/Projects/NGOCollabs/CPAProject
npm install

cp apps/cms/.env.example apps/cms/.env
cp apps/web/.env.example apps/web/.env

# Terminal 1 — CMS (create first admin in browser)
npm run dev:cms
# open http://localhost:3001/admin

# Terminal 2 — public site
npm run dev:web
# open http://localhost:3000

# Optional — seed demo org (after CMS has run once)
npm run seed
```

No R2 or Razorpay credentials required. Donate shows **mock** mode; media writes to disk.

## What’s real vs stub in 0.1

| Path | Status |
|------|--------|
| Admin auth + roles field | Real (Payload) |
| Posts / Pages drafts + publish | Real |
| Public Home / Blog / About / Contact | Real (CMS or fallback) |
| Publish → revalidate webhook | Real when `WEB_REVALIDATE_URL` set; else logged no-op |
| R2 media | Wired; skipped without env |
| Razorpay donate | Mock without keys; Orders API when keys set |
| Backup / Mode A·B | Runbooks under `docs/ops/` |

## Out of 0.1

Engage campaigns, partner fleet, Archive importer, multi-tenant SaaS.

## Quality / UAT

- [How to build right](docs/how-to-build-right.md)
- [UAT checklist](docs/uat-checklist.md)
- [Setup keys (Razorpay / R2)](docs/setup-keys.md)
