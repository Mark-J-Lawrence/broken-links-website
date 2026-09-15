import Link from 'next/link'
import Image from 'next/image'
import { imgSrc } from '../lib/basePath'
import { SOCIAL_LINKS } from '../lib/socialLinks'

const NAV_COLS = [
  {
    title: 'Navigate',
    links: [
      { href: '/about',   label: 'About' },
      { href: '/music',   label: 'Music' },
      { href: '/videos',  label: 'Videos' },
      { href: '/live',    label: 'Live Shows' },
      { href: '/photos',  label: 'Photos' },
    ],
  },
  {
    title: 'Content',
    links: [
      { href: '/news',         label: 'News' },
      { href: '/press',        label: 'Press' },
      { href: '/live/history', label: 'Show History' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <Link href="/" aria-label="Broken Links — home" style={{ display: 'inline-block', marginBottom: 16 }}>
              <Image
                src={imgSrc('/images/logo.png')}
                alt="Broken Links"
                width={180}
                height={54}
                style={{ objectFit: 'contain', objectPosition: 'left center', opacity: 0.9 }}
              />
            </Link>
            <p className="footer-tagline">
              Alternative rock from the UK. Blending electronic, rock, and pop with cinematic intensity.
            </p>
            <div className="footer-social">
              {SOCIAL_LINKS.map(({ href, label, ariaLabel, icon }) => (
                <a
                  key={label}
                  href={href}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(({ title, links }) => (
            <div key={title}>
              <p className="footer-col-title">{title}</p>
              <ul className="footer-links">
                {links.map(({ href, label, external }) => (
                  <li key={href}>
                    {external ? (
                      <a href={href} className="footer-link" target="_blank" rel="noopener noreferrer">
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className="footer-link">{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {year} Broken Links. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
