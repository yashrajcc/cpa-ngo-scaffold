import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  transpilePackages: ['@cpa/config', '@cpa/payments'],
}

export default withPayload(nextConfig)
