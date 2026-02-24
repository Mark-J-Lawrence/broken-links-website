'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { imgSrc } from '../lib/basePath'

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/news',     label: 'News' },
  { href: '/about',    label: 'About' },
  { href: '/live',     label: 'Live' },
  { href: '/music',    label: 'Music' },
  { href: '/videos',   label: 'Videos' },
  { href: '/photos',   label: 'Photos' },
  { href: '/press',    label: 'Press' },
  { href: 'https://brokenlinks.bandcamp.com/merch', label: 'Shop', external: true },
  { href: '/contact',  label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="site-logo" aria-label="Broken Links — home">
            <Image
              src={imgSrc('/images/logo.png')}
              alt="Broken Links"
              width={160}
              height={48}
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
              priority
            />
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label, external }) => {
              if (external) {
                return (
                  <a
                    key={href}
                    href={href}
                    className="nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                )
              }
              const isActive = href === '/'
                ? pathname === '/'
                : pathname === href || pathname?.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link${isActive ? ' active' : ''}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <button
            className={`menu-toggle${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <nav
        className={`mobile-nav${menuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ href, label, external }) => {
          if (external) {
            return (
              <a
                key={href}
                href={href}
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            )
          }
          const isActive = href === '/'
            ? pathname === '/'
            : pathname === href || pathname?.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}


