# Testing

Cheap automated checks for v0.1. Human click-through stays in [`uat-checklist.md`](./uat-checklist.md).

## Run unit tests locally

```bash
npm install
npm test          # Vitest — @cpa/payments (mock vs keyed donate)
npm run typecheck # tsc --noEmit on @cpa/payments
```

Watch mode (payments package only):

```bash
npm run test:watch -w @cpa/payments
```

No Razorpay secrets required. Tests pass keys as plain function args (or set ephemeral `process.env` inside the test file and clear them after). Never put real keys in the repo.

## What CI runs

GitHub Actions workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

1. `npm ci`
2. `npm test`
3. `npm run typecheck`

## Still manual (UAT)

Automating a browser against CMS admin + donate Checkout is not worth it at 0.1. Before a demo org, run [`uat-checklist.md`](./uat-checklist.md) — especially §5a mock donate and §5b Razorpay Test when keys are set.
