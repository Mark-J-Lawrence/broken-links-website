const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

export const metadata = {
  title: 'Photos',
  description: 'Broken Links photo gallery — live shows, studio sessions and press shoots.',
  alternates: {
    canonical: `${BASE_URL}/photos/`,
  },
  openGraph: {
    title: 'Photos — Broken Links',
    description: 'Live shows, studio sessions and press shoots from Broken Links, cinematic dark rock band from Southampton, UK.',
    type: 'website',
    url: `${BASE_URL}/photos`,
    images: [
      {
        url: `${BASE_URL}/images/uploads/2026/09/78.jpg`,
        width: 1200,
        height: 800,
        alt: 'Broken Links live at Music in the City, Southampton — September 2026',
      },
    ],
  },
}

export default function PhotosLayout({ children }) {
  return children
}
