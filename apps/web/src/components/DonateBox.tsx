'use client'

import { useState } from 'react'
import { mockDonateMessage } from '@cpa/payments'

type RazorpayCheckout = {
  open: () => void
  on: (event: string, cb: (resp: unknown) => void) => void
}

type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayCheckout

declare global {
  interface Window {
    Razorpay?: RazorpayCtor
  }
}

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-cpa-razorpay]')
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.cpaRazorpay = '1'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function DonateBox({
  presets,
  mode,
  orgName,
}: {
  presets: number[]
  mode: 'live' | 'mock'
  orgName: string
}) {
  const [amount, setAmount] = useState(presets[0] || 100)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onDonate() {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountInr: amount }),
      })
      const data = (await res.json()) as {
        mode?: string
        message?: string
        orderId?: string
        keyId?: string
        amountPaise?: number
        currency?: string
      }

      if (data.mode === 'mock') {
        setMessage(data.message || mockDonateMessage(amount))
        return
      }

      if (!data.orderId || !data.keyId) {
        setMessage(data.message || 'Could not start Razorpay Checkout.')
        return
      }

      const ok = await loadRazorpayScript()
      if (!ok || !window.Razorpay) {
        setMessage(`Order ${data.orderId} created, but Checkout.js failed to load.`)
        return
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amountPaise ?? amount * 100,
        currency: data.currency || 'INR',
        name: orgName,
        description: 'Donation',
        order_id: data.orderId,
        handler: (response: unknown) => {
          const r = response as { razorpay_payment_id?: string }
          setMessage(
            r.razorpay_payment_id
              ? `Payment received (test/live): ${r.razorpay_payment_id}`
              : 'Payment completed.',
          )
        },
        theme: { color: '#1b6b5c' },
      })
      rzp.on('payment.failed', (resp: unknown) => {
        const r = resp as { error?: { description?: string } }
        setMessage(r.error?.description || 'Payment failed.')
      })
      rzp.open()
    } catch {
      setMessage('Donate request failed — is the web server running?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="cta-row">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            className="preset"
            onClick={() => setAmount(p)}
            aria-pressed={amount === p}
          >
            ₹{p}
          </button>
        ))}
        <button type="button" className="btn" disabled={busy} onClick={onDonate}>
          {busy ? 'Working…' : `Donate ₹${amount}`}
        </button>
      </div>
      <p className="muted" style={{ marginTop: '0.5rem' }}>
        Mode: <strong>{mode}</strong>
        {mode === 'mock' ? ' (no Razorpay keys — safe local path)' : ' (Razorpay Checkout when keys set)'}
      </p>
      {message ? <div className="banner-mock">{message}</div> : null}
    </div>
  )
}
