import { NextResponse } from 'next/server'
import { mockDonateMessage, resolveDonateConfig } from '@cpa/payments'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { amountInr?: number }
  const amountInr = Number(body.amountInr) || 100
  const donate = resolveDonateConfig({
    keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  })

  if (donate.mode === 'mock' || !donate.keyId) {
    return NextResponse.json({
      mode: 'mock',
      message: mockDonateMessage(amountInr),
    })
  }

  try {
    const auth = Buffer.from(`${donate.keyId}:${process.env.RAZORPAY_KEY_SECRET}`).toString(
      'base64',
    )
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amountInr * 100),
        currency: 'INR',
        receipt: `cpa_${Date.now()}`,
        notes: { source: 'cpa-v0.1' },
      }),
    })
    const data = (await res.json()) as {
      id?: string
      amount?: number
      currency?: string
      error?: { description?: string }
    }
    if (!res.ok || !data.id) {
      return NextResponse.json(
        {
          mode: 'live',
          message: data.error?.description || 'Razorpay order failed',
        },
        { status: 502 },
      )
    }

    // Public key id is safe to return for Checkout.js
    return NextResponse.json({
      mode: 'live',
      orderId: data.id,
      amountInr,
      amountPaise: data.amount ?? Math.round(amountInr * 100),
      currency: data.currency || 'INR',
      keyId: donate.keyId,
    })
  } catch (err) {
    return NextResponse.json(
      {
        mode: 'live',
        message: err instanceof Error ? err.message : 'Razorpay request error',
      },
      { status: 502 },
    )
  }
}
