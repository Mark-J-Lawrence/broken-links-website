'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import PageTitle from './PageTitle'
import videosData from '../data/videos.json'

const VIDEOS = [...videosData].sort((a, b) => new Date(b.date) - new Date(a.date))

const CATEGORIES = ['All', ...Array.from(new Set(VIDEOS.map(v => v.category)))]

/* ── Video Modal ─────────────────────────────────────────────── */
function VideoModal({ video, isOpen, onClose }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
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
  }, [isOpen, onClose])

  // Update URL silently via history API — no Next.js navigation, no re-render
  useEffect(() => {
    if (isOpen && video) {
      const targetUrl = `/videos/${video.youtubeId}/`
      if (window.location.pathname !== targetUrl) {
        window.history.replaceState(null, '', targetUrl)
      }
    }
  }, [isOpen, video])

  if (!mounted) return null
  return createPortal(
    <div
      className={`modal-backdrop${isOpen ? ' is-open' : ''}`}
      onClick={(e) => { if (isOpen && e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={video?.title}
    >
      <div className="modal-panel video-modal-panel">
        {video && <>
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
        </>}
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

/* ── URL parsing helper ──────────────────────────────────────── */
/**
 * Parses the current pathname to extract a YouTube video ID.
 * Handles:
 *   /videos/                → null
 *   /videos/mzo9d-o06DU/   → 'mzo9d-o06DU'
 */
function parseVideosPath(pathname) {
  const parts = pathname.replace(/\/$/, '').split('/')
  // parts[0] = '', parts[1] = 'videos', parts[2] = youtubeId?
  return parts[2] || null
}

/* ── Main Component ───────────────────────────────────────────── */
export default function VideosClient() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeVideo, setActiveVideo] = useState(null)
  const [urlInitialised, setUrlInitialised] = useState(false)

  const filtered = activeCategory === 'All'
    ? VIDEOS
    : VIDEOS.filter(v => v.category === activeCategory)

  // ── On mount: read URL and open the right video ──────────────
  useEffect(() => {
    if (urlInitialised) return
    const youtubeId = parseVideosPath(window.location.pathname)
    if (youtubeId) {
      const video = VIDEOS.find(v => v.youtubeId === youtubeId)
      if (video) setActiveVideo(video)
    }
    setUrlInitialised(true)
  }, [urlInitialised])

  const handleClose = useCallback(() => {
    setActiveVideo(null)
    window.history.replaceState(null, '', '/videos/')
  }, [])

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

      {/* ── Modal — always mounted, toggled via isOpen ────────── */}
      <VideoModal video={activeVideo} isOpen={!!activeVideo} onClose={handleClose} />
    </>
  )
}
