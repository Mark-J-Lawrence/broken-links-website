/**
 * /videos/[id]/page.js
 *
 * Pre-rendered watch page for each individual video.
 *
 * URL pattern: /videos/mzo9d-o06DU/
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageTitle from '../../../components/PageTitle'
import videosData from '../../../data/videos.json'
import albumsData from '../../../data/albums.json'
import { imgSrc } from '../../../lib/basePath'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

/* ── Static params ─────────────────────────────────────────────── */
export async function generateStaticParams() {
  return videosData.map((video) => ({ id: video.youtubeId }))
}

/* ── Per-video metadata ─────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { id } = await params
  const video = videosData.find((v) => v.youtubeId === id)
  if (!video) return { title: 'Video Not Found' }

  return {
    title: `${video.title} — Videos`,
    description: video.description || `${video.title} by Broken Links.`,
    alternates: {
      canonical: `${BASE_URL}/videos/${id}/`,
    },
    openGraph: {
      title: `${video.title} — Broken Links`,
      description: video.description || `${video.title} by Broken Links.`,
      type: 'video.other',
      url: `${BASE_URL}/videos/${id}/`,
      images: [
        {
          url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
          alt: `Broken Links — ${video.title}`,
        },
        {
          url: video.thumbnail,
          width: 320,
          height: 180,
          alt: `Broken Links — ${video.title}`,
        },
      ],
    },
  }
}

/* ── Per-video VideoObject schema ───────────────────────────────── */
function videoSchema(video, id) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Broken Links — ${video.title}`,
    description: video.description || `${video.title} by Broken Links`,
    thumbnailUrl: [
      `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      video.thumbnail,
    ],
    uploadDate: `${video.date}T00:00:00+00:00`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    url: `${BASE_URL}/videos/${id}/`,
    publisher: {
      '@id': `${BASE_URL}/#band`,
    },
  }
  if (video.duration) {
    schema.duration = video.duration
  }
  return schema
}

/* ── Breadcrumb schema ──────────────────────────────────────────── */
function breadcrumbSchema(video, id) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Videos',
        item: `${BASE_URL}/videos/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: video.title,
        item: `${BASE_URL}/videos/${id}/`,
      },
    ],
  }
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function VideoPage({ params }) {
  const { id } = await params
  const video = videosData.find((v) => v.youtubeId === id)

  if (!video) notFound()

  const album = video.albumSlug
    ? albumsData.find((a) => a.slug === video.albumSlug)
    : null

  const relatedVideos = videosData
    .filter((v) => v.youtubeId !== id)
    .slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema(video, id)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(video, id)) }}
      />
      <section className="page-section">
        <div className="container">
          <nav style={{ marginBottom: 16 }}>
            <Link href="/videos" className="back-link">
              ← All videos
            </Link>
          </nav>
          <PageTitle
            label={video.category}
            title={video.title}
            subtitle={video.description || `${video.title} by Broken Links.`}
          />
          <div className="video-embed-wrap" style={{ maxWidth: 900, margin: '0 auto' }}>
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-embed"
            />
          </div>
          <div style={{ maxWidth: 900, margin: '16px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <p className="card-meta" style={{ margin: 0 }}>
              Released {new Date(video.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {video.duration && (
              <span className="card-meta" style={{ margin: 0 }}>
                Duration: {Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, '0')}
              </span>
            )}
          </div>

          {/* Featured Album context */}
          {album && (
            <div
              className="card"
              style={{
                maxWidth: 900,
                margin: '32px auto 0',
                padding: 24,
                display: 'flex',
                gap: 24,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {album.cover && (
                <img
                  src={imgSrc(album.cover)}
                  alt={`Broken Links — ${album.title}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
              )}
              <div style={{ flex: '1 1 300px' }}>
                <p className="section-label" style={{ marginBottom: 4 }}>
                  Featured Album
                </p>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  {album.title} ({album.year})
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {album.description}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/music/" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
                    View Discography
                  </Link>
                  {album.streaming?.spotify && (
                    <a
                      href={album.streaming.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                    >
                      Spotify
                    </a>
                  )}
                  {album.streaming?.bandcamp && (
                    <a
                      href={album.streaming.bandcamp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                    >
                      Bandcamp
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Band Members Credits */}
          <div style={{ maxWidth: 900, margin: '24px auto 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            <p style={{ margin: 0 }}>
              <strong>Broken Links:</strong> Mark Lawrence (Vocals, Guitar) • Lewis Betteridge (Bass) • Phil Boulter (Drums)
            </p>
          </div>

          {/* Related / More Videos Section */}
          <div style={{ maxWidth: 900, margin: '48px auto 0' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--text-primary)' }}>
              More Broken Links Videos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {relatedVideos.map((item) => (
                <Link
                  key={item.youtubeId}
                  href={`/videos/${item.youtubeId}/`}
                  className="card"
                  style={{ textDecoration: 'none', overflow: 'hidden', display: 'block' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: 12 }}>
                    <p className="card-meta" style={{ marginBottom: 4 }}>{item.category}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

