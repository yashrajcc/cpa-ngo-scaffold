import { NextResponse } from 'next/server'
import { resolveDonateConfig } from '@cpa/payments'

/** Public health — no secrets. */
export async function GET() {
  const donate = resolveDonateConfig({
    keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  })
  return NextResponse.json({
    ok: true,
    service: 'cpa-web',
    donateMode: donate.mode,
    cmsUrlConfigured: Boolean(process.env.CMS_URL?.trim()),
  })
}
