'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { imgSrc } from '../lib/basePath'

/* ── Mailchimp newsletter subscription ─────────────────────── */
// Standard Mailchimp embedded form POST — opens confirmation in new tab.
// Works on all static sites with no CORS/CSP issues.
const MAILCHIMP_ACTION = 'https://live.us2.list-manage.com/subscribe/post?u=b2ed6c2e33f82dc5e84b241ae&id=ba36deac56'

/* ── Social icons — inline SVG paths ───────────────────────── */
const SocialIcons = {
  Facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  Spotify: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
  AppleMusic: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.07c1.36.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 4.32zM12.03 6.96C11.88 5.02 13.47 3.4 15.3 3c.26 2.27-2.01 3.97-3.27 3.96z"/>
    </svg>
  ),
}

/* ── Social links ───────────────────────────────────────────── */
const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/brokenlinksmusic',                label: 'FB',  ariaLabel: 'Facebook',    icon: SocialIcons.Facebook   },
  { href: 'https://www.instagram.com/brokenlinksmusic',               label: 'IG',  ariaLabel: 'Instagram',   icon: SocialIcons.Instagram  },
  { href: 'https://x.com/broken_links',                               label: 'X',   ariaLabel: 'X / Twitter', icon: SocialIcons.X          },
  { href: 'https://www.youtube.com/user/brokenlinksmusic/',           label: 'YT',  ariaLabel: 'YouTube',     icon: SocialIcons.YouTube    },
  { href: 'https://www.tiktok.com/@brokenlinksmusic',                 label: 'TT',  ariaLabel: 'TikTok',      icon: SocialIcons.TikTok     },
  { href: 'https://open.spotify.com/artist/0VBx7ymL8y6CI3TgOFFhTz',  label: 'SP',  ariaLabel: 'Spotify',     icon: SocialIcons.Spotify    },
  { href: 'https://music.apple.com/gb/artist/broken-links/305262241', label: 'AM',  ariaLabel: 'Apple Music', icon: SocialIcons.AppleMusic },
]

/* ── Scroll-reveal hook ─────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}



/* ── Photo Modal ────────────────────────────────────────────── */
function PhotoModal({ photo, allPhotos, onClose, onNavigate }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate('prev')
      if (e.key === 'ArrowRight') onNavigate('next')
    }
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onNavigate])

  if (!photo || !mounted) return null

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '8px',
            lineHeight: 1,
            zIndex: 10,
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Image */}
        <img
          src={imgSrc(photo.localPath)}
          alt={photo.title || photo.albumTitle || 'Photo'}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        {/* Caption */}
        {(photo.title || photo.albumTitle) && (
          <div style={{
            marginTop: '16px',
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
          }}>
            {photo.title && <div>{photo.title}</div>}
            {photo.albumTitle && <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>{photo.albumTitle}</div>}
          </div>
        )}

        {/* Navigation arrows */}
        <button
          onClick={() => onNavigate('prev')}
          style={{
            position: 'absolute',
            left: -60,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '12px 16px',
            lineHeight: 1,
          }}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          onClick={() => onNavigate('next')}
          style={{
            position: 'absolute',
            right: -60,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '12px 16px',
            lineHeight: 1,
          }}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>
    </div>,
    document.body
  )
}

/* ── Video Modal ────────────────────────────────────────────── */
function VideoModal({ video, onClose }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!video || !mounted) return null

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 'min(1200px, 90vw)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '8px',
            lineHeight: 1,
            zIndex: 10,
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* YouTube iframe */}
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          width: '100%',
          background: '#000',
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
          />
        </div>

        {/* Video title */}
        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
        }}>
          <div style={{ color: 'white', marginBottom: '4px' }}>{video.title}</div>
          <div style={{ fontSize: '0.75rem' }}>{video.category} · {new Date(video.date).getFullYear()}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── Ticker ─────────────────────────────────────────────────── */
function Ticker({ stats }) {
  const TICKER_ITEMS = [
    'New material in progress',
    'Broken Links',
    'Alternative Rock',
    'UK',
    'Est. 2008',
    'brokenlinksmusic.co.uk',
    `${stats.albums} albums`,
    `${stats.newsArticles} news articles`,
    `${stats.liveShows} live shows`,
    `${stats.totalPhotos} photos`,
  ]
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">{item}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Section Header ─────────────────────────────────────────── */
function SectionHeader({ label, title, linkHref, linkLabel }) {
  return (
    <div className="section-header reveal">
      <div>
        <p className="section-label">{label}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {linkHref && (
        <Link href={linkHref} className="section-link">
          {linkLabel || 'View all →'}
        </Link>
      )}
    </div>
  )
}

/* ── Blog Card ──────────────────────────────────────────────── */
function BlogCard({ post, delay = 0 }) {
  return (
    <Link href={`/news/${post.slug}`} className={`card reveal delay-${delay}`} style={{ display: 'block' }}>
      <div className="card-image">
        <div className="card-image-overlay" />
        {post.image && post.image !== 'null' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc(post.image)}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--text-dim)',
          }}>
            //
          </div>
        )}
      </div>
      <div className="card-body">
        <p className="card-meta">
          <span>{post.category}</span>
          <span className="card-meta-sep" />
          <span>{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </p>
        <h3 className="card-title">{post.title}</h3>
        {post.excerpt && <p className="card-excerpt">{post.excerpt}</p>}
      </div>
    </Link>
  )
}

/* ── Album Card ─────────────────────────────────────────────── */
function AlbumCard({ album, delay = 0 }) {
  return (
    <Link href={`/music#${album.slug}`} className={`album-card reveal delay-${delay}`} style={{ display: 'block' }}>
      <div className="album-art">
        {album.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc(album.cover)}
            alt={album.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div className="album-art-placeholder">♩</div>
        )}
        <div className="album-overlay">
          <span className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '8px 14px' }}>
            Listen
          </span>
        </div>
      </div>
      <div className="album-info">
        <p className="album-title">{album.title}</p>
        <p className="album-year">{album.year}</p>
      </div>
    </Link>
  )
}

/* ── Photo Placeholder Grid ─────────────────────────────────── */
function PhotoPlaceholders() {
  const shades = ['#1a1a1a','#222','#1c1c1c','#252525','#1e1e1e','#202020','#242424','#1b1b1b']
  return (
    <div className="photo-grid">
      {shades.map((bg, i) => (
        <div
          key={i}
          className={`photo-thumb reveal delay-${(i % 6) + 1}`}
          style={{ background: bg }}
        >
          <div className="photo-thumb-overlay">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'white' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Next Show Banner ───────────────────────────────────────── */
function NextShowBanner({ gig }) {
  if (!gig) return null

  const d = new Date(gig.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isUpcoming = d >= today

  const day   = d.toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'UTC' })
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()
  const year  = d.getUTCFullYear()

  return (
    <div style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Link
          href="/live"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 40px)',
            padding: 'clamp(16px, 2.5vw, 24px) 0',
            textDecoration: 'none',
            flexWrap: 'wrap',
          }}
        >
          {/* Label */}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: isUpcoming ? 'var(--amber)' : 'var(--text-dim)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {isUpcoming ? '▶ Next Show' : '◎ Last Show'}
          </span>

          {/* Date block */}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            fontWeight: 700,
            color: 'var(--white)',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {day} {month} {year}
          </span>

          {/* Divider */}
          <span style={{ width: 1, height: 32, background: 'var(--border)', flexShrink: 0, display: 'block' }} />

          {/* Venue + location */}
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
              color: 'var(--white)',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {gig.venueName}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}>
              {[gig.city, gig.country].filter(Boolean).join(', ')}
            </span>
          </span>

          {/* Notes (support slot etc) */}
          {gig.notes && (
            <>
              <span style={{ width: 1, height: 32, background: 'var(--border)', flexShrink: 0, display: 'block' }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.05em',
                fontStyle: 'italic',
              }}>
                {gig.notes}
              </span>
            </>
          )}

          {/* Spacer + CTA */}
          <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <span className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '8px 16px' }}>
              {isUpcoming ? 'Tickets & Info →' : 'All Shows →'}
            </span>
          </span>
        </Link>
      </div>
    </div>
  )
}

/* ── Main Client Component ───────────────────────────────────── */
export default function HomeClient({ latestPosts, gigsData = [], allVideos = [], allPhotos = [], stats, albums = [] }) {
  useReveal()

  // Derive next gig client-side so the date comparison always uses today's real date,
  // not the date the static site was last built.
  const nextGig = (() => {
    const today = new Date().toISOString().slice(0, 10)
    const sorted = [...gigsData].sort((a, b) => new Date(a.date) - new Date(b.date))
    return sorted.find(g => g.date >= today && g.status !== 'cancelled')
      || [...sorted].reverse().find(g => g.status !== 'cancelled')
      || null
  })()

  // Create stats array from the stats object
  const STATS = [
    { number: stats.albums.toString(), label: 'Albums Released' },
    { number: stats.newsArticles.toString(), label: 'News Articles' },
    { number: stats.liveShows.toString(), label: 'Live Shows' },
    { number: stats.photoAlbums.toString(), label: 'Photo Albums' },
    { number: stats.yearsActive.toString(), label: 'Years Active' },
  ]
  
  // Use albums data passed from server
  const ALBUMS = albums
  
  // Shuffle videos at runtime (every page load gets different videos)
  const [featuredVideos, setFeaturedVideos] = useState([])
  
  useEffect(() => {
    // Fisher-Yates shuffle algorithm for videos
    const shuffled = [...allVideos]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setFeaturedVideos(shuffled.slice(0, 3))
  }, [allVideos])
  
  // Shuffle photos at runtime (every page load gets different photos)
  const [featuredPhotos, setFeaturedPhotos] = useState([])
  
  useEffect(() => {
    // Fisher-Yates shuffle algorithm for photos
    const shuffled = [...allPhotos]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setFeaturedPhotos(shuffled.slice(0, 8))
  }, [allPhotos])
  
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const openPhoto = (index) => {
    setPhotoIndex(index)
    setSelectedPhoto(featuredPhotos[index])
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction) => {
    const newIndex = direction === 'next'
      ? (photoIndex + 1) % featuredPhotos.length
      : (photoIndex - 1 + featuredPhotos.length) % featuredPhotos.length
    setPhotoIndex(newIndex)
    setSelectedPhoto(featuredPhotos[newIndex])
  }

  const openVideo = (video) => {
    setSelectedVideo(video)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero">
        {/* Nightclub atmosphere effects */}
        <div className="vhs-tracking" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <div className="film-grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <div className="bass-pulse" aria-hidden="true" />
        
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-grid-horizon" aria-hidden="true" />
        <div className="container">
          <div className="hero-content">

            {/* Band logo */}
            <div
              className="hero-logo-wrap"
              style={{
                animation: 'scaleIn 1s cubic-bezier(0.4,0,0.2,1) 0.2s both',
                marginBottom: 40,
                maxWidth: 520,
                marginLeft: 'auto',
                marginRight: 'auto',
                '--glitch-img': `url(${imgSrc('/images/logo.png')})`,
              }}
            >
              <div className="neon-sign-halo" aria-hidden="true" />
              <div className="glitch-logo--interrupt">
                <Image
                  src={imgSrc('/images/logo.png')}
                  alt="Broken Links"
                  width={500}
                  height={150}
                  priority
                  className="neon-sign-logo"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center center',
                    maxWidth: '100%',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
                <div className="glitch-scanbar" aria-hidden="true" />
              </div>
              <div className="neon-sign-smoke" aria-hidden="true" />
            </div>

            <p className="hero-subtitle" style={{ animation: 'fadeUp 0.9s ease 0.6s both', textAlign: 'center' }}>
              Alternative Rock · UK · Est. 2008
            </p>

            <div className="hero-cta" style={{ animation: 'fadeUp 0.9s ease 0.8s both', justifyContent: 'center' }}>
              <Link href="/music" className="btn btn-primary">
                ▶ Listen Now
              </Link>
              <a href="https://brokenlinks.bandcamp.com/merch" className="btn btn-outline" target="_blank" rel="noopener noreferrer" style={{ borderColor: 'rgba(212,175,55,0.5)', color: 'var(--gold)' }}>
                Buy
              </a>
              <Link href="/live" className="btn btn-outline">
                Live Shows
              </Link>
              <Link href="/videos" className="btn btn-outline" style={{ borderColor: 'rgba(255,58,26,0.4)', color: 'var(--red)' }}>
                Watch
              </Link>
            </div>

            {/* ── MOBILE ONLY: Socials + Subscribe ─────────────── */}
            <div className="hero-mobile-social" style={{ animation: 'fadeUp 0.9s ease 1s both' }}>
              <p className="hero-mobile-social__label">Follow us</p>
              <div className="hero-mobile-social__icons">
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

            <div className="hero-mobile-subscribe" style={{ animation: 'fadeUp 0.9s ease 1.1s both' }}>
              <p className="hero-mobile-subscribe__label">Get updates</p>
              <form
                action={MAILCHIMP_ACTION}
                method="post"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-mobile-subscribe__form"
              >
                <input
                  type="email"
                  name="EMAIL"
                  placeholder="your@email.com"
                  aria-label="Email address"
                  required
                  className="hero-mobile-subscribe__input"
                />
                {/* Mailchimp anti-bot honeypot — must stay hidden */}
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                  <input type="text" name="b_b2ed6c2e33f82dc5e84b241ae_ba36deac56" tabIndex="-1" defaultValue="" readOnly />
                </div>
                <button type="submit" className="btn btn-primary hero-mobile-subscribe__btn">
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Scroll indicator - enhanced for visibility */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────── */}
      <Ticker stats={stats} />

      {/* ── NEXT SHOW BANNER ─────────────────────────────────── */}
      <NextShowBanner gig={nextGig} />

      {/* ── STATS ────────────────────────────────────────────── */}
      <div className="container">
        <div className="stats-grid">
          {STATS.map(({ number, label }, i) => (
            <div key={label} className={`stat-item reveal delay-${i + 1}`}>
              <p className="stat-number">{number}</p>
              <p className="stat-label">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── LATEST POSTS ─────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <SectionHeader
            label="Latest"
            title="News"
            linkHref="/news"
            linkLabel="All news →"
          />
          <div className="grid-3">
            {latestPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} delay={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MUSIC ────────────────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <SectionHeader
            label="Discography"
            title="Music"
            linkHref="/music"
            linkLabel="Full discography →"
          />
          <div className="grid-3">
            {ALBUMS.map((album, i) => (
              <AlbumCard key={album.slug} album={album} delay={i + 1} />
            ))}
          </div>

          {/* Streaming links */}
          <div className="reveal" style={{
            marginTop: 40, padding: '24px', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', background: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>Stream & Download</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Available on all major platforms
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Spotify', 'Apple Music', 'Bandcamp', 'YouTube'].map((platform) => (
                <a key={platform} href="#" className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '8px 16px' }}>
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTOS ───────────────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <SectionHeader
            label="Gallery"
            title="Photos"
            linkHref="/photos"
            linkLabel="View gallery →"
          />
          <div className="photo-grid">
            {featuredPhotos.map((photo, i) => (
              <button
                key={photo.id || i}
                onClick={() => openPhoto(i)}
                className={`photo-thumb reveal delay-${(i % 6) + 1}`}
                style={{
                  display: 'block',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc(photo.localPath)}
                  alt={photo.title || photo.albumTitle || 'Photo'}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div className="photo-thumb-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'white' }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
          <p className="reveal" style={{
            marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            letterSpacing: '0.1em', color: 'var(--text-dim)', textAlign: 'center',
          }}>
            {stats.photoAlbums} albums · {stats.totalPhotos} photos
          </p>
        </div>
      </section>

      {/* ── VIDEOS TEASER ────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <SectionHeader
            label="Watch"
            title="Videos"
            linkHref="/videos"
            linkLabel="All videos →"
          />
          <div className="grid-3">
            {featuredVideos.map((video, i) => (
              <button
                key={video.id}
                onClick={() => openVideo(video)}
                className={`video-thumb reveal delay-${i + 1}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#111' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div className="play-btn">
                    <div className="play-icon" />
                  </div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                    color: 'var(--white)', margin: '0 0 4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {video.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    color: 'var(--text-dim)', margin: 0, letterSpacing: '0.05em',
                  }}>
                    {video.category} · {new Date(video.date).getFullYear()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER / CTA ─────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)', borderBottom: 'none' }}>
        <div className="container">
          <div className="reveal" style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'clamp(32px, 5vw, 64px)',
            background: 'var(--bg)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 2, background: 'linear-gradient(90deg, var(--amber), var(--red))', boxShadow: '0 0 8px var(--amber-glow)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 120, background: 'linear-gradient(to bottom, var(--amber), var(--red))', boxShadow: '0 0 8px var(--amber-glow)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 80, height: 2, background: 'linear-gradient(-90deg, var(--red), transparent)', boxShadow: '0 0 8px var(--red-glow)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: 80, background: 'linear-gradient(to top, var(--red), transparent)', boxShadow: '0 0 8px var(--red-glow)' }} />

            <div style={{ maxWidth: 560 }}>
              <p className="section-label" style={{ marginBottom: 16 }}>Stay Connected</p>
              <h2 style={{
                fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                color: 'var(--white)', marginBottom: 12,
              }}>
                Get updates direct to your inbox
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.9rem' }}>
                New releases, tour dates, and exclusive content — no spam, ever.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Photo Modal - client-side only to avoid hydration issues */}
      {isMounted && selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          allPhotos={featuredPhotos}
          onClose={closePhoto}
          onNavigate={navigatePhoto}
        />
      )}

      {/* Video Modal - client-side only to avoid hydration issues */}
      {isMounted && selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={closeVideo}
        />
      )}
    </>
  )
}

/* ── NewsletterForm component ───────────────────────────────── */
// Standard Mailchimp embedded form — POSTs directly to Mailchimp, opens
// their confirmation page in a new tab. No CORS/CSP issues on static sites.
function NewsletterForm() {
  return (
    <form
      action={MAILCHIMP_ACTION}
      method="post"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
    >
      <input
        type="email"
        name="EMAIL"
        placeholder="your@email.com"
        aria-label="Email address"
        required
        style={{
          flex: '1 1 220px',
          background: 'var(--surface)',
          border: '1px solid var(--muted)',
          borderRadius: 'var(--radius)',
          padding: '12px 16px',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          outline: 'none',
          transition: 'border-color 0.25s',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--amber)'; e.target.style.boxShadow = '0 0 8px var(--amber-glow)' }}
        onBlur={(e)  => { e.target.style.borderColor = 'var(--muted)'; e.target.style.boxShadow = 'none' }}
      />
      {/* Mailchimp anti-bot honeypot — must stay hidden */}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name="b_b2ed6c2e33f82dc5e84b241ae_ba36deac56" tabIndex="-1" defaultValue="" readOnly />
      </div>
      <button type="submit" className="btn btn-primary">
        Subscribe
      </button>
    </form>
  )
}

