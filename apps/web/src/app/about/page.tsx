import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPage, richTextToPlain } from '@/lib/cms'

export default async function AboutPage() {
  const org = await getOrgProfile()
  const page = await getPage('about')
  const body =
    richTextToPlain(page?.content) ||
    org.aboutBlurb ||
    'Sahara Community Collective is a demo NGO for the CPA Publish scaffold — a calm, blog-first public site for neighbourhood organising and field storytelling.'

  return (
    <SiteChrome brand={org.name}>
      <article className="prose">
        <h1>{page?.title || 'About'}</h1>
        <p className="lede-block">{body}</p>
      </article>
    </SiteChrome>
  )
}
