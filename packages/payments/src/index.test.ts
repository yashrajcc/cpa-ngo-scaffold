import { afterEach, describe, expect, it } from 'vitest'
import { mockDonateMessage, parsePresets, resolveDonateConfig } from './index'

const ENV_KEYS = [
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
] as const

afterEach(() => {
  for (const key of ENV_KEYS) {
    delete process.env[key]
  }
})

describe('parsePresets', () => {
  it('returns defaults when raw is empty', () => {
    expect(parsePresets()).toEqual([100, 500, 1000])
    expect(parsePresets(null)).toEqual([100, 500, 1000])
    expect(parsePresets('')).toEqual([100, 500, 1000])
  })

  it('parses comma-separated INR amounts', () => {
    expect(parsePresets('100,500')).toEqual([100, 500])
    expect(parsePresets(' 250 , 750 , 2000 ')).toEqual([250, 750, 2000])
  })

  it('drops non-finite and non-positive values', () => {
    expect(parsePresets('100,abc,0,-5,500')).toEqual([100, 500])
  })
})

describe('resolveDonateConfig', () => {
  it('uses mock mode when keys are missing', () => {
    expect(resolveDonateConfig({})).toEqual({
      mode: 'mock',
      keyId: null,
      presetsInr: [100, 500, 1000],
    })
  })

  it('uses mock when only keyId is provided', () => {
    expect(
      resolveDonateConfig({ keyId: 'rzp_test_only_id', keySecret: null }),
    ).toEqual({
      mode: 'mock',
      keyId: null,
      presetsInr: [100, 500, 1000],
    })
  })

  it('uses mock when only keySecret is provided', () => {
    expect(
      resolveDonateConfig({ keyId: null, keySecret: 'secret_only' }),
    ).toEqual({
      mode: 'mock',
      keyId: null,
      presetsInr: [100, 500, 1000],
    })
  })

  it('uses live mode when both keyId and keySecret are provided', () => {
    expect(
      resolveDonateConfig({
        keyId: 'rzp_test_keyed',
        keySecret: 'test_secret',
        presetsRaw: '200,1000',
      }),
    ).toEqual({
      mode: 'live',
      keyId: 'rzp_test_keyed',
      presetsInr: [200, 1000],
    })
  })

  it('reads keyed live mode from env when opts omit keys', () => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_from_env'
    process.env.RAZORPAY_KEY_SECRET = 'env_secret'

    expect(resolveDonateConfig({})).toEqual({
      mode: 'live',
      keyId: 'rzp_test_from_env',
      presetsInr: [100, 500, 1000],
    })
  })

  it('falls back to NEXT_PUBLIC_RAZORPAY_KEY_ID with secret for live', () => {
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_public'
    process.env.RAZORPAY_KEY_SECRET = 'env_secret'

    expect(resolveDonateConfig({})).toEqual({
      mode: 'live',
      keyId: 'rzp_test_public',
      presetsInr: [100, 500, 1000],
    })
  })

  it('stays mock when env has keyId but no secret', () => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_incomplete'

    expect(resolveDonateConfig({})).toEqual({
      mode: 'mock',
      keyId: null,
      presetsInr: [100, 500, 1000],
    })
  })
})

describe('mockDonateMessage', () => {
  it('mentions the amount and key requirement', () => {
    const msg = mockDonateMessage(500)
    expect(msg).toContain('₹500')
    expect(msg).toMatch(/RAZORPAY_KEY_ID/)
    expect(msg).toMatch(/RAZORPAY_KEY_SECRET/)
  })
})
