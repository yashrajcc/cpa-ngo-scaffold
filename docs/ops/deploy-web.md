# Deploy web (`apps/web`)

## Status

| Item | Value |
|------|--------|
| Live URL | https://cpa-ngo-web.vercel.app |
| Repo | https://github.com/yashrajcc/cpa-ngo-scaffold |
| Config | root `vercel.json` |
| Preferred later | Cloudflare Pages (`wrangler.toml` + [human-login-checklist.md](./human-login-checklist.md)) |

## Vercel (current — repeatable)

### Dashboard redeploy

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) → project **cpa-ngo-web** (or linked name).
2. **Settings → General** — Root Directory empty (repo root); Framework Next.js.
3. **Settings → Environment Variables** — paste from `apps/web/.env.production.example`:
   - `CMS_URL` — Railway CMS origin once live (until then site uses fallback content)
   - `REVALIDATE_SECRET` — same as CMS
   - Razorpay vars optional (mock donate if unset)
4. **Deployments → … → Redeploy** (or push to the connected branch).

### CLI (if `vercel` available on the machine)

```bash
cd ~/Projects/NGOCollabs/CPAProject
npx vercel link          # once
npx vercel env pull      # optional
npx vercel --prod
```

### Public demo tip

If the URL forces login: **Project → Settings → Deployment Protection** → disable for Production (hobby demo).

### Health

`GET https://cpa-ngo-web.vercel.app/api/health` → `{ donateMode: "live" | "mock" }`.

## Cloudflare Pages (preferred later — blocked on login)

1. Complete **Wrangler login** steps in [human-login-checklist.md](./human-login-checklist.md).
2. Create Pages project named `cpa-ngo-web` (matches `wrangler.toml`).
3. Build settings:
   - Root: repo root
   - Build: `npm ci && npm run build -w @cpa/web`
   - Output: follow OpenNext / next-on-pages docs when adapter is added; until then **keep Vercel**
4. Set the same env vars as Vercel.

**Do not** switch DNS away from Vercel until a CF preview build serves App Router correctly.
