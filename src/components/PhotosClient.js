'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import PageTitle from './PageTitle'
import photosData from '../data/photos.json'
import { imgSrc } from '../lib/basePath'

/* ── Build albums with cover images ──────────────────────────── */
const SORTED_ALBUMS_DATA = [...photosData].sort((a, b) =>
  new Date(b.date) - new Date(a.date)
)

const ALL_ALBUMS = SORTED_ALBUMS_DATA.map(album => ({
  id: album.slug,
  title: album.title,
  count: album.imageCount,
  date: album.date,
  coverImage: album.images[0]?.localPath || null, // First image as cover
  images: album.images.map(img => ({
    id: String(img.id),
    title: img.title || album.title,
    src: img.localPath,
    caption: img.title || '',
  })),
}))

/* ── Photo Modal / Lightbox ──────────────────────────────────── */
// photo     = the photo object from ALL_ALBUMS (stable reference from the array)
// albumTitle = plain string, not an object — avoids creating a new object on every render
function PhotoModal({ photo, albumTitle, photos, albumId, isOpen, onClose, onPrev, onNext }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft')  onPrev()
    }
    document.addEventListener('keydown', onKey)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty('--scrollbar-w', `${scrollbarWidth}px`)
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.documentElement.style.removeProperty('--scrollbar-w')
    }
  }, [isOpen, onClose, onNext, onPrev])

  // Update URL silently via history API — bypasses Next.js router entirely
  // so no navigation event fires, no re-render, no page flash.
  useEffect(() => {
    if (isOpen && photo && albumId) {
      const targetUrl = `/photos/${albumId}/${photo.id}/`
      if (window.location.pathname !== targetUrl) {
        window.history.replaceState(null, '', targetUrl)
      }
    }
  }, [isOpen, photo, albumId])

  const currentIndex = photo ? photos.findIndex(p => p.id === photo.id) : 0
  const total = photos.length

  if (!mounted) return null
  return createPortal(
    <div
      className={`modal-backdrop${isOpen ? ' is-open' : ''}`}
      onClick={(e) => { if (isOpen && e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={photo?.title}
    >
      <div className="modal-panel photo-modal-panel">
        {/* Header */}
        <div className="modal-header">
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>{albumTitle}</p>
            <h2 className="modal-title">{photo?.caption || photo?.title}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.15em', color: 'var(--text-dim)',
            }}>
              {currentIndex + 1} / {total}
            </span>
            <button className="modal-close" onClick={onClose} aria-label="Close photo">✕</button>
          </div>
        </div>

        {/* Photo — always a single <img> in the DOM so the previous photo
            stays visible while the next one loads (no blank-flash on nav) */}
        <div className="photo-modal-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo ? imgSrc(photo.src) : undefined}
            alt={photo ? `Broken Links — ${photo.caption || photo.title}` : ''}
            className="photo-modal-img"
            style={{ visibility: photo ? 'visible' : 'hidden' }}
          />

          {/* Prev / Next arrows */}
          <button
            className="photo-nav photo-nav-prev"
            onClick={onPrev}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="photo-nav photo-nav-next"
            onClick={onNext}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>

        {/* Caption */}
        <div className="modal-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {albumTitle}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.15em', color: 'var(--text-dim)',
            textTransform: 'uppercase', margin: 0,
          }}>
            Use ← → keys to navigate
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── Album Card Component ────────────────────────────────────── */
function AlbumCard({ album, onClick }) {
  return (
    <div
      className="album-card reveal"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`View ${album.title} album (${album.count} photos)`}
    >
      <div className="album-card-cover">
        {album.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc(album.coverImage)}
            alt={`Broken Links — ${album.title}`}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        <div className="album-card-overlay">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      </div>
      <div className="album-card-info">
        <h3 className="album-card-title">{album.title}</h3>
        <p className="album-card-meta">
          {album.count} {album.count === 1 ? 'photo' : 'photos'}
        </p>
      </div>
    </div>
  )
}

/* ── URL parsing helper ──────────────────────────────────────── */
/**
 * Parses the current pathname to extract album slug and photo ID.
 * Handles:
 *   /photos/                          → { albumSlug: null, photoId: null }
 *   /photos/some-album-slug/          → { albumSlug: 'some-album-slug', photoId: null }
 *   /photos/some-album-slug/18194/    → { albumSlug: 'some-album-slug', photoId: '18194' }
 */
function parsePhotosPath(pathname) {
  // Strip trailing slash then split
  const parts = pathname.replace(/\/$/, '').split('/')
  // parts[0] = '', parts[1] = 'photos', parts[2] = albumSlug?, parts[3] = photoId?
  const albumSlug = parts[2] || null
  const photoId   = parts[3] || null
  return { albumSlug, photoId }
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function PhotosClient() {
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [activePhoto, setActivePhoto] = useState(null)
  const [savedScrollPosition, setSavedScrollPosition] = useState(0)
  const [urlInitialised, setUrlInitialised] = useState(false)

  const currentPhotos = selectedAlbum ? selectedAlbum.images : []
  const currentIndex = activePhoto ? currentPhotos.findIndex(p => p.id === activePhoto.id) : -1

  // ── On mount: read URL and open the right album / photo ─────
  useEffect(() => {
    if (urlInitialised) return
    const { albumSlug, photoId } = parsePhotosPath(window.location.pathname)

    if (albumSlug) {
      const album = ALL_ALBUMS.find(a => a.id === albumSlug)
      if (album) {
        setSelectedAlbum(album)
        if (photoId) {
          const photo = album.images.find(p => p.id === photoId)
          if (photo) setActivePhoto(photo)
        }
      }
    }
    setUrlInitialised(true)
  }, [urlInitialised])

  // Scroll to top when album is selected
  useEffect(() => {
    if (selectedAlbum) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedAlbum])

  // Restore scroll position when returning to album grid
  useEffect(() => {
    if (!selectedAlbum && savedScrollPosition > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: 'instant' })
      })
    }
  }, [selectedAlbum, savedScrollPosition])

  const handlePrev = useCallback(() => {
    if (!currentPhotos.length) return
    const prevIndex = currentIndex <= 0 ? currentPhotos.length - 1 : currentIndex - 1
    setActivePhoto(currentPhotos[prevIndex])
  }, [currentIndex, currentPhotos])

  const handleNext = useCallback(() => {
    if (!currentPhotos.length) return
    const nextIndex = currentIndex >= currentPhotos.length - 1 ? 0 : currentIndex + 1
    setActivePhoto(currentPhotos[nextIndex])
  }, [currentIndex, currentPhotos])

  const handleClose = useCallback(() => {
    setActivePhoto(null)
    if (selectedAlbum) {
      window.history.replaceState(null, '', `/photos/${selectedAlbum.id}/`)
    }
  }, [selectedAlbum])

  const handleSelectAlbum = (album) => {
    setSavedScrollPosition(window.scrollY)
    setSelectedAlbum(album)
    window.history.replaceState(null, '', `/photos/${album.id}/`)
  }

  const handleBackToAlbums = () => {
    setSelectedAlbum(null)
    setActivePhoto(null)
    window.history.replaceState(null, '', '/photos/')
  }

  const totalPhotos = ALL_ALBUMS.reduce((sum, album) => sum + album.count, 0)

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="Gallery"
            title="Photos"
            subtitle={`${ALL_ALBUMS.length} albums · ${totalPhotos} photos from live shows, studio sessions and press shoots.`}
          />
        </div>
      </section>

      {/* ── Album Gallery View ────────────────────────────────── */}
      {!selectedAlbum && (
        <section className="page-section">
          <div className="container">
            <div className="albums-grid">
              {ALL_ALBUMS.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onClick={() => handleSelectAlbum(album)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Photo Grid View (when album selected) ─────────────── */}
      {selectedAlbum && (
        <>
          {/* Back button + Album title */}
          <div className="filter-bar">
            <div className="container">
              <div className="filter-bar-inner">
                <button
                  className="btn btn-secondary"
                  onClick={handleBackToAlbums}
                  style={{ fontSize: '0.75rem', padding: '8px 16px' }}
                >
                  ← Back to Albums
                </button>
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    margin: 0,
                    color: 'var(--text-primary)'
                  }}>
                    {selectedAlbum.title}
                  </h2>
                  <p className="section-label" style={{ margin: '4px 0 0 0' }}>
                    {selectedAlbum.count} {selectedAlbum.count === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo grid */}
          <section className="page-section">
            <div className="container">
              <div className="photo-grid">
                {currentPhotos.map((photo, i) => (
                  <div
                    key={photo.id}
                    className={`photo-thumb reveal delay-${(i % 6) + 1}`}
                    onClick={() => setActivePhoto(photo)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePhoto(photo) }}
                    aria-label={`View: ${photo.caption || photo.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc(photo.src)}
                      alt={`Broken Links — ${photo.caption || photo.title}`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div className="photo-thumb-overlay">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'white' }}>
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Modal — always mounted, toggled via isOpen ────────── */}
      <PhotoModal
        isOpen={!!(activePhoto && selectedAlbum)}
        photo={activePhoto}
        albumTitle={selectedAlbum?.title}
        albumId={selectedAlbum?.id}
        photos={currentPhotos}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  )
}
