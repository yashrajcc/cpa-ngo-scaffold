# Pipeline — Plan → Build → Test → Deploy → CSS/JS

Multi-agent workstreams for the CPA NGO scaffold (`cpa-ngo-scaffold`). Same product; separate branches; one merge order.

**Sibling docs (repo):** [`how-to-build-right.md`](./how-to-build-right.md) · [`uat-checklist.md`](./uat-checklist.md) · [`setup-keys.md`](./setup-keys.md) · [`ops/deploy.md`](./ops/deploy.md) · [`ops/env-checklist.md`](./ops/env-checklist.md)  
**Project store:** `docs/v0.1.md` · `docs/architecture.md` · `docs/stack-and-sku.md` · `docs/project-context.md`

---

## Merge order

1. **Plan** (this doc) — docs only; merge anytime.  
2. **Build** — base scaffold (`cursor/v0-1-scaffold-260e`); already landed.  
3. **Test + CI** — Vitest + GitHub Actions; merge before relying on Deploy gates.  
4. **Deploy** — CMS/host path + env checklists; needs Yashraj logins.  
5. **CSS/JS** — public UI polish; merge last among feature branches (after wiring works).  
6. **Merge agent** — integrate when stages report done; no parallel force-merges.

Parallel **work** is fine; sequential **merge** avoids fighting over CI/deploy/theme.

---

## Stages

| Stage | Purpose | Done when | Owner role |
|-------|---------|-----------|------------|
| **Plan** | Stage gates, merge order, Yashraj handoffs | This file in repo + Project store; links siblings | Plan agent — docs only |
| **Build** | Vertical Publish slice: Next + Payload + mock donate + local media | Local `dev:cms`/`dev:web`; seed; Home/Blog/About/Contact; mock donate | Scaffold / Build — already on base branch |
| **Test** | Unit smoke + CI so regressions fail loudly | Vitest on payments helpers; GitHub Actions `npm test` (+ lint if cheap); UAT still human | Test + CI agent — tests/CI only |
| **Deploy** | Durable public URLs + CMS host path | Web URL public; CMS deploy path documented (Railway + Postgres target); env checklist for hosts | Deploy agent — host/docs/login checklist; no theme rewrites |
| **CSS/JS** | Calm public UI polish on locked stack | Home/Blog/About/Contact readable on mobile; no stack fork; no cards-in-hero noise | CSS/JS agent — `packages/theme` + public pages only |

Stage “right” bars also live in [`how-to-build-right.md`](./how-to-build-right.md) §1 (Local → Test keys → First deploy → First real org).

---

## What Yashraj must still do (humans only)

Agents cannot mint merchant keys or finish host OAuth for you.

| Need | Why | Doc |
|------|-----|-----|
| **Razorpay Test keys** | Real Checkout path (leave mock otherwise) | [`setup-keys.md`](./setup-keys.md) Part A |
| **Railway login** | CMS + Postgres for durable admin | [`ops/deploy.md`](./ops/deploy.md) |
| **Cloudflare login** (`wrangler` / dash) | Preferred Pages host + optional R2 | [`setup-keys.md`](./setup-keys.md) Part B (R2 optional) |
| **Host env paste** | Same secrets into Vercel/Railway/CF panels — never git | [`ops/env-checklist.md`](./ops/env-checklist.md) |
| **UAT once (then a non-dev)** | Writers can publish without you | [`uat-checklist.md`](./uat-checklist.md) |

Skip R2 until you want cloud media. Prefer Razorpay Test + first CMS host before deep UI polish (Project preferences).

---

## Agent boundaries (do not cross)

| Own | Do not touch |
|-----|----------------|
| Plan → `docs/pipeline.md` (+ store copy) | App code, CI, theme, deploy configs |
| Test → tests + Actions | Theme polish, host account creation |
| Deploy → host path + login/env docs | Marketing redesign, payments product logic |
| CSS/JS → public UI / theme | CI, CMS schema, deploy infra |
| Merge → integrate ready branches | Invent new product scope |

---

## Related

- [`how-to-build-right.md`](./how-to-build-right.md) — safety + stage bars  
- [`uat-checklist.md`](./uat-checklist.md) — human click-script  
- [`setup-keys.md`](./setup-keys.md) — Razorpay / R2  
- [`ops/backup-restore.md`](./ops/backup-restore.md) · [`ops/mode-a-b.md`](./ops/mode-a-b.md) · [`ops/env-checklist.md`](./ops/env-checklist.md)
