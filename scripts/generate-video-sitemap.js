#!/usr/bin/env node
/**
 * Generates public/sitemap-videos.xml from src/data/videos.json
 * Uses the Google Video Sitemap extension to tell Google about each YouTube video.
 * Run: node scripts/generate-video-sitemap.js
 */

const fs = require('fs')
const path = require('path')

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'
const videosData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/videos.json'), 'utf8')
)

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
  '  <url>',
  `    <loc>${BASE_URL}/videos</loc>`,
]

for (const video of videosData) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
  const title = `Broken Links — ${video.title}`
  const description = video.description || `${video.title} by Broken Links`

  lines.push('    <video:video>')
  lines.push(`      <video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>`)
  lines.push(`      <video:title>${escapeXml(title)}</video:title>`)
  lines.push(`      <video:description>${escapeXml(description)}</video:description>`)
  lines.push(`      <video:content_loc>https://www.youtube.com/watch?v=${video.youtubeId}</video:content_loc>`)
  lines.push(`      <video:player_loc>https://www.youtube.com/embed/${video.youtubeId}</video:player_loc>`)
  lines.push(`      <video:publication_date>${video.date}T00:00:00+00:00</video:publication_date>`)
  lines.push(`      <video:category>${escapeXml(video.category)}</video:category>`)
  lines.push(`      <video:tag>Broken Links</video:tag>`)
  lines.push(`      <video:tag>dark rock</video:tag>`)
  lines.push(`      <video:tag>Southampton band</video:tag>`)
  lines.push(`      <video:tag>${escapeXml(video.category)}</video:tag>`)
  lines.push('    </video:video>')
}

lines.push('  </url>')
lines.push('</urlset>')

const xml = lines.join('\n') + '\n'
const outPath = path.join(__dirname, '../public/sitemap-videos.xml')
fs.writeFileSync(outPath, xml, 'utf8')

console.log(`✓ Written ${outPath}`)
console.log(`  ${videosData.length} videos`)
