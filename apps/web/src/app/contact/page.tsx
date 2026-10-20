import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPage, richTextToPlain } from '@/lib/cms'

export default async function ContactPage() {
  const org = await getOrgProfile()
  const page = await getPage('contact')
  const body = richTextToPlain(page?.content)

  return (
    <SiteChrome brand={org.name}>
      <article className="prose">
        <h1 style={{ fontFamily: 'var(--cpa-serif)' }}>{page?.title || 'Contact'}</h1>
        {body ? <p>{body}</p> : null}
        <p>
          {org.contactEmail ? (
            <>
              Email: <a href={`mailto:${org.contactEmail}`}>{org.contactEmail}</a>
              <br />
            </>
          ) : null}
          {org.contactPhone ? <>Phone: {org.contactPhone}</> : null}
        </p>
      </article>
    </SiteChrome>
  )
}
