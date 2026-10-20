import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { tags?: string[] }
  const tags = body.tags?.length ? body.tags : ['posts', 'pages', 'org']
  for (const tag of tags) revalidateTag(tag)

  return NextResponse.json({ ok: true, revalidated: tags })
}
