/**
 * Server component — photos/page.js
 *
 * Renders ImageGallery structured data and the interactive PhotosClient.
 * Individual photos have visible, server-rendered landing pages.
 */

import photosData from '../../data/photos.json'
import PhotosClient from '../../components/PhotosClient'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

export const metadata = {
  title: 'Photos',
  description: 'Broken Links photos — band photos, live shots and behind the scenes.',
  alternates: {
    canonical: `${BASE_URL}/photos/`,
  },
}

/* Schema.org ImageGallery data with one representative image per album. */
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
