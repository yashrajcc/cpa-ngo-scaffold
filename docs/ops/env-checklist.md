# Env checklist

Copy examples, then fill only what you have. **Missing R2 / Razorpay is OK for local boot.**

## CMS (`apps/cms/.env`)

| Var | Required locally? | Notes |
|-----|-------------------|-------|
| `PAYLOAD_SECRET` | yes | any long string in dev |
| `DATABASE_URL` | yes | default `file:./payload.db` |
| `R2_*` | no | if unset → local `media/` disk |
| `WEB_REVALIDATE_URL` | no | publish hook no-ops if unset |
| `REVALIDATE_SECRET` | with revalidate URL | must match web |

## Web (`apps/web/.env`)

| Var | Required locally? | Notes |
|-----|-------------------|-------|
| `CMS_URL` | yes | `http://localhost:3001` |
| `REVALIDATE_SECRET` | for live publish hook | match CMS |
| `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` | no | both unset → mock donate |
