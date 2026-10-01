/**
 * /photos/[album]/page.js
 *
 * Pre-rendered static page for each photo album.
 * Loads the shared PhotosClient and passes the album slug via the URL
 * so the client opens the correct album on mount.
 *
 * URL pattern: /photos/live-the-hobbit-southampton-03-10-2021/
 */

import photosData from '../../../data/photos.json'
import PhotosClient from '../../../components/PhotosClient'
import { imgSrc } from '../../../lib/basePath'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

/* ── Static params ─────────────────────────────────────────────── */
export async function generateStaticParams() {
  return photosData.map((album) => ({ album: album.slug }))
}

/* ── Per-album metadata ─────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { album: albumSlug } = await params
  const album = photosData.find((a) => a.slug === albumSlug)
  if (!album) return { title: 'Album Not Found' }

  const coverImage = album.images[0]?.localPath

  return {
    title: `${album.title} — Photos`,
    description: `${album.imageCount} photos from ${album.title} by Broken Links.`,
    alternates: {
      canonical: `${BASE_URL}/photos/${albumSlug}/`,
    },
    openGraph: {
      title: `${album.title} — Broken Links Photos`,
      description: `${album.imageCount} photos from ${album.title}.`,
      type: 'website',
      url: `${BASE_URL}/photos/${albumSlug}/`,
      images: coverImage
        ? [{ url: `${BASE_URL}${coverImage}`, width: 1200, height: 800, alt: `Broken Links — ${album.title}` }]
        : [],
    },
  }
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function AlbumPage({ params }) {
  const { album: albumSlug } = await params
  const album = photosData.find((a) => a.slug === albumSlug)

  return (
    <>
      {/*
        Googlebot-visible static image grid for this album.
        Hidden from sighted users but fully crawlable.
      */}
      {album && (
        <div
          aria-hidden="true"
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
        >
          {album.images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image.id}
              src={imgSrc(image.localPath)}
              alt={`Broken Links — ${album.title}${image.title ? ` — ${image.title}` : ''}`}
              width="800"
              height="533"
            />
          ))}
        </div>
      )}

      {/* PhotosClient reads the URL path and auto-opens this album */}
      <PhotosClient />
    </>
  )
}
