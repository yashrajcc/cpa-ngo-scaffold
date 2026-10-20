import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@cpa/theme', '@cpa/payments', '@cpa/config'],
}

export default nextConfig
