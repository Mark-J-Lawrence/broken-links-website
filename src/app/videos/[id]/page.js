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
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || `${video.title} by Broken Links`,
    thumbnailUrl: video.thumbnail,
    uploadDate: `${video.date}T00:00:00+00:00`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    url: `${BASE_URL}/videos/${id}/`,
    publisher: {
      '@id': `${BASE_URL}/#band`,
    },
  }
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function VideoPage({ params }) {
  const { id } = await params
  const video = videosData.find((v) => v.youtubeId === id)

  if (!video) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema(video, id)) }}
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
          <p className="card-meta" style={{ maxWidth: 900, margin: '16px auto 0' }}>
            {new Date(video.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </section>
    </>
  )
}
