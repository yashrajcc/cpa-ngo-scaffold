# Deploy overview (v0.1)

Repeatable hosting for the Publish slice. Agents prepare config + docs; **Yashraj completes logins** (Railway / Wrangler) — secrets are never invented here.

| App | Preferred | Current | DB / notes |
|-----|-----------|---------|------------|
| `apps/web` | Cloudflare Pages | **Vercel live** → [cpa-ngo-web.vercel.app](https://cpa-ngo-web.vercel.app) | No DB |
| `apps/cms` | **Railway + Postgres** | Not deployed — needs human login | **Postgres only** on host; SQLite = local |

## Guides

| Doc | Use when |
|-----|----------|
| [deploy-web.md](./deploy-web.md) | Redeploy / env for public site (Vercel now; CF later) |
| [deploy-cms.md](./deploy-cms.md) | First CMS host on Railway + Postgres |
| [human-login-checklist.md](./human-login-checklist.md) | Exact clicks Yashraj still owes |
| [env-checklist.md](./env-checklist.md) | Variable inventory |
| [backup-restore.md](./backup-restore.md) | DB + media backup |

## Config-as-code (no credentials)

| File | Purpose |
|------|---------|
| `vercel.json` | Monorepo web build (`@cpa/web`) |
| `railway.toml` | CMS build/start + `/api/health` |
| `wrangler.toml` | CF Pages project name stub (login required) |
| `apps/*/.env.example` | Local defaults |
| `apps/*/.env.production.example` | Hosted templates (empty values) |

## Topology after CMS is up

```
Browser → apps/web (Vercel/CF)
            │  CMS_URL
            ▼
          apps/cms (Railway) ── Postgres (Railway plugin)
            │  WEB_REVALIDATE_URL + REVALIDATE_SECRET
            ▼
          apps/web /api/revalidate
```

Media: local disk on Railway is **ephemeral** — wire R2 when ready ([setup-keys.md](../setup-keys.md)).
