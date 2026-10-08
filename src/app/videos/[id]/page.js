/**
 * /videos/[id]/page.js
 *
 * Pre-rendered static page for each individual video.
 * The client reads the URL path and auto-opens the correct video modal.
 *
 * URL pattern: /videos/mzo9d-o06DU/
 */

import videosData from '../../../data/videos.json'
import VideosClient from '../../../components/VideosClient'

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
    thumbnailUrl: [
      `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    ],
    uploadDate: `${video.date}T00:00:00+00:00`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    url: `${BASE_URL}/videos/${id}/`,
    publisher: {
      '@type': 'MusicGroup',
      name: 'Broken Links',
      url: BASE_URL,
    },
  }
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function VideoPage({ params }) {
  const { id } = await params
  const video = videosData.find((v) => v.youtubeId === id)

  return (
    <>
      {video && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema(video, id)) }}
        />
      )}
      <VideosClient />
    </>
  )
}
