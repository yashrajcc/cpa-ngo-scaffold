# Deploy notes (v0.1)

## Preferred topology

| App | Target | Notes |
|-----|--------|-------|
| `apps/web` | Cloudflare Pages (preferred) or Vercel | Public demo |
| `apps/cms` | Railway (Node + volume or Postgres) | SQLite on serverless is **temporary / not durable** |

## This machine (session)

- `gh` authenticated as **yashrajcc**
- `vercel` authenticated as **yashrajcc**
- `wrangler` **not** logged in → CF Pages needs `wrangler login`
- Railway CLI not configured

## Human steps if CF / Railway needed

```bash
# Cloudflare Pages (web)
npx wrangler login
# then link project / Pages deploy with root apps/web

# Railway (cms)
npm i -g @railway/cli   # or npx
railway login
railway init
# set root directory apps/cms, add Postgres, set env from env-checklist.md
```
