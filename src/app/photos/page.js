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

      {/* Interactive client component for human visitors */}
      <PhotosClient />
    </>
  )
}
