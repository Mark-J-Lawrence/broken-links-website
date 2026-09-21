#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Generates public/sitemap.xml from all static routes + dynamic slugs.
 *
 * lastmod dates are derived from real content, not today's date:
 *   - Blog posts    → frontmatter `date` field
 *   - Tag pages     → most recent post date for that tag
 *   - Static routes → git last-commit date for the backing data files
 *   - Venue pages   → git last-commit date for venues.json
 *
 * Run: node scripts/generate-sitemap.js
 */

const fs           = require('fs')
const path         = require('path')
const matter       = require('gray-matter')
const { execSync } = require('child_process')

const BASE_URL  = 'https://www.brokenlinksmusic.co.uk'
const POSTS_DIR = path.join(__dirname, '../src/data/blog-posts')
const ROOT      = path.join(__dirname, '..')

// Static routes — lastmod is driven by the files listed in `watches`
const STATIC_ROUTES = [
  { path: '/',             priority: '1.0', changefreq: 'weekly',  watches: ['src/data/gigs.json', 'src/data/videos.json', 'src/data/photos.json', 'src/data/albums.json'] },
  { path: '/about',        priority: '0.8', changefreq: 'monthly', watches: ['src/app/about/page.js'] },
  { path: '/music',        priority: '0.9', changefreq: 'monthly', watches: ['src/data/albums.json', 'src/app/music/page.js'] },
  { path: '/videos',       priority: '0.8', changefreq: 'monthly', watches: ['src/data/videos.json'] },
  { path: '/live',         priority: '0.8', changefreq: 'weekly',  watches: ['src/data/gigs.json'] },
  { path: '/live/history', priority: '0.6', changefreq: 'monthly', watches: ['src/data/gigs.json'] },
  { path: '/photos',       priority: '0.7', changefreq: 'monthly', watches: ['src/data/photos.json'] },
  { path: '/press',        priority: '0.7', changefreq: 'monthly', watches: ['src/data/blog-posts'] },
  { path: '/contact',      priority: '0.6', changefreq: 'yearly',  watches: ['src/app/contact/page.js'] },
  { path: '/news',         priority: '0.9', changefreq: 'weekly',  watches: ['src/data/blog-posts'] },
]

function formatDate(d) {
  if (!d) return new Date().toISOString().split('T')[0]
  const date = d instanceof Date ? d : new Date(d)
  return isNaN(date) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0]
}

/** Returns the git last-commit date for a file or directory, or today if untracked. */
function gitLastMod(relPath) {
  try {
    const result = execSync(
      `git log -1 --format="%cI" -- "${relPath}"`,
      { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] }
    ).toString().trim()
    return result ? formatDate(new Date(result)) : null
  } catch {
    return null
  }
}

/** Returns the most recent git date across a list of relative paths. */
function latestGitDate(relPaths) {
  const dates = relPaths
    .map(p => gitLastMod(p))
    .filter(Boolean)
    .sort()
  return dates[dates.length - 1] || formatDate(new Date())
}

/** Read all MDX posts, returning { slug, date, tags } */
function readAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      try {
        const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8')
        const { data } = matter(raw)
        return {
          slug: f.replace(/\.mdx$/, ''),
          date: data.date ? formatDate(new Date(String(data.date))) : null,
          tags: Array.isArray(data.tags) ? data.tags : [],
        }
      } catch {
        return { slug: f.replace(/\.mdx$/, ''), date: null, tags: [] }
      }
    })
}

function getVenueSlugs() {
  const venuesPath = path.join(ROOT, 'src/data/venues.json')
  if (!fs.existsSync(venuesPath)) return []
  try {
    return JSON.parse(fs.readFileSync(venuesPath, 'utf8')).map(v => v.slug).filter(Boolean)
  } catch { return [] }
}

function buildSitemap() {
  const urls = []
  const posts = readAllPosts()

  // ── Static routes ─────────────────────────────────────────────
  for (const route of STATIC_ROUTES) {
    const lastmod = latestGitDate(route.watches)
    urls.push(`  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
  }

  // ── Blog posts — lastmod from frontmatter date ─────────────────
  console.log(`Found ${posts.length} blog posts`)
  for (const post of posts) {
    // Fall back to git date if frontmatter date is missing
    const lastmod = post.date || gitLastMod(`src/data/blog-posts/${post.slug}.mdx`) || formatDate(new Date())
    urls.push(`  <url>
    <loc>${BASE_URL}/news/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`)
  }

  // ── Tag pages — lastmod = most recent post with that tag ───────
  const tagMap = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap[tag] || post.date > tagMap[tag]) tagMap[tag] = post.date
    }
  }
  const tags = Object.keys(tagMap).sort()
  console.log(`Found ${tags.length} tags`)
  for (const tag of tags) {
    const lastmod = tagMap[tag] || formatDate(new Date())
    urls.push(`  <url>
    <loc>${BASE_URL}/news/tag/${encodeURIComponent(tag)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`)
  }

  // ── Venue pages — lastmod from venues.json git date ───────────
  const venueSlugs = getVenueSlugs()
  const venueLastmod = gitLastMod('src/data/venues.json') || formatDate(new Date())
  console.log(`Found ${venueSlugs.length} venues`)
  for (const slug of venueSlugs) {
    urls.push(`  <url>
    <loc>${BASE_URL}/live/venues/${slug}</loc>
    <lastmod>${venueLastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  const outPath = path.join(ROOT, 'public/sitemap.xml')
  fs.writeFileSync(outPath, xml, 'utf8')
  console.log(`✓ Sitemap written to public/sitemap.xml (${urls.length} URLs)`)
}

buildSitemap()


