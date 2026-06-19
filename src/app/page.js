import { getAllPosts } from '../lib/getBlogPosts'
import HomeClient from '../components/HomeClient'
import gigsData from '../data/gigs.json'
import videosData from '../data/videos.json'
import photosData from '../data/photos.json'
import albumsData from '../data/albums.json'

/* ── Server component: fetch real data ───────────────────────── */
export default function HomePage() {
  const allPosts = getAllPosts()
  const latestPosts = allPosts.slice(0, 3)

  // Pass all videos to client component for runtime shuffling
  const allVideos = videosData

  // Pass all photos to client component for runtime shuffling
  const allPhotos = []
  for (const album of photosData) {
    for (const img of album.images) {
      allPhotos.push({ ...img, albumTitle: album.title })
    }
  }

  // Calculate stats dynamically
  const stats = {
    albums: albumsData.length,
    newsArticles: allPosts.length,
    liveShows: gigsData.length,
    photoAlbums: photosData.length,
    totalPhotos: allPhotos.length,
    yearsActive: new Date().getFullYear() - 2008,
  }

  // nextGig is derived client-side in HomeClient so it always reflects today's real date
  return <HomeClient latestPosts={latestPosts} gigsData={gigsData} allVideos={allVideos} allPhotos={allPhotos} stats={stats} albums={albumsData} />
}


