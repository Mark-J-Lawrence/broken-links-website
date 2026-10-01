/**
 * /photos/[album]/[photo]/page.js
 *
 * Pre-rendered static page for each individual photo.
 * The client reads the URL and opens the album + lightbox for this photo.
 *
 * URL pattern: /photos/live-the-hobbit-southampton-03-10-2021/18194/
 */

import photosData from '../../../../data/photos.json'
import PhotosClient from '../../../../components/PhotosClient'
import { imgSrc } from '../../../../lib/basePath'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

/* ── Static params ─────────────────────────────────────────────── */
export async function generateStaticParams() {
  const params = []
  for (const album of photosData) {
    for (const image of album.images) {
      params.push({ album: album.slug, photo: String(image.id) })
    }
  }
  return params
}

/* ── Per-photo metadata ─────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { album: albumSlug, photo: photoId } = await params
  const album = photosData.find((a) => a.slug === albumSlug)
  if (!album) return { title: 'Photo Not Found' }

  const image = album.images.find((img) => String(img.id) === photoId)
  if (!image) return { title: 'Photo Not Found' }

  const photoTitle = image.title || album.title

  return {
    title: `${photoTitle} — ${album.title} — Photos`,
    description: `Photo from ${album.title} by Broken Links.`,
    alternates: {
      canonical: `${BASE_URL}/photos/${albumSlug}/${photoId}/`,
    },
    openGraph: {
      title: `${photoTitle} — Broken Links`,
      description: `Photo from ${album.title}.`,
      type: 'website',
      url: `${BASE_URL}/photos/${albumSlug}/${photoId}/`,
      images: [
        {
          url: `${BASE_URL}${image.localPath}`,
          width: 1200,
          height: 800,
          alt: `Broken Links — ${album.title} — ${photoTitle}`,
        },
      ],
    },
  }
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function PhotoPage({ params }) {
  const { album: albumSlug, photo: photoId } = await params
  const album = photosData.find((a) => a.slug === albumSlug)
  const image = album?.images.find((img) => String(img.id) === photoId)

  return (
    <>
      {/* Googlebot-visible single image */}
      {image && (
        <div
          aria-hidden="true"
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc(image.localPath)}
            alt={`Broken Links — ${album.title}${image.title ? ` — ${image.title}` : ''}`}
            width="800"
            height="533"
          />
        </div>
      )}

      {/* PhotosClient reads the URL path and opens the album + lightbox */}
      <PhotosClient />
    </>
  )
}
