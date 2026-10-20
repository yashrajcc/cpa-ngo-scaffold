import { NextResponse } from 'next/server'
import { mockDonateMessage, resolveDonateConfig } from '@cpa/payments'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { amountInr?: number }
  const amountInr = Number(body.amountInr) || 100
  const donate = resolveDonateConfig({
    keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  })

  if (donate.mode === 'mock') {
    return NextResponse.json({
      mode: 'mock',
      message: mockDonateMessage(amountInr),
    })
  }

  // Live/test path: create Razorpay order via Orders API (secret server-side only).
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
      }),
    })
    const data = (await res.json()) as { id?: string; error?: { description?: string } }
    if (!res.ok || !data.id) {
      return NextResponse.json(
        {
          mode: 'live',
          message: data.error?.description || 'Razorpay order failed',
        },
        { status: 502 },
      )
    }
    return NextResponse.json({ mode: 'live', orderId: data.id, amountInr })
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
