# UAT checklist — demo org (Publish layer)

**UAT** = User Acceptance Testing: a human clicks through like an NGO editor.  
No coding required. Print or copy into a notes app. Tick as you go.

**Time:** ~15–25 minutes  
**Who should run it:** You once, then a partner/editor who did **not** write the code  
**Apps:** CMS `http://localhost:3001` (or deployed CMS) · Web `http://localhost:3000` (or https://cpa-ngo-web.vercel.app)

Keys: Razorpay **Test** optional for §5; without keys, mock donate still counts for early demos. See [`setup-keys.md`](./setup-keys.md).

---

## 0. Setup

| # | Step | Pass? |
|---|------|-------|
| 0.1 | CMS and web are running (or live URLs open) | ☐ |
| 0.2 | You can open CMS `/admin` and log in (or create first admin) | ☐ |
| 0.3 | Web Home shows the org name (seed: Sahara Community Collective, or your demo name) | ☐ |

---

## 1. Editor can publish without a developer

| # | Step | Pass? |
|---|------|-------|
| 1.1 | In admin → **Posts** → create a new post with title + slug | ☐ |
| 1.2 | Add a short body; set status to **Published** (and published date if asked) | ☐ |
| 1.3 | Save | ☐ |
| 1.4 | On the **public** site → **Blog** → the new post appears (refresh; wait up to ~1 min if revalidate is slow) | ☐ |
| 1.5 | Open the post URL; title/body readable on phone width (narrow the browser) | ☐ |

**Fail if:** you needed terminal/Git/SSH to make the post appear.

---

## 2. Fixed pages

| # | Step | Pass? |
|---|------|-------|
| 2.1 | **About** page loads; content is not blank error | ☐ |
| 2.2 | **Contact** page shows email/phone or contact copy | ☐ |
| 2.3 | In admin → **Pages** (or Org Profile) — edit About blurb or page → save → public About updates | ☐ |

---

## 3. Media (local or R2)

| # | Step | Pass? |
|---|------|-------|
| 3.1 | Admin → **Media** → upload a small image (JPG/PNG) with alt text | ☐ |
| 3.2 | Attach it as a post cover (optional) → publish → image shows or URL resolves | ☐ |
| 3.3 | Note mode: local disk **or** R2 (`/api/health` on CMS → `storageMode`) | ☐ |

**Fail if:** upload crashes the admin or you had to copy files by hand into the server.

---

## 4. Roles (light check)

| # | Step | Pass? |
|---|------|-------|
| 4.1 | Admin user exists | ☐ |
| 4.2 | (If possible) invite/create an **editor** user | ☐ |
| 4.3 | Editor can create/publish a post; editor cannot casually change things only admins should (e.g. other users’ roles) — best-effort in 0.1 | ☐ |

---

## 5. Donate path

### 5a — Mock (no Razorpay keys)

| # | Step | Pass? |
|---|------|-------|
| 5a.1 | Web `/api/health` shows `"donateMode":"mock"` | ☐ |
| 5a.2 | Home → pick ₹500 → Donate → clear **mock** message (no crash) | ☐ |

### 5b — Razorpay Test (keys set)

| # | Step | Pass? |
|---|------|-------|
| 5b.1 | Web `/api/health` shows `"donateMode":"live"` (means keys loaded; still Razorpay **Test Mode**) | ☐ |
| 5b.2 | Donate → **Checkout popup** opens | ☐ |
| 5b.3 | Complete a [Razorpay test payment](https://razorpay.com/docs/payments/payments/test-card-upi-details/) | ☐ |
| 5b.4 | Success message on site; payment visible in Razorpay Dashboard (Test) | ☐ |

---

## 6. “Would an NGO survive a week?”

| # | Question | Pass? |
|---|----------|-------|
| 6.1 | Could a non-technical editor do §1 alone with a one-page cheat sheet? | ☐ |
| 6.2 | Do you know who to call if publish breaks (mode A: shared / mode B: partner)? | ☐ |
| 6.3 | Do you know where backups live (even if “copy the db file weekly” for now)? | ☐ |

---

## Sign-off

| | |
|--|--|
| Date | |
| Tester name | |
| Environment (local / Vercel / other) | |
| Razorpay: mock / test / live | |
| Blockers found | |
| Ready for demo org? Y / N | |

---

Related: [`how-to-build-right.md`](./how-to-build-right.md) · [`setup-keys.md`](./setup-keys.md) · [`v0.1.md`](./v0.1.md)
