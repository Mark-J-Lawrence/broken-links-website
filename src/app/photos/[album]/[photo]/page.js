/**
 * /photos/[album]/[photo]/page.js
 *
 * Pre-rendered, visible landing page for each individual photo.
 *
 * URL pattern: /photos/live-the-hobbit-southampton-03-10-2021/18194/
 */

import photosData from '../../../../data/photos.json'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageTitle from '../../../../components/PageTitle'
import { imgSrc } from '../../../../lib/basePath'
import { getPhotoTitle, getPhotoAlt } from '../../../../lib/photoHelpers'

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

  const photoIndex = album.images.findIndex((img) => String(img.id) === photoId)
  const image = photoIndex >= 0 ? album.images[photoIndex] : null
  if (!image) return { title: 'Photo Not Found' }

  const photoTitle = getPhotoTitle(album, image, photoIndex)
  const photoAlt = getPhotoAlt(album, image, photoIndex)

  return {
    title: `${photoTitle} — Photos`,
    description: `Official photo from ${album.title} by Broken Links.`,
    alternates: {
      canonical: `${BASE_URL}/photos/${albumSlug}/${photoId}/`,
    },
    openGraph: {
      title: `${photoTitle} — Broken Links`,
      description: `Official photo from ${album.title} by Broken Links.`,
      type: 'website',
      url: `${BASE_URL}/photos/${albumSlug}/${photoId}/`,
      images: [
        {
          url: `${BASE_URL}${image.localPath}`,
          width: 1200,
          height: 800,
          alt: photoAlt,
        },
      ],
    },
  }
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function PhotoPage({ params }) {
  const { album: albumSlug, photo: photoId } = await params
  const album = photosData.find((a) => a.slug === albumSlug)
  const photoIndex = album ? album.images.findIndex((img) => String(img.id) === photoId) : -1
  const image = photoIndex >= 0 ? album.images[photoIndex] : null

  if (!album || !image) notFound()

  const photoTitle = getPhotoTitle(album, image, photoIndex)
  const imageAlt = getPhotoAlt(album, image, photoIndex)

  const imageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${BASE_URL}${image.localPath}`,
    name: imageAlt,
    description: `Official photo from ${album.title} by Broken Links.`,
    creditText: 'Broken Links',
    copyrightNotice: '© Broken Links. All rights reserved.',
    license: `${BASE_URL}/photos/`,
    acquireLicensePage: `${BASE_URL}/contact/`,
    creator: {
      '@type': 'Organization',
      name: 'Broken Links',
      url: BASE_URL,
    },
  }

  const breadcrumbSchema = {
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
        name: 'Photos',
        item: `${BASE_URL}/photos/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: album.title,
        item: `${BASE_URL}/photos/${albumSlug}/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: photoTitle,
        item: `${BASE_URL}/photos/${albumSlug}/${photoId}/`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="page-section">
        <div className="container">
          <nav aria-label="Photo navigation" style={{ marginBottom: 16 }}>
            <Link href={`/photos/${album.slug}/`} className="back-link">
              ← Back to {album.title}
            </Link>
          </nav>
          <PageTitle
            label="Photo gallery"
            title={photoTitle}
            subtitle={`Photo from ${album.title} by Broken Links.`}
          />
          <figure className="photo-detail-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc(image.localPath)}
              alt={imageAlt}
              className="photo-detail-image"
            />
            <figcaption className="photo-detail-caption">
              {image.title ? `${image.title} — ` : ''}{album.title}
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
