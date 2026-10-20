# How to build this the right way

A calm guide for Yashraj (and partners) working on the CPA NGO/CBO scaffold.

You do **not** need to be a senior engineer. You need a clear bar for each stage, a short safety list, and a habit of checking the Project docs before inventing new architecture.

**Source of truth for this product**

| Doc | Use it for |
|-----|------------|
| [`architecture.md`](./architecture.md) | What the system is (site, CMS, R2, Razorpay, ops modes) |
| [`v0.1.md`](./v0.1.md) | What’s in / out of the current slice |
| [`stack-and-sku.md`](./stack-and-sku.md) | Hosting + what you sell |
| [`setup-keys.md`](./setup-keys.md) | How to get Razorpay / R2 keys |
| [`uat-checklist.md`](./uat-checklist.md) | Human click-through before a demo |

If a change fights those docs, either update the doc **on purpose** or don’t make the change.

---

## 1. What “right” means here

Not perfection. Not a giant test suite on day one. **Right = the next stage’s “done when” bar is met without creating a trap you’ll regret.**

| Stage | Goal | Done when |
|-------|------|-----------|
| **A. Local 0.1** | You can run the kit on your Mac | `npm run dev:cms` + `dev:web`; seed works; Home/Blog/About/Contact load; donate shows **mock** without keys |
| **B. Test keys** | Money path is real but fake | Razorpay **Test Mode** keys in `.env`; Donate opens Checkout; a test payment succeeds ([`setup-keys.md`](./setup-keys.md)) |
| **C. First deploy** | Someone else can open a URL | Public web URL works (already: Vercel demo); CMS hosted somewhere durable later (Railway + Postgres — not SQLite forever) |
| **D. First real org** | An NGO editor uses it without you hovering | They log into admin, publish a post, see it on the site, donate works in test (or live if ready); you have backups + who-holds-keys clear (mode A or B) |

You are building **right** if each stage leaves the next one easier — not if every feature is finished.

---

## 2. Safety / security minimum (this product)

Think of safety as **preventing the failures you’ve already lived through**, not as enterprise compliance theatre.

### Past pain → process that prevents it

| Past failure | What we do instead |
|--------------|--------------------|
| **~10GB CMS dump / painful migration** | Media in R2 (or local `media/` until R2); DB only stores metadata + URLs. Migrations = DB dump + bucket sync — see architecture. |
| **Writers can’t publish without a techie** | Editors use Payload `/admin` only. Publish hook / revalidate — no Git, no SSH for writers. UAT must include “editor alone publishes.” |
| **Ongoing tech liability on the NGO** | Mode A (you + partner) or Mode B (partner-only) **run** Keep Alive. NGO doesn’t get a naked VPS. Secrets live in a vault, not a WhatsApp chat. |

### Minimum rules (always)

1. **Never commit `.env`.** Secrets only in `.env` / host env panels. If leaked → rotate keys.  
2. **Razorpay secret is server-only** (`RAZORPAY_KEY_SECRET` on `apps/web`). Never `NEXT_PUBLIC_` for secrets.  
3. **Admin auth** — first CMS user is admin; invite editors; don’t share one password.  
4. **Mode A vs B** — who holds deploy keys, R2, billing, support is written down ([`architecture.md`](./architecture.md) §2). Razorpay **merchant** stays with the org.  
5. **Least privilege** — R2 token = object read/write on one bucket, not “account owner forever.”  
6. **Backups** — even a stub: copy `payload.db` + `media/` (or R2). Before Keep Alive money: scheduled backup + one restore drill (see checkout `docs/ops/backup-restore.md`).  
7. **Before Live Razorpay** — verify webhooks (signature check) so faked “payment success” callbacks can’t lie to you. Test Mode can come first; Live needs webhook verify.

### What you can defer

- Fancy WAF / SOC2  
- Full pen-test  
- Multi-tenant hard isolation  

Defer ≠ ignore forever — just don’t block stage A–C on them.

---

## 3. Testing layers (plain language)

| Layer | In one sentence | Example in this repo |
|-------|-----------------|----------------------|
| **Unit** | A tiny function, no browser, no network | `parsePresets("100,500")` → `[100, 500]` in `@cpa/payments` |
| **Integration** | A few real pieces together | CMS API returns published posts from SQLite; health shows `storageMode` |
| **UAT** | A human follows a script like an NGO editor | [`uat-checklist.md`](./uat-checklist.md) |

### Skip at 0.1 vs must-have before paid Launch

| | **OK to skip at 0.1** | **Must have before Launch SKU / Keep Alive money** |
|--|----------------------|-----------------------------------------------------|
| Unit | Large coverage | A few tests on payments helpers + “mock vs live” resolution |
| Integration | Full CI matrix | Seed + health endpoints green; publish → site updates |
| UAT | Polished script with screenshots | **Someone other than you** completes the UAT checklist once |
| Security | Live webhook verify | Webhook verify + secrets not in git + backup restore once |
| Ops | Railway/CMS prod | Documented mode A or B + env checklist filled |

**UAT is not optional before a real org.** Unit tests are helpful; UAT is how you know writers aren’t stuck again.

---

## 4. Concrete checklists

### Before first **demo** org (friend / partner walkthrough)

- [ ] Local or deployed web loads Home + Blog  
- [ ] CMS admin: create user, publish a post, see it on the site  
- [ ] Donate: mock **or** Razorpay Test Checkout (prefer Test if keys ready)  
- [ ] [`uat-checklist.md`](./uat-checklist.md) completed by you once  
- [ ] No secrets in GitHub  

### Before **Keep Alive** money (someone pays for ops)

- [ ] Mode A or B owner named; vault for secrets  
- [ ] CMS on durable host + **Postgres** (not “SQLite on a free serverless forever”)  
- [ ] Backups scheduled; restore tried once  
- [ ] Razorpay path understood (Test → Live checklist); webhook verify for Live  
- [ ] UAT done by an editor who is **not** the developer  
- [ ] Support path: who answers “I can’t publish?”  

---

## 5. How to know you’re building right (without being senior)

1. **Read the Project docs first** — architecture / v0.1 / stack-and-sku. If your idea isn’t there, write a short decision note before coding.  
2. **Change one lever at a time** — e.g. “add Razorpay Test keys” *or* “deploy CMS,” not both in one messy night.  
3. **Prefer boring patterns** — Payload + Next + R2 + Razorpay already chosen. Don’t fork a new CMS for fun.  
4. **Write decisions down** — even three bullets in chat → paste into `docs/` or Project Context. Future-you is the audience.  
5. **Done when ≠ feels done** — use the stage table in §1. If you can’t say the “done when” sentence, you’re not done.  
6. **If stuck, shrink the stage** — ship mock donate before Live; local media before R2.

---

## 6. What to implement next in the repo (opinionated)

Do these in order. **Do not** build a huge test suite before UAT exists.

1. **Keep using [`uat-checklist.md`](./uat-checklist.md)** on every meaningful change (10–15 minutes).  
2. **Tiny unit tests** on `@cpa/payments` (`parsePresets`, `resolveDonateConfig` mock vs live) — Vitest already familiar from Payload land; a handful of cases.  
3. **Razorpay webhook verify** before any Live key on a client site.  
4. **CMS deploy + Postgres** when you’re ready for a real org (Railway).  
5. **CI later** — `npm test` + lint on GitHub Actions; Dependabot for npm. After the above, not instead of UAT.

---

## Related

- [`uat-checklist.md`](./uat-checklist.md) — click script  
- [`setup-keys.md`](./setup-keys.md) — Razorpay / R2  
- [`v0.1.md`](./v0.1.md) · [`architecture.md`](./architecture.md) · [`stack-and-sku.md`](./stack-and-sku.md)
