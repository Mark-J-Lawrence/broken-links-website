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

export default function VideosLayout({ children }) {
  return children
}
