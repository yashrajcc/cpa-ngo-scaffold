/** Media backend selection — no secrets logged. */
export type StorageMode = 'r2' | 'local'

export function getStorageMode(): StorageMode {
  const ready =
    Boolean(process.env.R2_BUCKET?.trim()) &&
    Boolean(process.env.R2_ENDPOINT?.trim()) &&
    Boolean(process.env.R2_ACCESS_KEY_ID?.trim()) &&
    Boolean(process.env.R2_SECRET_ACCESS_KEY?.trim())
  return ready ? 'r2' : 'local'
}

export function r2PublicBase(): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL?.trim()
  return base ? base.replace(/\/$/, '') : null
}
