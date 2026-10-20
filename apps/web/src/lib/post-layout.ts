import type { Post } from '@/lib/cms'

/** Presentation-only layout keys — not a CMS schema field. */
export type PostLayout = 'story' | 'journal'

const LAYOUT_BY_SLUG: Record<string, PostLayout> = {
  'why-we-tell-our-own-stories': 'story',
  'field-notes-last-month': 'journal',
}

export function resolvePostLayout(post: Pick<Post, 'slug'>): PostLayout {
  return LAYOUT_BY_SLUG[post.slug] || 'story'
}

export function formatPostDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Split plain body into paragraphs for layout rendering. */
export function bodyParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}
