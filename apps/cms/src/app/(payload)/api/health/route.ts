import { NextResponse } from 'next/server'
import { getStorageMode } from '@/lib/storageMode'

/** Public health — no secrets. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'cpa-cms',
    storageMode: getStorageMode(),
    r2PublicBaseConfigured: Boolean(process.env.R2_PUBLIC_BASE_URL?.trim()),
  })
}
