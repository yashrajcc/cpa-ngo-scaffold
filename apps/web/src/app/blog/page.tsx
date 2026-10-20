import Link from 'next/link'
import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPosts } from '@/lib/cms'

export default async function BlogIndex() {
  const org = await getOrgProfile()
  const posts = await getPosts()

  return (
    <SiteChrome brand={org.name}>
      <h1 style={{ fontFamily: 'var(--cpa-serif)' }}>Blog</h1>
      <p className="muted">Long-term archive starts here — published posts only.</p>
      <div className="card-list">
        {posts.map((post) => (
          <article key={post.id}>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
          </article>
        ))}
      </div>
    </SiteChrome>
  )
}
