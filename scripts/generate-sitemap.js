#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Generates public/sitemap.xml from all static routes + dynamic slugs.
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

// Static routes with their priorities and change frequencies
const STATIC_ROUTES = [
  { path: '/',            priority: '1.0', changefreq: 'weekly' },
  { path: '/about',       priority: '0.8', changefreq: 'monthly' },
  { path: '/music',       priority: '0.9', changefreq: 'monthly' },
  { path: '/videos',      priority: '0.8', changefreq: 'monthly' },
  { path: '/live',        priority: '0.8', changefreq: 'weekly' },
  { path: '/live/history',priority: '0.6', changefreq: 'monthly' },
  { path: '/photos',      priority: '0.7', changefreq: 'monthly' },
  { path: '/press',       priority: '0.7', changefreq: 'monthly' },
  { path: '/contact',     priority: '0.6', changefreq: 'yearly' },
  { path: '/news',        priority: '0.9', changefreq: 'weekly' },
]

function getBlogSlugs() {
  const postsDir = path.join(__dirname, '../src/data/blog-posts')
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''))
}

function getBlogTags() {
  const postsDir = path.join(__dirname, '../src/data/blog-posts')
  if (!fs.existsSync(postsDir)) return []
  const tags = new Set()
  fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.mdx'))
    .forEach(f => {
      try {
        const content = fs.readFileSync(path.join(postsDir, f), 'utf8')
        const { data } = matter(content)
        if (Array.isArray(data.tags)) {
          data.tags.forEach(t => tags.add(t))
        }
      } catch {}
    })
  return Array.from(tags)
}

function getVenueSlugs() {
  const venuesPath = path.join(__dirname, '../src/data/venues.json')
  if (!fs.existsSync(venuesPath)) return []
  try {
    const venues = JSON.parse(fs.readFileSync(venuesPath, 'utf8'))
    return venues.map(v => v.slug).filter(Boolean)
  } catch { return [] }
}

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

function buildSitemap() {
  const today = formatDate(new Date())
  const urls = []

  // Static routes
  for (const route of STATIC_ROUTES) {
    urls.push(`  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
  }

  // Blog posts
  const slugs = getBlogSlugs()
  console.log(`Found ${slugs.length} blog posts`)
  for (const slug of slugs) {
    urls.push(`  <url>
    <loc>${BASE_URL}/news/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`)
  }

  // Tag pages
  const tags = getBlogTags()
  console.log(`Found ${tags.length} tags`)
  for (const tag of tags) {
    urls.push(`  <url>
    <loc>${BASE_URL}/news/tag/${encodeURIComponent(tag)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`)
  }

  // Venue pages
  const venueSlugs = getVenueSlugs()
  console.log(`Found ${venueSlugs.length} venues`)
  for (const slug of venueSlugs) {
    urls.push(`  <url>
    <loc>${BASE_URL}/live/venues/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  const outPath = path.join(__dirname, '../public/sitemap.xml')
  fs.writeFileSync(outPath, xml, 'utf8')
  console.log(`✓ Sitemap written to public/sitemap.xml (${urls.length} URLs)`)
}

buildSitemap()


