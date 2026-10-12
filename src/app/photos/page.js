/**
 * Server component — photos/page.js
 *
 * Renders two things:
 *   1. A visually hidden static image grid that Googlebot can crawl.
 *      Real <img> tags with descriptive alt text = indexed in Google Images.
 *   2. The interactive PhotosClient component for the human UX (lightbox, etc).
 *
 * Why: the client component is 'use client' and renders entirely in JS,
 * so Googlebot sees nothing. This wrapper gives Google the raw images.
 */

import photosData from '../../data/photos.json'
import PhotosClient from '../../components/PhotosClient'
import { imgSrc } from '../../lib/basePath'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

export const metadata = {
  title: 'Photos',
  description: 'Broken Links photos — band photos, live shots and behind the scenes.',
  alternates: {
    canonical: `${BASE_URL}/photos/`,
  },
}

/*
 * Schema.org ImageGallery + ImageObject structured data.
 * One ImageObject per album (representative first image) so Google's
 * image metadata report surfaces all albums with full creator/license fields.
 */
const PHOTOS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Broken Links — Photo Gallery',
  description: 'Band photos, live shots and behind the scenes photographs of Broken Links.',
  url: `${BASE_URL}/photos/`,
  image: photosData.map((album) => {
    const representative = album.images[0]
    return {
      '@type': 'ImageObject',
      contentUrl: `${BASE_URL}${representative.localPath}`,
      name: `Broken Links — ${album.title}`,
      description: `Photo from the Broken Links album: ${album.title}`,
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
  }),
}

export default function PhotosPage() {
  return (
    <>
      {/*
        Googlebot-visible static image grid.
        Hidden from sighted users with CSS but fully crawlable —
        visibility:hidden keeps it in the DOM and accessible to crawlers
        while not appearing on screen or affecting layout.
      */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      >
        {photosData.map((album) =>
          album.images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image.id}
              src={imgSrc(image.localPath)}
              alt={`Broken Links — ${album.title}${image.title ? ` — ${image.title}` : ''}`}
              width="800"
              height="533"
            />
          ))
        )}
      </div>

      {/* Schema.org ImageGallery structured data for Google image metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PHOTOS_SCHEMA) }}
      />

      {/* Interactive client component for human visitors */}
      <PhotosClient />
    </>
  )
}
