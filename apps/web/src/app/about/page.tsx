import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPage, richTextToPlain } from '@/lib/cms'

export default async function AboutPage() {
  const org = await getOrgProfile()
  const page = await getPage('about')
  const body =
    richTextToPlain(page?.content) ||
    org.aboutBlurb ||
    'About content loads from the CMS Pages collection (slug: about).'

  return (
    <SiteChrome brand={org.name}>
      <article className="prose">
        <h1 style={{ fontFamily: 'var(--cpa-serif)' }}>{page?.title || 'About'}</h1>
        <p>{body}</p>
      </article>
    </SiteChrome>
  )
}
