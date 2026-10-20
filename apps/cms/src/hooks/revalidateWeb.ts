import type { CollectionAfterChangeHook } from 'payload'

/** Notify apps/web to revalidate when a post/page is published. No-op if env unset. */
export const revalidateWeb: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  const url = process.env.WEB_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!url || !secret) {
    req.payload.logger.info('Publish hook: WEB_REVALIDATE_URL unset — skip revalidate')
    return doc
  }

  const status = (doc as { _status?: string })._status
  if (operation === 'create' || operation === 'update') {
    if (status && status !== 'published') return doc
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({
        tags: ['posts', 'pages'],
        slug: (doc as { slug?: string }).slug,
      }),
    })
  } catch (err) {
    req.payload.logger.error({ err }, 'Publish hook: revalidate failed')
  }

  return doc
}
