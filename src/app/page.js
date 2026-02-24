import { getAllPosts } from '../lib/getBlogPosts'
import HomeClient from '../components/HomeClient'
import gigsData from '../data/gigs.json'
import videosData from '../data/videos.json'
import photosData from '../data/photos.json'

/* ── Server component: fetch real data ───────────────────────── */
export default function HomePage() {
  const allPosts = getAllPosts()
  const latestPosts = allPosts.slice(0, 3)

  // Find next upcoming gig (or most recent past gig as fallback)
  const today = new Date().toISOString().slice(0, 10)
  const sorted = [...gigsData].sort((a, b) => new Date(a.date) - new Date(b.date))
  const nextGig = sorted.find(g => g.date >= today && g.status !== 'cancelled')
    || [...sorted].reverse().find(g => g.status !== 'cancelled')
    || null

  // Pass all videos to client component for runtime shuffling
  const allVideos = videosData

  // Pass all photos to client component for runtime shuffling
  const allPhotos = []
  for (const album of photosData) {
    for (const img of album.images) {
      allPhotos.push({ ...img, albumTitle: album.title })
    }
  }

  return <HomeClient latestPosts={latestPosts} nextGig={nextGig} allVideos={allVideos} allPhotos={allPhotos} />
}


