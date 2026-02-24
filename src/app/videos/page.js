'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import PageTitle from '../../components/PageTitle'
import videosData from '../../data/videos.json'

const VIDEOS = [...videosData].sort((a, b) => new Date(b.date) - new Date(a.date))

const CATEGORIES = ['All', ...Array.from(new Set(VIDEOS.map(v => v.category)))]

/* ── Video Modal ─────────────────────────────────────────────── */
function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!video) return null

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div className="modal-panel video-modal-panel">
        {/* Header */}
        <div className="modal-header">
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>{video.category}</p>
            <h2 className="modal-title">{video.title}</h2>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close video"
          >
            ✕
          </button>
        </div>

        {/* Video embed */}
        <div className="video-embed-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-embed"
          />
        </div>

        {/* Description */}
        {video.description && (
          <div className="modal-body">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{video.description}</p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.15em', color: 'var(--text-dim)',
              marginTop: 12, textTransform: 'uppercase',
            }}>
              {new Date(video.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

/* ── Video Thumbnail Card ─────────────────────────────────────── */
function VideoCard({ video, onPlay, delay = 0 }) {
  return (
    <div
      className={`video-thumb reveal delay-${delay}`}
      onClick={() => onPlay(video)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPlay(video) }}
      aria-label={`Play: ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="video-thumb-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Play button */}
      <div className="play-btn">
        <div className="play-icon" />
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <p className="card-meta" style={{ marginBottom: 6 }}>
          <span>{video.category}</span>
          <span className="card-meta-sep" />
          <span>{new Date(video.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
          fontWeight: 700, color: 'var(--white)',
          lineHeight: 1.3, margin: 0,
        }}>
          {video.title}
        </p>
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeVideo, setActiveVideo] = useState(null)

  const filtered = activeCategory === 'All'
    ? VIDEOS
    : VIDEOS.filter(v => v.category === activeCategory)

  const handleClose = useCallback(() => setActiveVideo(null), [])

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="Watch"
            title="Videos"
            subtitle={`${VIDEOS.length} videos — music videos, live recordings, interviews and studio sessions.`}
          />
        </div>
      </section>

      {/* ── Filter Bar ────────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="container">
          <div className="filter-bar-inner">
            <p className="section-label" style={{ margin: 0 }}>Filter</p>
            <div className="filter-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-tab${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Video Grid ────────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              No videos in this category yet.
            </p>
          ) : (
            <div className="grid-3">
              {filtered.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={setActiveVideo}
                  delay={(i % 6) + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Modal ─────────────────────────────────────────────── */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={handleClose} />
      )}
    </>
  )
}

