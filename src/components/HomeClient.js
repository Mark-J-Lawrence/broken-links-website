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

const ALBUMS = [
  { title: 'Konflix::Statez',                  year: '2022', slug: 'konflux-statez',                  cover: '/images/uploads/2022/03/konflix-1.jpg' },
  { title: 'Conflict::States',                 year: '2021', slug: 'conflict-states',                 cover: '/images/uploads/2021/02/Broken-Links-Conflict-States-1600x1600-1.jpg' },
  { title: 'Divide/Restore',                   year: '2015', slug: 'divide-restore',                  cover: '/images/uploads/2009/04/broken-links-divide-restore-cover-800.jpg' },
  { title: 'Disasters: Ways to Leave a Scene', year: '2012', slug: 'disasters-ways-to-leave-a-scene', cover: '/images/uploads/2009/04/disasters-ways-to-leave-a-scene-cover-800.jpg' },
]

const STATS = [
  { number: '4', label: 'Albums Released' },
  { number: '189+', label: 'News Articles' },
  { number: '149+', label: 'Live Shows' },
  { number: '39',   label: 'Photo Albums' },
  { number: '18',  label: 'Years Active' },
]

const TICKER_ITEMS = [
  'New material in progress',
  'Broken Links',
  'Alternative Rock',
  'UK',
  'Est. 2008',
  'brokenlinksmusic.co.uk',
  '4 albums',
  '189 news articles',
  '149+ live shows',
  '912 photos',
]

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
function Ticker() {
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
export default function HomeClient({ latestPosts, nextGig, allVideos = [], allPhotos = [] }) {
  useReveal()
  
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
              <Link href="/live" className="btn btn-outline">
                Live Shows
              </Link>
              <Link href="/videos" className="btn btn-outline" style={{ borderColor: 'rgba(255,58,26,0.4)', color: 'var(--red)' }}>
                Watch
              </Link>
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
      <Ticker />

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
            39 albums · 912 photos
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

