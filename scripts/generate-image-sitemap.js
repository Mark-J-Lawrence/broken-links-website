#!/usr/bin/env node
/**
 * Generates public/sitemap-images.xml
 *
 * Sources (in priority order within each page URL):
 *   1. Album covers  — /music  (highest brand value, listed first)
 *   2. About page    — /about  (band members + promo shot)
 *   3. Photo gallery — /photos (all live/studio shots)
 *   4. News posts    — /news/[slug] (featured image + MDX body images per post)
 *
 * Ordering matters: Google tends to surface images that appear higher in the
 * sitemap (earlier <url> blocks) and on pages with stronger authority.
 * So album covers and the about/music pages come first.
 *
 * Run: node scripts/generate-image-sitemap.js
 */

const fs   = require('fs')
const path = require('path')

const BASE_URL   = 'https://www.brokenlinksmusic.co.uk'
const POSTS_DIR  = path.join(__dirname, '../src/data/blog-posts')
const DATA_DIR   = path.join(__dirname, '../src/data')

const photosData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'photos.json'),  'utf8'))
const albumsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'albums.json'),  'utf8'))

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;')
}

function imageBlock(loc, caption) {
  return [
    '    <image:image>',
    `      <image:loc>${escapeXml(BASE_URL + loc)}</image:loc>`,
    `      <image:caption>${escapeXml(caption)}</image:caption>`,
    `      <image:title>${escapeXml(caption)}</image:title>`,
    '    </image:image>',
  ].join('\n')
}

function urlBlock(loc, images) {
  if (!images.length) return ''
  return [
    '  <url>',
    `    <loc>${BASE_URL}${loc}</loc>`,
    ...images,
    '  </url>',
  ].join('\n')
}

/* ── Extract image paths from MDX markdown body ────────────────── */
// Matches both ![alt](path) and [![alt](path)](link) patterns,
// only for paths that are site-local (start with /)
function extractMdxImages(content) {
  const results = []
  // Standard markdown image: ![alt text](/path/to/img.jpg)
  const mdRe = /!\[([^\]]*)\]\((\/?images\/[^)"\s]+)\)/g
  let m
  while ((m = mdRe.exec(content)) !== null) {
    const [, alt, src] = m
    if (src.startsWith('/') || src.startsWith('images/')) {
      results.push({ src: src.startsWith('/') ? src : '/' + src, alt })
    }
  }
  return results
}

/* ── Parse MDX frontmatter (minimal, no full yaml parser needed) ── */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { image: null, title: '', slug: '', date: '' }
  const fm = match[1]
  const get = (key) => {
    const re = new RegExp(`^${key}:\\s*(.+)$`, 'm')
    const m = fm.match(re)
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
  }
  return {
    title: get('title') || '',
    date:  get('date')  || '',
    slug:  get('slug')  || '',
    image: get('image') === 'null' ? null : get('image'),
  }
}

// ── Collect all URL blocks ────────────────────────────────────────

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  '',
]

let totalImages = 0
let totalUrls   = 0

// ── 1. MUSIC PAGE — album covers (highest brand value images) ─────
{
  const imgs = albumsData.map(album =>
    imageBlock(album.cover, `Broken Links — ${album.title} (${album.year}) — Official Album Cover`)
  )
  lines.push(urlBlock('/music', imgs))
  lines.push('')
  totalImages += imgs.length
  totalUrls++
  console.log(`  /music: ${imgs.length} album covers`)
}

// ── 2. ABOUT PAGE — band photos & member shots ────────────────────
{
  const ABOUT_IMAGES = [
    { path: '/images/uploads/2021/02/Split-4000x2250-1-1024x576.jpg', caption: 'Broken Links — Band Photo 2021 — Mark Lawrence, Lewis Betteridge, Phil Boulter' },
    { path: '/images/uploads/2014/04/mark-shout-graveyeard.jpg',       caption: 'Broken Links — Mark Lawrence (Vocals / Guitar)' },
    { path: '/images/uploads/2014/04/lewis-deer-bike-1.jpg',           caption: 'Broken Links — Lewis Betteridge (Bass)' },
    { path: '/images/uploads/2014/04/phil-subway-1.jpg',               caption: 'Broken Links — Phil Boulter (Drums)' },
  ]
  const imgs = ABOUT_IMAGES.map(i => imageBlock(i.path, i.caption))
  lines.push(urlBlock('/about', imgs))
  lines.push('')
  totalImages += imgs.length
  totalUrls++
  console.log(`  /about: ${imgs.length} images`)
}

// ── 3. PHOTOS PAGE — all live/studio shots ───────────────────────
{
  const imgs = []
  for (const album of photosData) {
    for (const image of album.images) {
      const caption = image.title
        ? `Broken Links — ${album.title} — ${image.title}`
        : `Broken Links — ${album.title}`
      imgs.push(imageBlock(image.localPath, caption))
    }
  }
  lines.push(urlBlock('/photos', imgs))
  lines.push('')
  totalImages += imgs.length
  totalUrls++
  console.log(`  /photos: ${imgs.length} images across ${photosData.length} albums`)
}

// ── 4. NEWS POSTS — featured images + MDX body images per post ────
{
  const mdxFiles = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.mdx'))
    .sort() // stable order

  let postCount = 0
  let postImageCount = 0

  for (const filename of mdxFiles) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8')
    const { image, title, slug, date } = parseFrontmatter(raw)

    // Content after the frontmatter
    const content = raw.replace(/^---[\s\S]*?---\n?/, '')
    const bodyImages = extractMdxImages(content)

    const imgs = []

    // Featured image first (highest priority for this post)
    if (image) {
      imgs.push(imageBlock(image, `Broken Links — ${title}`))
    }

    // Body images (press clippings, screenshots, promo)
    for (const bi of bodyImages) {
      const caption = bi.alt
        ? `Broken Links — ${title} — ${bi.alt}`
        : `Broken Links — ${title}`
      imgs.push(imageBlock(bi.src, caption))
    }

    if (imgs.length > 0) {
      lines.push(urlBlock(`/news/${slug || filename.replace('.mdx', '')}`, imgs))
      lines.push('')
      postCount++
      postImageCount += imgs.length
      totalImages += imgs.length
      totalUrls++
    }
  }

  console.log(`  /news/[slug]: ${postImageCount} images across ${postCount} posts`)
}

lines.push('</urlset>')

const xml = lines.join('\n')
const outPath = path.join(__dirname, '../public/sitemap-images.xml')
fs.writeFileSync(outPath, xml, 'utf8')

console.log(`\n✓ Written ${outPath}`)
console.log(`  ${totalImages} total images across ${totalUrls} pages`)
