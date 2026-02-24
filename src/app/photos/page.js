'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import PageTitle from '../../components/PageTitle'
import photosData from '../../data/photos.json'
import { imgSrc } from '../../lib/basePath'

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
function PhotoModal({ photo, photos, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft')  onPrev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNext, onPrev])

  if (!photo) return null

  const currentIndex = photos.findIndex(p => p.id === photo.id)
  const total = photos.length

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
    >
      <div className="modal-panel photo-modal-panel">
        {/* Header */}
        <div className="modal-header">
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>{photo.album}</p>
            <h2 className="modal-title">{photo.caption || photo.title}</h2>
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

        {/* Photo */}
        <div className="photo-modal-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc(photo.src)}
            alt={photo.caption || photo.title}
            className="photo-modal-img"
          />

          {/* Prev / Next arrows */}
          <button
            className="photo-nav photo-nav-prev"
            onClick={onPrev}
            aria-label="Previous photo"
            disabled={currentIndex === 0}
          >
            ‹
          </button>
          <button
            className="photo-nav photo-nav-next"
            onClick={onNext}
            aria-label="Next photo"
            disabled={currentIndex === total - 1}
          >
            ›
          </button>
        </div>

        {/* Caption */}
        <div className="modal-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {photo.album}
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
            alt={album.title}
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

/* ── Main Page ───────────────────────────────────────────────── */
export default function PhotosPage() {
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [activePhoto, setActivePhoto] = useState(null)

  const currentPhotos = selectedAlbum ? selectedAlbum.images : []
  const currentIndex = activePhoto ? currentPhotos.findIndex(p => p.id === activePhoto.id) : -1

  // Scroll to top when album is selected
  useEffect(() => {
    if (selectedAlbum) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedAlbum])

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) return
    setActivePhoto(currentPhotos[currentIndex - 1])
  }, [currentIndex, currentPhotos])

  const handleNext = useCallback(() => {
    if (currentIndex >= currentPhotos.length - 1) return
    setActivePhoto(currentPhotos[currentIndex + 1])
  }, [currentIndex, currentPhotos])

  const handleClose = useCallback(() => setActivePhoto(null), [])

  const handleBackToAlbums = () => {
    setSelectedAlbum(null)
    setActivePhoto(null)
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
                  onClick={() => setSelectedAlbum(album)}
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
                      alt={photo.caption || photo.title}
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

      {/* ── Modal ─────────────────────────────────────────────── */}
      {activePhoto && selectedAlbum && (
        <PhotoModal
          photo={{ ...activePhoto, album: selectedAlbum.title }}
          photos={currentPhotos}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}

