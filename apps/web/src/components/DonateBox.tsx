'use client'

import { useState } from 'react'
import { mockDonateMessage } from '@cpa/payments'

export function DonateBox({
  presets,
  mode,
}: {
  presets: number[]
  mode: 'live' | 'mock'
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
      }
      if (data.mode === 'mock') {
        setMessage(data.message || mockDonateMessage(amount))
      } else if (data.orderId) {
        setMessage(`Test order created: ${data.orderId}. Wire Checkout.js next.`)
      } else {
        setMessage(data.message || 'Donate request completed.')
      }
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
        {mode === 'mock' ? ' (no Razorpay keys — safe local path)' : ' (Razorpay keys detected)'}
      </p>
      {message ? <div className="banner-mock">{message}</div> : null}
    </div>
  )
}
