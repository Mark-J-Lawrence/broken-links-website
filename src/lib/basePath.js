/**
 * Returns the basePath prefix for static assets (images, etc.)
 * In production (GitHub Pages) this is '/broken-links-website'.
 * In dev it is empty string ''.
 *
 * Usage:
 *   import { imgSrc } from '@/lib/basePath'
 *   <Image src={imgSrc('/images/logo.png')} ... />
 *   <div style={{ backgroundImage: `url(${imgSrc('/images/logo.png')})` }} />
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function imgSrc(path) {
  // path should start with '/'
  return `${BASE_PATH}${path}`
}


