import Link from 'next/link'
import type { ReactNode } from 'react'

export function SiteChrome({
  brand,
  children,
}: {
  brand: string
  children: ReactNode
}) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          {brand}
        </Link>
        <nav className="nav">
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer muted">
        CPA Publish · v0.1 scaffold · not a production NGO site
      </footer>
    </div>
  )
}
