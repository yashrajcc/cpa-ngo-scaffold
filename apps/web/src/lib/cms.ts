const CMS_URL = process.env.CMS_URL || 'http://localhost:3001'

export type OrgProfile = {
  name: string
  tagline?: string | null
  aboutBlurb?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  razorpayKeyId?: string | null
  donatePresetsInr?: string | null
  layer?: string | null
}

export type Post = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  content?: unknown
  /** Demo-only plain body when CMS Lexical is empty */
  bodyFallback?: string
}

export type Page = {
  id: string | number
  title: string
  slug: string
  content?: unknown
}

async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      next: { tags: ['posts', 'pages', 'org'], revalidate: 60 },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function getOrgProfile(): Promise<OrgProfile> {
  const data = await cmsFetch<OrgProfile>('/api/globals/org-profile')
  return (
    data || {
      name: 'Sahara Community Collective',
      tagline:
        'Neighbourhood stories, field notes, and quiet solidarity — published for the people who keep this work going.',
      aboutBlurb:
        'Sahara Community Collective is a demo NGO for the CPA Publish scaffold — a calm, blog-first public site for neighbourhood organising and field storytelling.',
      contactEmail: 'hello@sahara-demo.example',
      donatePresetsInr: '100,500,1000',
    }
  )
}

export async function getPosts(): Promise<Post[]> {
  const data = await cmsFetch<{ docs: Post[] }>(
    '/api/posts?where[_status][equals]=published&sort=-publishedAt&limit=20',
  )
  return data?.docs?.length ? data.docs : fallbackPosts
}

export async function getPost(slug: string): Promise<Post | null> {
  const data = await cmsFetch<{ docs: Post[] }>(
    `/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  )
  const fromCms = data?.docs?.[0]
  const fallback = fallbackPosts.find((p) => p.slug === slug)
  if (!fromCms) return fallback || null
  return {
    ...fromCms,
    bodyFallback: fromCms.bodyFallback || fallback?.bodyFallback,
    excerpt: fromCms.excerpt || fallback?.excerpt,
  }
}

export async function getPage(slug: string): Promise<Page | null> {
  const data = await cmsFetch<{ docs: Page[] }>(
    `/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  )
  return data?.docs?.[0] || fallbackPages.find((p) => p.slug === slug) || null
}

const fallbackPosts: Post[] = [
  {
    id: 'f1',
    title: 'Why we tell our own stories',
    slug: 'why-we-tell-our-own-stories',
    excerpt: 'When the neighbourhood writes first, outsiders stop speaking for us.',
    publishedAt: new Date().toISOString(),
    bodyFallback: [
      'For years, funders and reporters arrived with a template already filled in. We were the backdrop. Our kitchens, our school gates, our evening meetings became illustrations for someone else’s narrative.',
      'So we started publishing ourselves. Not polished campaigns — ordinary updates: who cooked, who waited in the rain, who taught the alphabets after work. The blog is our ledger of presence.',
      'When neighbours write first, the story stops needing a translator. That is the whole point of a publish-first site.',
    ].join('\n\n'),
  },
  {
    id: 'f2',
    title: 'Field notes from the last month',
    slug: 'field-notes-last-month',
    excerpt: 'Three visits, one monsoon delay, and a kitchen that still feeds fifty.',
    publishedAt: new Date().toISOString(),
    bodyFallback: [
      'Week 1 — Visited the east lane kitchen twice. Gas refill delayed; neighbours shared stoves. Attendance held at forty-eight.',
      'Week 2 — Monsoon closed the community room for three evenings. We moved literacy circles to a covered verandah. Two new volunteers.',
      'Week 3 — Kitchen still feeding fifty on most days. Noted a request for larger pots before festival week. Follow up with the store committee.',
    ].join('\n\n'),
  },
]

const fallbackPages: Page[] = [
  {
    id: 'about',
    title: 'About',
    slug: 'about',
    content: null,
  },
  {
    id: 'contact',
    title: 'Contact',
    slug: 'contact',
    content: null,
  },
]

/** Very small Lexical JSON → plain text for v0.1 */
export function richTextToPlain(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''
  const parts: string[] = []
  const walk = (nodes: unknown[]) => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue
      const n = node as { type?: string; text?: string; children?: unknown[] }
      if (n.type === 'text' && n.text) parts.push(n.text)
      if (n.children) walk(n.children)
    }
  }
  walk(root.children)
  return parts.join(' ')
}
