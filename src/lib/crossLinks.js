/**
 * crossLinks.js — Centralised cross-referencing logic across
 * Videos, Photos, Live Gigs, and News/Blog posts.
 *
 * Strengthens internal link architecture and Google topical authority
 * by ensuring bidirectional connections between media assets and editorial press.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import photosData from '../data/photos.json'
import gigsData from '../data/gigs.json'
import videosData from '../data/videos.json'

const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'blog-posts')

/* ── Direct Curated Mappings (100% verified) ─────────────────── */

const GIG_TO_PHOTO_MAP = {
  '2026-09-12-music-in-the-city': 'live-music-in-the-city-southampton-12-09-2026',
  '2021-10-03-the-hobbit': 'live-the-hobbit-southampton-03-10-2021',
  '2021-10-09-the-hobbit': 'live-the-hobbit-southampton-09-10-2021',
  '2017-11-11-the-loft': 'live-the-loft-southampton-11112017',
  '2015-10-16-the-1865': 'live-the-1865-southampton-161015',
  '2014-10-19-drift-bar': 'live-drift-bar-southsea-oct-2014',
  '2014-09-26-forum-bielefeld': 'supporting-chameleonsvox-the-forum-bielefeld-germany',
  '2013-06-20-the-rattlesnake': 'live-rattlesnake-2013',
  '2013-03-29-the-rattlesnake': 'live-at-the-rattlesnake-of-angel-london',
  '2012-05-13-the-cellar': 'live-the-cellar-southampton',
  '2011-06-10-karel-music-expo-2011': 'karel-music-expo-2011-cagliari-sardinia',
  '2011-04-30-the-joiners-arms': 'prototypescauseeffect-ep-launch-30042011',
  '2009-01-15-the-railway-inn': 'live-the-railway-15012009',
  '2008-12-27-the-joiners-arms': 'live-the-joiners-27122008',
}

const PHOTO_TO_GIG_MAP = Object.fromEntries(
  Object.entries(GIG_TO_PHOTO_MAP).map(([g, p]) => [p, g])
)

const VIDEO_TO_PHOTO_MAP = {
  'Tr27BSpQjyg': 'dead-embers-videoshoot-day-one',
  '5pzEq5aewA0': 'making-of-were-all-paranoid-video',
}

const GIG_TO_POST_MAP = {
  '2026-09-12-music-in-the-city': 'music-in-the-city-september-2026',
  '2022-07-14-chaplins-the-cellar-bar': 'gig-review-rock-regeneration-14-07-2022',
  '2012-11-21-the-rattlesnake': 'punk-prospect-live-review-the-rattlesnake-london-21112012',
  '2011-10-15-the-talking-heads': 'mell-jones-reviews-live-review-talking-heads-southampton-15102011',
  '2011-06-10-karel-music-expo-2011': 'june-update',
  '2011-04-30-the-joiners-arms': 'prototypescauseeffect-new-ep-to-be-released-02052011',
  '2010-11-08-the-bridge-bar': 'the-edge-live-review-aims-frequency-southampton-08112010',
  '2010-10-08-the-joiners-arms': 'unplug-the-jukebox-live-review-the-joiners-southampton-08102010',
  '2010-05-28-the-birdcage': 'the-dirty-south-live-review-the-birdcage-portsmouth-28052010',
  '2010-05-20-the-purple-turtle': 'altercarnated-photography-live-review-the-purple-turtle-camden-london-20052010',
  '2009-12-04-ryde-theatre': 'new-reviews-live-review-ryde-theatre-iow-04122009',
  '2009-09-23-the-joiners-arms': 'gig-review-by-mintsouth-broken-links-the-joiners-southampton-23rd-september-2009',
}

/* ── Cached Posts Reader ─────────────────────────────────────── */

let cachedPosts = null
function getLoadedPosts() {
  if (cachedPosts) return cachedPosts
  if (!fs.existsSync(POSTS_DIR)) return []

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))
  cachedPosts = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8')
    const { data, content } = matter(raw)
    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date).slice(0, 10) : '1970-01-01',
      category: data.category || 'news',
      excerpt: data.excerpt || '',
      image: data.image || null,
      content,
    }
  })
  return cachedPosts
}

/* ── Public API ──────────────────────────────────────────────── */

/**
 * Returns matching news/press articles for a given video.
 * Matches on direct YouTube embed, song title mentions, or specific track reviews.
 */
export function getRelatedPostsForVideo(video, limit = 3) {
  if (!video) return []
  const posts = getLoadedPosts()
  const coreTitle = (video.title || '')
    .replace(/\s*\((Official Video|Aug \d{4})\)/i, '')
    .replace(/[’']/g, "'")
    .trim()

  const normalizedCore = coreTitle.toLowerCase()
  const matches = []

  for (const post of posts) {
    let score = 0
    const contentNorm = post.content.replace(/[’']/g, "'")
    const titleNorm = post.title.replace(/[’']/g, "'").toLowerCase()

    // 1. Direct YouTube video embed in MDX
    if (video.youtubeId && contentNorm.includes(video.youtubeId)) {
      score += 100
    }
    // 2. Post title explicitly contains song title
    if (coreTitle.length > 2 && titleNorm.includes(normalizedCore)) {
      score += 60
    }
    // 3. Post slug contains core slug
    const cleanSlug = normalizedCore.replace(/[^a-z0-9]+/g, '-')
    if (cleanSlug.length > 3 && post.slug.includes(cleanSlug)) {
      score += 40
    }
    // 4. Exact song title in body text
    if (coreTitle.length > 3) {
      const escaped = coreTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (new RegExp(`\\b${escaped}\\b`, 'i').test(contentNorm)) {
        score += 15
      }
    }

    if (score >= 25) {
      matches.push({ post, score })
    }
  }

  // Sort by score desc, then date desc
  matches.sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
  return matches.slice(0, limit).map(m => m.post)
}

/**
 * Returns a photo album related to a video (e.g. behind-the-scenes video shoot).
 */
export function getRelatedPhotoAlbumForVideo(video) {
  if (!video) return null
  const photoSlug = VIDEO_TO_PHOTO_MAP[video.youtubeId] || VIDEO_TO_PHOTO_MAP[video.id]
  if (!photoSlug) return null
  return photosData.find(p => p.slug === photoSlug) || null
}

/**
 * Returns the live photo album associated with a gig event.
 */
export function getRelatedPhotoAlbumForGig(gig) {
  if (!gig) return null
  const photoSlug = GIG_TO_PHOTO_MAP[gig.slug]
  if (!photoSlug) return null
  return photosData.find(p => p.slug === photoSlug) || null
}

/**
 * Returns the gig event associated with a live photo album.
 */
export function getRelatedGigForPhotoAlbum(album) {
  if (!album) return null
  const gigSlug = PHOTO_TO_GIG_MAP[album.slug]
  if (!gigSlug) return null
  return gigsData.find(g => g.slug === gigSlug) || null
}

/**
 * Returns a published gig review or news post associated with a gig event.
 */
export function getRelatedPostForGig(gig) {
  if (!gig) return null
  const postSlug = GIG_TO_POST_MAP[gig.slug]
  if (!postSlug) return null
  const posts = getLoadedPosts()
  return posts.find(p => p.slug === postSlug) || null
}
