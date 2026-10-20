export type DonateMode = 'live' | 'mock'

export type DonateConfig = {
  mode: DonateMode
  keyId: string | null
  presetsInr: number[]
}

export function parsePresets(raw?: string | null): number[] {
  if (!raw) return [100, 500, 1000]
  return raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0)
}

/** Server-side: prefer secret presence to decide live vs mock. */
export function resolveDonateConfig(opts: {
  keyId?: string | null
  keySecret?: string | null
  presetsRaw?: string | null
}): DonateConfig {
  const keyId = opts.keyId || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null
  const keySecret = opts.keySecret || process.env.RAZORPAY_KEY_SECRET || null
  const live = Boolean(keyId && keySecret)
  return {
    mode: live ? 'live' : 'mock',
    keyId: live ? keyId : null,
    presetsInr: parsePresets(opts.presetsRaw),
  }
}

export function mockDonateMessage(amountInr: number): string {
  return `Mock donate ₹${amountInr} — set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to enable test Checkout.`
}
