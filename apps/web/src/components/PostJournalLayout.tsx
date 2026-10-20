import Link from 'next/link'
import type { Post } from '@/lib/cms'
import { bodyParagraphs, formatPostDate } from '@/lib/post-layout'

/** Field journal — ruled strip, date rail, compact reading column. */
export function PostJournalLayout({
  post,
  body,
}: {
  post: Post
  body: string
}) {
  const paragraphs = bodyParagraphs(body)
  const date = formatPostDate(post.publishedAt)

  return (
    <article className="post-journal">
      <div className="post-journal-frame">
        <aside className="post-journal-rail">
          <p className="post-kicker">Field notes</p>
          {date ? <p className="post-journal-date">{date}</p> : null}
          <Link className="post-journal-back" href="/blog">
            Archive
          </Link>
        </aside>

        <div className="post-journal-main">
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="post-journal-dek">{post.excerpt}</p> : null}
          <div className="post-journal-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
