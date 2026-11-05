/**
 * Helpers for generating clean, SEO-friendly titles and alt tags for photos.
 * Replaces raw camera export strings, hashes, and numbers with descriptive names.
 */

function isCleanTitle(title) {
  if (!title) return false
  const t = String(title).trim()
  // Reject pure numbers, zero-padded numbers (e.g. 0001, 1, 74)
  if (/^\d+$/.test(t)) return false
  if (/^0+\d+$/.test(t)) return false
  // Reject camera hashes, UUIDs, or strings with only hex/dashes/underscores
  if (/^[0-9_a-fA-F-]+$/.test(t)) return false
  if (/_[\da-f]+_?[a-z]?$/i.test(t)) return false
  // Reject screen captures, dimensions, camera prefixes
  if (/^vlcsnap/i.test(t)) return false
  if (/\d{3,}x\d{3,}/i.test(t)) return false
  if (/^IMG_|^DSC_|^P\d{4}/i.test(t)) return false
  if (/^Music in the City\s*[–-]\s*\d+$/i.test(t)) return false
  if (/^City-Walls/i.test(t)) return false
  // Reject leftover file extensions
  if (/\.(jpg|jpeg|png|webp)$/i.test(t)) return false
  return true
}

function getPhotoTitle(album, image, index) {
  if (image && isCleanTitle(image.title)) {
    return image.title
  }
  const photoNum = typeof index === 'number' && index >= 0 ? index + 1 : null
  const baseAlbum = album ? album.title : 'Broken Links'
  return photoNum ? `${baseAlbum} — Photo ${photoNum}` : baseAlbum
}

function getPhotoAlt(album, image, index) {
  const title = getPhotoTitle(album, image, index)
  if (title.startsWith('Broken Links')) {
    return title
  }
  return `Broken Links — ${title}`
}

module.exports = {
  isCleanTitle,
  getPhotoTitle,
  getPhotoAlt,
}
