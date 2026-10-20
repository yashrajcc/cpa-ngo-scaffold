# Ops modes A / B — env ownership

Same codebase. Different who-holds-what.

| Secret / access | Mode A: Yashraj + partner | Mode B: Partner-only |
|-----------------|---------------------------|----------------------|
| CF / Railway / R2 accounts | Shared vault; dual break-glass | Partner vault |
| `PAYLOAD_SECRET`, `DATABASE_URL` | Shared | Partner |
| R2 keys | Shared | Partner |
| Deploy / CI tokens | Shared | Partner |
| `RAZORPAY_KEY_SECRET` | **Org-owned**; ops help wire, do not become merchant | Same |
| `RAZORPAY_KEY_ID` (public) | Org / OrgProfile | Same |
| CMS editor accounts | NGO; ops break-glass only | Same |
| Support queue | Partner L1, Yashraj L2 product | Partner; escalate product bugs |

See also Project store `docs/architecture.md`.
