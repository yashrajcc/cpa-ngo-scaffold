import type { Metadata } from 'next'
import '@cpa/theme/styles.css'

export const metadata: Metadata = {
  title: 'CPA Publish',
  description: 'Blog-first NGO site scaffold (v0.1)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
