import Link from 'next/link'
import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPosts } from '@/lib/cms'
import { formatPostDate, resolvePostLayout } from '@/lib/post-layout'

export default async function BlogIndex() {
  const org = await getOrgProfile()
  const posts = await getPosts()
  const [featured, ...rest] = posts

  return (
    <SiteChrome brand={org.name} bleed>
      <section className="blog-index">
        <header className="blog-index-hero">
          <div className="blog-index-mist" aria-hidden="true" />
          <div className="blog-index-hero-inner">
            <p className="post-kicker">Archive</p>
            <h1>Blog</h1>
            <p className="blog-index-lede">
              Field notes and long-form stories — two reading layouts, one archive.
            </p>
          </div>
        </header>

        {featured ? (
          <article className="blog-feature">
            <p className="post-kicker">
              {resolvePostLayout(featured) === 'journal' ? 'Field notes' : 'Story'}
            </p>
            <h2>
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            {featured.excerpt ? <p className="blog-feature-dek">{featured.excerpt}</p> : null}
            <p className="muted">
              {formatPostDate(featured.publishedAt)}
              {' · '}
              <Link href={`/blog/${featured.slug}`}>Read</Link>
            </p>
          </article>
        ) : null}

        {rest.length ? (
          <div className="blog-archive">
            <h2 className="blog-archive-label">Earlier</h2>
            <ul className="blog-archive-list">
              {rest.map((post) => (
                <li key={post.id}>
                  <span className="blog-archive-kind">
                    {resolvePostLayout(post) === 'journal' ? 'Notes' : 'Story'}
                  </span>
                  <div>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    {post.excerpt ? <p className="muted">{post.excerpt}</p> : null}
                  </div>
                  <time className="muted" dateTime={post.publishedAt || undefined}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </SiteChrome>
  )
}
