import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

type LexicalSeed = {
  root: {
    type: 'root'
    children: Array<{
      type: string
      version: number
      children: Array<{ type: string; text: string; version: number }>
    }>
    direction: null
    format: ''
    indent: number
    version: number
  }
}

function paragraph(text: string): LexicalSeed {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'text', version: 1, text }],
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'org-profile',
    data: {
      name: 'Sahara Community Collective',
      tagline: 'Stories and solidarity from the neighbourhood.',
      layer: 'publish',
      aboutBlurb:
        'A demo Indian CBO using the CPA Publish layer — blog-first site with a simple donate path.',
      contactEmail: 'hello@demo-cbo.example',
      contactPhone: '+91 90000 00000',
      donatePresetsInr: '100,500,1000',
    },
  })

  const pages = [
    {
      title: 'About',
      slug: 'about',
      content: paragraph(
        'We work with communities on livelihood and dignity. This About page is seed content for v0.1.',
      ),
    },
    {
      title: 'Contact',
      slug: 'contact',
      content: paragraph(
        'Email hello@demo-cbo.example or call +91 90000 00000. (Demo seed — not a real inbox.)',
      ),
    },
  ]

  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: { ...page, _status: 'published' },
      })
    } else {
      await payload.create({
        collection: 'pages',
        data: { ...page, _status: 'published' },
      })
    }
  }

  const posts = [
    {
      title: 'Why we tell our own stories',
      slug: 'why-we-tell-our-own-stories',
      excerpt: 'A blog-first site starts with the work, not a brochure.',
      publishedAt: new Date().toISOString(),
      content: paragraph(
        'Seed post one. Editors can replace this from /admin without a developer.',
      ),
    },
    {
      title: 'Field notes from the last month',
      slug: 'field-notes-last-month',
      excerpt: 'Updates from volunteers and community partners.',
      publishedAt: new Date().toISOString(),
      content: paragraph(
        'Seed post two — long-term archive starts with simple published posts.',
      ),
    },
    {
      title: 'How to support this work',
      slug: 'how-to-support',
      excerpt: 'Donate via the test Razorpay path, or mock donate locally.',
      publishedAt: new Date().toISOString(),
      content: paragraph(
        'Seed post three. The Home page Donate CTA reads presets from Org Profile.',
      ),
    },
  ]

  for (const post of posts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        data: { ...post, _status: 'published' },
      })
    } else {
      await payload.create({
        collection: 'posts',
        data: { ...post, _status: 'published' },
      })
    }
  }

  payload.logger.info('Demo org seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
