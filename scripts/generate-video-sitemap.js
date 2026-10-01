#!/usr/bin/env node
/**
 * Generates public/sitemap-videos.xml from src/data/videos.json
 * Uses the Google Video Sitemap extension to tell Google about each YouTube video.
 *
 * Each video gets its own <url> block at /videos/[youtubeId]/ so Google can
 * associate the video metadata with a unique, crawlable page URL.
 * A top-level /videos/ entry is also included listing all videos.
 *
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

function videoBlock(video) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
  const title = `Broken Links — ${video.title}`
  const description = video.description || `${video.title} by Broken Links`
  return [
    '    <video:video>',
    `      <video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>`,
    `      <video:title>${escapeXml(title)}</video:title>`,
    `      <video:description>${escapeXml(description)}</video:description>`,
    `      <video:player_loc>https://www.youtube.com/embed/${video.youtubeId}</video:player_loc>`,
    `      <video:publication_date>${video.date}T00:00:00+00:00</video:publication_date>`,
    `      <video:category>${escapeXml(video.category)}</video:category>`,
    '      <video:tag>Broken Links</video:tag>',
    '      <video:tag>dark rock</video:tag>',
    '      <video:tag>Southampton band</video:tag>',
    `      <video:tag>${escapeXml(video.category)}</video:tag>`,
    '    </video:video>',
  ].join('\n')
}

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
]

// ── Top-level /videos/ — all videos listed together ──────────────
lines.push('  <url>')
lines.push(`    <loc>${BASE_URL}/videos/</loc>`)
for (const video of videosData) {
  lines.push(videoBlock(video))
}
lines.push('  </url>')
lines.push('')

// ── Individual video pages — one <url> per video ─────────────────
for (const video of videosData) {
  lines.push('  <url>')
  lines.push(`    <loc>${BASE_URL}/videos/${video.youtubeId}/</loc>`)
  lines.push(videoBlock(video))
  lines.push('  </url>')
  lines.push('')
}

lines.push('</urlset>')

const xml = lines.join('\n') + '\n'
const outPath = path.join(__dirname, '../public/sitemap-videos.xml')
fs.writeFileSync(outPath, xml, 'utf8')

console.log(`✓ Written ${outPath}`)
console.log(`  ${videosData.length} videos (1 top-level entry + ${videosData.length} individual pages)`)
