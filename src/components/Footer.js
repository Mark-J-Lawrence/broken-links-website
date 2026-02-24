import Link from 'next/link'
import Image from 'next/image'
import { imgSrc } from '../lib/basePath'

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
  {
    title: 'Connect',
    links: [
      { href: 'https://open.spotify.com/artist/0VBx7ymL8y6CI3TgOFFhTz', label: 'Spotify',     external: true },
      { href: 'https://music.apple.com/gb/artist/broken-links/305262241',  label: 'Apple Music', external: true },
      { href: 'https://brokenlinks.bandcamp.com/',     label: 'Bandcamp',    external: true },
      { href: 'https://www.youtube.com/user/brokenlinksmusic/',      label: 'YouTube',     external: true },
    ],
  },
]

const SOCIAL = [
  { href: 'http://www.facebook.com/brokenlinks',  label: 'FB' },
  { href: 'https://www.instagram.com/brokenlinksmusic', label: 'IG' },
  { href: 'http://www.twitter.com/broken_links',   label: 'TW' },
  { href: 'https://www.youtube.com/user/brokenlinksmusic/',   label: 'YT' },
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
              {SOCIAL.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  {label}
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


