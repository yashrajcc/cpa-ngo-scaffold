import Link from 'next/link'
import { parsePresets, resolveDonateConfig } from '@cpa/payments'
import { SiteChrome } from '@/components/SiteChrome'
import { DonateBox } from '@/components/DonateBox'
import { getOrgProfile, getPosts } from '@/lib/cms'

export default async function HomePage() {
  const org = await getOrgProfile()
  const posts = (await getPosts()).slice(0, 3)
  const donate = resolveDonateConfig({
    keyId: org.razorpayKeyId || process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    presetsRaw: org.donatePresetsInr,
  })

  return (
    <SiteChrome brand={org.name}>
      <section className="hero">
        <p className="muted">Publish layer · demo org</p>
        <h1>{org.name}</h1>
        <p>{org.tagline || 'Stories first. Donate when you can.'}</p>
        <div className="cta-row">
          <Link className="btn" href="/blog">
            Read the blog
          </Link>
          <Link className="btn secondary" href="/about">
            About
          </Link>
        </div>
      </section>

      <section>
        <h2 style={{ fontFamily: 'var(--cpa-serif)' }}>Support this work</h2>
        <DonateBox presets={donate.presetsInr.length ? donate.presetsInr : parsePresets(null)} mode={donate.mode} />
      </section>

      <section className="card-list">
        <h2 style={{ fontFamily: 'var(--cpa-serif)' }}>Latest</h2>
        {posts.map((post) => (
          <article key={post.id}>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt ? <p className="muted">{post.excerpt}</p> : null}
          </article>
        ))}
      </section>
    </SiteChrome>
  )
}
