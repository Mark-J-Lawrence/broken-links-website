import videosData from '../../data/videos.json'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

export const metadata = {
  title: 'Videos',
  description: 'Broken Links videos — music videos, live recordings, interviews and studio sessions.',
  alternates: {
    canonical: `${BASE_URL}/videos/`,
  },
  openGraph: {
    title: 'Videos — Broken Links',
    description: 'Official music videos, live recordings and interviews from Broken Links, cinematic dark rock band from Southampton, UK.',
    type: 'website',
    url: `${BASE_URL}/videos`,
    images: [
      {
        url: `https://img.youtube.com/vi/${videosData[0]?.youtubeId}/maxresdefault.jpg`,
        width: 1280,
        height: 720,
        alt: `Broken Links — ${videosData[0]?.title}`,
      },
    ],
  },
}

/* Build an array of VideoObject structured data for every video */
const videoSchemas = videosData.map((v) => ({
  '@type': 'VideoObject',
  name: v.title,
  description: v.description || `${v.title} by Broken Links`,
  thumbnailUrl: [
    `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`,
  ],
  uploadDate: v.date,
  contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
  embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
  publisher: {
    '@type': 'MusicGroup',
    name: 'Broken Links',
    url: BASE_URL,
  },
}))

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': videoSchemas,
}

export default function VideosLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      {children}
    </>
  )
}
