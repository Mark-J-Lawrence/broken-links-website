import VideosClient from '../../components/VideosClient'

export const metadata = {
  title: 'Videos',
  description: 'Broken Links music videos — official videos and live footage.',
  alternates: {
    canonical: 'https://www.brokenlinksmusic.co.uk/videos/',
  },
}

export default function VideosPage() {
  return <VideosClient />
}
