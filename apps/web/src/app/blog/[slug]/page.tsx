import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/SiteChrome'
import { PostJournalLayout } from '@/components/PostJournalLayout'
import { PostStoryLayout } from '@/components/PostStoryLayout'
import { getOrgProfile, getPost, richTextToPlain } from '@/lib/cms'
import { resolvePostLayout } from '@/lib/post-layout'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const org = await getOrgProfile()
  const post = await getPost(slug)
  if (!post) notFound()

  const body =
    richTextToPlain(post.content) ||
    post.bodyFallback ||
    post.excerpt ||
    'No body yet.'
  const layout = resolvePostLayout(post)

  return (
    <SiteChrome brand={org.name} bleed={layout === 'story'}>
      {layout === 'journal' ? (
        <PostJournalLayout post={post} body={body} />
      ) : (
        <PostStoryLayout post={post} body={body} />
      )}
    </SiteChrome>
  )
}
