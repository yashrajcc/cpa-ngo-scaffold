import { SiteChrome } from '@/components/SiteChrome'
import { getOrgProfile, getPage, richTextToPlain } from '@/lib/cms'

export default async function ContactPage() {
  const org = await getOrgProfile()
  const page = await getPage('contact')
  const body =
    richTextToPlain(page?.content) ||
    'We read every note. Reach out for partnerships, press, or a quiet hello from the neighbourhood.'

  return (
    <SiteChrome brand={org.name}>
      <article className="prose">
        <h1>{page?.title || 'Contact'}</h1>
        <p className="lede-block">{body}</p>
        <div className="contact-block">
          {org.contactEmail ? (
            <p>
              Email{' '}
              <a href={`mailto:${org.contactEmail}`}>{org.contactEmail}</a>
            </p>
          ) : (
            <p>
              Email{' '}
              <a href="mailto:hello@sahara-demo.example">hello@sahara-demo.example</a>
            </p>
          )}
          {org.contactPhone ? <p className="muted">Phone {org.contactPhone}</p> : null}
        </div>
      </article>
    </SiteChrome>
  )
}
