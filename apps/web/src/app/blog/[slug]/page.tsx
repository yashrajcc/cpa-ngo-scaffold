import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPost, richTextToPlain } from '@/lib/cms'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const org = await getOrgProfile()
  const post = await getPost(slug)
  if (!post) notFound()

  const body = richTextToPlain(post.content) || post.excerpt || 'No body yet.'

  return (
    <SiteChrome brand={org.name}>
      <article className="prose">
        <p className="muted">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN') : ''}</p>
        <h1 style={{ fontFamily: 'var(--cpa-serif)' }}>{post.title}</h1>
        <p>{body}</p>
      </article>
    </SiteChrome>
  )
}
