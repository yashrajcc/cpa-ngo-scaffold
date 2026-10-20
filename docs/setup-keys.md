# Set up Razorpay + Cloudflare R2 (beginner)

Plain-language walkthrough for the CPA v0.1 scaffold.  
**You do not need DevOps experience.** Do Razorpay first. **You can skip R2 entirely** and still test donations with local image uploads.

**Security first**

- Put secrets only in local `.env` files (never in git, never in a public chat if you can avoid it).
- Files named `.env` are gitignored in this project — do not rename them to something that gets committed.
- If a key leaks, regenerate it in the dashboard and update `.env`.

**Cost**

- Razorpay **Test Mode**: free for development; no real money moves. You usually need an account; card may be asked for KYC later for **Live** mode — stay on Test for now.
- Cloudflare R2: has a generous free tier for small demos. You may need a Cloudflare account; adding a card depends on their current signup flow — if they demand a card and you’re not ready, **skip R2** and use local `media/`.

---

## Part A — Razorpay Test Mode (do this first)

### 1. Create an account

1. Open [https://razorpay.com](https://razorpay.com).
2. Click **Sign Up** / **Log In** and create an account (email is fine).
3. Complete any basic profile prompts. You do **not** need to go Live yet.

### 2. Turn on Test Mode

1. After login, open the Razorpay **Dashboard**.
2. Find the **Test Mode** / **Live Mode** toggle (usually top-right or in the sidebar).
3. Switch to **Test Mode** (often labeled “Test”).  
   → Nothing you do here charges real customers.

### 3. Create / copy API keys

1. In the dashboard go to **Settings** (gear) → **API Keys**  
   (sometimes under **Account & Settings** → **API Keys**).
2. If you have no keys yet, click **Generate Test Key** / **Generate Key**.
3. You will see:
   - **Key ID** — looks like `rzp_test_……`
   - **Key Secret** — shown once (or behind a reveal). Copy it somewhere safe temporarily.

If the secret is only shown once, paste it into `.env` immediately.

### 4. Paste into this project’s env files

From the repo root (`~/Projects/NGOCollabs/CPAProject`):

**A. Web app** — edit `apps/web/.env` (create from `apps/web/.env.example` if needed):

```bash
CMS_URL=http://localhost:3001
REVALIDATE_SECRET=dev-revalidate-secret

RAZORPAY_KEY_ID=rzp_test_paste_here
RAZORPAY_KEY_SECRET=paste_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_paste_here
```

**B. CMS (optional mirror of the public key id)** — edit `apps/cms/.env`:

```bash
RAZORPAY_KEY_ID=rzp_test_paste_here
```

(The **secret** belongs on **web** only. Never put `RAZORPAY_KEY_SECRET` in a `NEXT_PUBLIC_` variable.)

Exact names the code reads:

| Variable | Where | Purpose |
|----------|--------|---------|
| `RAZORPAY_KEY_ID` | `apps/web/.env` (required for Checkout) | Public key id |
| `RAZORPAY_KEY_SECRET` | `apps/web/.env` only | Server-side Orders API |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `apps/web/.env` optional | Same as Key ID if you want it on the client |
| `RAZORPAY_KEY_ID` | `apps/cms/.env` optional | Can also store on Org Profile in admin |

### 5. Restart and test donate

1. Stop and restart local apps:
   ```bash
   npm run dev:cms
   npm run dev:web
   ```
2. Open [http://localhost:3000](http://localhost:3000).
3. Click a preset (₹100 / ₹500 / …) → **Donate**.
4. **Success looks like:**
   - Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health) shows `"donateMode":"live"` (means keys detected — still Test Mode at Razorpay).
   - Razorpay **Checkout popup** opens (not the grey “Mock donate” banner).
   - Use Razorpay’s [test card / UPI test methods](https://razorpay.com/docs/payments/payments/test-card-upi-details/) to complete a fake payment.
   - You should see a payment success message on the page; the payment also appears under Dashboard → **Transactions** (Test Mode).

If you still see **“Mock donate”**, the secret or key id is missing/wrong in `apps/web/.env`, or you didn’t restart the web server.

---

## Part B — Cloudflare R2 (optional — skip if you only want donate)

**You can skip this whole section.** Without R2, uploads stay in `apps/cms/media/` on disk. That is fine for local v0.1. Do R2 only when you want cloud media / deploy.

### 1. Sign up Cloudflare

1. Open [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2. Create a free account and verify email.

### 2. Enable R2 and create a bucket

1. In the Cloudflare dashboard, open **R2** (left sidebar; may say **R2 Object Storage**).
2. Accept any “enable R2” prompt.
3. Click **Create bucket**.
4. Name it something like: `cpa-demo-media`.
5. Leave defaults → **Create**.

### 3. Create API tokens (access keys)

1. Still in **R2**, open **Manage R2 API Tokens** (or **Overview** → **API** / **Manage API tokens**).
2. **Create API token**.
3. Permissions: allow **Object Read & Write** on your bucket (or all buckets for a demo).
4. Create → copy:
   - **Access Key ID**
   - **Secret Access Key** (shown once)

Also note your **Account ID** (dashboard URL or R2 overview). You’ll need it for the endpoint:

`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

### 4. Public access (simplest path for 0.1)

Pick **one** simple approach:

**Option A — R2 public bucket development URL / r2.dev (easiest for demo)**  
1. Open the bucket → **Settings**.  
2. Enable **Public access** / **R2.dev subdomain** (wording varies).  
3. Copy the public base URL Cloudflare shows (e.g. `https://pub-xxxxx.r2.dev`).  
4. That value is `R2_PUBLIC_BASE_URL` (no trailing slash).

**Option B — Custom domain** (nicer later; more DNS steps)  
Connect a domain you already have in Cloudflare to the bucket, then use `https://media.yourdomain.org` as `R2_PUBLIC_BASE_URL`.

If public access UI is confusing, you can still set the four R2 credentials and leave `R2_PUBLIC_BASE_URL` empty for a moment — files upload to R2, but public URLs may fall back to the CMS file route until you set a public base.

### 5. Paste into CMS env

Edit `apps/cms/.env`:

```bash
R2_BUCKET=cpa-demo-media
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=paste_access_key
R2_SECRET_ACCESS_KEY=paste_secret
R2_REGION=auto
R2_PUBLIC_BASE_URL=https://pub-xxxxx.r2.dev
R2_PREFIX=orgs/demo
```

Exact names:

| Variable | Required for R2 mode? |
|----------|------------------------|
| `R2_BUCKET` | yes |
| `R2_ENDPOINT` | yes |
| `R2_ACCESS_KEY_ID` | yes |
| `R2_SECRET_ACCESS_KEY` | yes |
| `R2_PUBLIC_BASE_URL` | strongly recommended |
| `R2_PREFIX` | optional (default `orgs/demo`) |
| `R2_REGION` | optional (default `auto`) |

Restart CMS (`npm run dev:cms`). Check [http://localhost:3001/api/health](http://localhost:3001/api/health) → `"storageMode":"r2"`.

Then in admin (`/admin`) upload an image on a Media / Post cover — it should land in the R2 bucket (visible in Cloudflare → R2 → bucket → Objects).

---

## What to do today (short path)

1. Razorpay Test keys → `apps/web/.env` → restart → Donate opens Checkout.  
2. **Skip R2** unless you specifically want cloud uploads now.  
3. When ready for deploy hosts, paste the same vars into Vercel / Railway project env (not into git).

## Related

- Env checklist (names + who holds what): repo `docs/ops/env-checklist.md` and Project [`ops/env-checklist` via stack docs](./v0.1.md)  
- Locked scope: [`v0.1.md`](./v0.1.md)  
- Architecture: [`architecture.md`](./architecture.md)
