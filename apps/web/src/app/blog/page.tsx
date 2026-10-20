import Link from 'next/link'
import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPosts } from '@/lib/cms'

export default async function BlogIndex() {
  const org = await getOrgProfile()
  const posts = await getPosts()

  return (
    <SiteChrome brand={org.name}>
      <header className="page-intro">
        <h1>Blog</h1>
        <p>Field notes and long-term archive — published posts only.</p>
      </header>
      <div className="card-list">
        {posts.map((post) => (
          <article key={post.id}>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt ? <p className="muted">{post.excerpt}</p> : null}
          </article>
        ))}
      </div>
    </SiteChrome>
  )
}
