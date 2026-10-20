export type Layer = 'publish' | 'engage' | 'operate'

export const DEFAULT_LAYER: Layer = 'publish'

/** Env keys shared across apps — document who holds them in docs/ops/mode-a-b.md */
export const ENV_KEYS = {
  cms: [
    'PAYLOAD_SECRET',
    'DATABASE_URL', // file: SQLite local-only; postgresql:// required on Railway
    'PAYLOAD_PUBLIC_SERVER_URL',
    'R2_BUCKET',
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'WEB_REVALIDATE_URL',
    'REVALIDATE_SECRET',
  ],
  web: [
    'CMS_URL',
    'REVALIDATE_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  ],
} as const

/** Documented hosting targets — see docs/ops/deploy.md */
export const HOSTING = {
  web: { current: 'vercel', preferred: 'cloudflare-pages' },
  cms: { current: null, preferred: 'railway-postgres' },
} as const
