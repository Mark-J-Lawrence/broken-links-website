/**
 * /photos/[album]/page.js
 *
 * Pre-rendered static page for each photo album.
 * Loads the shared PhotosClient and passes the album slug via the URL
 * so the client opens the correct album on mount.
 *
 * URL pattern: /photos/live-the-hobbit-southampton-03-10-2021/
 */

import { notFound } from 'next/navigation'
import photosData from '../../../data/photos.json'
import PhotosClient from '../../../components/PhotosClient'
import { getPhotoTitle, getPhotoAlt } from '../../../lib/photoHelpers'

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
  if (!album) notFound()

  const albumSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `Broken Links — ${album.title}`,
    description: `${album.imageCount} photos from ${album.title} by Broken Links.`,
    url: `${BASE_URL}/photos/${albumSlug}/`,
    image: album.images.map((img, idx) => ({
      '@type': 'ImageObject',
      contentUrl: `${BASE_URL}${img.localPath}`,
      name: getPhotoAlt(album, img, idx),
      description: `Photo ${idx + 1} from ${album.title} by Broken Links.`,
      creditText: 'Broken Links',
      copyrightNotice: '© Broken Links. All rights reserved.',
      license: `${BASE_URL}/photos/`,
      acquireLicensePage: `${BASE_URL}/contact/`,
      creator: {
        '@type': 'Organization',
        name: 'Broken Links',
        url: BASE_URL,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(albumSchema) }}
      />
      <PhotosClient initialAlbumSlug={albumSlug} />
    </>
  )
}
