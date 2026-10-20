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

  const lede =
    org.tagline && !org.tagline.toLowerCase().includes('cms offline')
      ? org.tagline
      : 'Neighbourhood stories, field notes, and quiet solidarity — published for the people who keep this work going.'

  return (
    <SiteChrome brand={org.name} home>
      <section className="hero" aria-label="Welcome">
        <div className="hero-atmosphere" aria-hidden="true" />
        <div className="hero-inner">
          <h1 className="brand-mark">{org.name}</h1>
          <p className="lede">{lede}</p>
          <div className="cta-row">
            <Link className="btn" href="/blog">
              Read the blog
            </Link>
            <Link className="btn secondary" href="/about">
              About us
            </Link>
          </div>
        </div>
      </section>

      <section className="band">
        <h2 className="band-title">Support this work</h2>
        <p className="band-lead">Choose an amount. Live Razorpay when keys are set; otherwise a safe mock path.</p>
        <DonateBox
          presets={donate.presetsInr.length ? donate.presetsInr : parsePresets(null)}
          mode={donate.mode}
          orgName={org.name}
        />
      </section>

      <section className="band">
        <h2 className="band-title">Latest from the field</h2>
        <p className="band-lead">Recent posts — the blog is the heart of this site.</p>
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
      </section>
    </SiteChrome>
  )
}
