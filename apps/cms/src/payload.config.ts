import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { OrgProfile } from './globals/OrgProfile'
import { getStorageMode, r2PublicBase } from './lib/storageMode'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storageMode = getStorageMode()
const publicBase = r2PublicBase()
const mediaPrefix = (process.env.R2_PREFIX || 'orgs/demo').replace(/^\/|\/$/g, '')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· CPA CMS',
    },
  },
  collections: [Users, Media, Posts, Pages],
  globals: [OrgProfile],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-change-me-cpa-0.1',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
  }),
  sharp,
  plugins: [
    ...(storageMode === 'r2'
      ? [
          s3Storage({
            bucket: process.env.R2_BUCKET as string,
            disableLocalStorage: true,
            collections: {
              media: {
                prefix: mediaPrefix,
                generateFileURL: ({ filename, prefix }) => {
                  const key = [prefix, filename].filter(Boolean).join('/')
                  if (publicBase) return `${publicBase}/${key}`
                  const server = (process.env.PAYLOAD_PUBLIC_SERVER_URL || '').replace(/\/$/, '')
                  return `${server}/api/media/file/${filename}`
                },
              },
            },
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
              },
              region: process.env.R2_REGION || 'auto',
              endpoint: process.env.R2_ENDPOINT,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  onInit: async (payload) => {
    payload.logger.info(`Media storage mode: ${storageMode}${storageMode === 'r2' ? ` (prefix ${mediaPrefix})` : ' (./media disk)'}`)
  },
})
