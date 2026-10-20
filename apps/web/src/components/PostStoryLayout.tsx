import Link from 'next/link'
import type { Post } from '@/lib/cms'
import { bodyParagraphs, formatPostDate } from '@/lib/post-layout'

/** Editorial longform — full-bleed masthead + pull quote + narrow measure. */
export function PostStoryLayout({
  post,
  body,
}: {
  post: Post
  body: string
}) {
  const paragraphs = bodyParagraphs(body)
  const date = formatPostDate(post.publishedAt)

  return (
    <article className="post-story">
      <header className="post-story-mast">
        <div className="post-story-mist" aria-hidden="true" />
        <div className="post-story-inner">
          <p className="post-kicker">Story</p>
          <h1>{post.title}</h1>
          {date ? <p className="post-meta">{date}</p> : null}
        </div>
      </header>

      <div className="post-story-body">
        {post.excerpt ? <blockquote className="post-pull">{post.excerpt}</blockquote> : null}
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="post-back">
          <Link href="/blog">← All posts</Link>
        </p>
      </div>
    </article>
  )
}
