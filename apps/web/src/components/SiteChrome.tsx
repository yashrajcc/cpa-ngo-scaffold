import Link from 'next/link'
import type { ReactNode } from 'react'

export function SiteChrome({
  brand,
  children,
  home = false,
  bleed = false,
}: {
  brand: string
  children: ReactNode
  /** Full-bleed home: transparent header over hero atmosphere */
  home?: boolean
  /** Full-width main (blog index / story masthead) */
  bleed?: boolean
}) {
  const shellClass = [
    'site-shell',
    home ? 'is-home' : '',
    bleed && !home ? 'is-bleed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClass}>
      <header className="site-header">
        <Link className="brand" href="/">
          {brand}
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer muted">
        {brand} · CPA Publish demo · not a production NGO site
      </footer>
    </div>
  )
}
