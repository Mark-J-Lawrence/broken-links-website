/**
 * Image Loading Optimization Utilities
 * Handles progressive loading, lazy loading, and blur placeholders
 */

/**
 * Add 'loaded' class to images when they finish loading
 * Enables smooth fade-in effect via CSS
 */
export function setupImageLoading() {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
}

/**
 * Preload critical images for better LCP
 * @param {string[]} urls - Array of image URLs to preload
 */
export function preloadImages(urls) {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Generate blur placeholder data URL
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @returns {string} Data URL for blur placeholder
 */
export function getBlurDataURL(width = 10, height = 10) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0d0d14');
  gradient.addColorStop(1, '#1a1a2a');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

/**
 * Intersection Observer for lazy loading images
 * More performant than native lazy loading for complex scenarios
 */
export class LazyImageObserver {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.01,
      ...options,
    };
    
    this.observer = null;
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, this.options);
  }

  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (src) {
      img.src = src;
    }
    if (srcset) {
      img.srcset = srcset;
    }

    img.classList.add('loaded');
  }

  observe(elements) {
    if (!this.observer) return;

    elements.forEach((el) => {
      this.observer.observe(el);
    });
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Calculate optimal image dimensions for responsive loading
 * @param {number} containerWidth - Container width in pixels
 * @param {number} devicePixelRatio - Device pixel ratio (default: window.devicePixelRatio)
 * @returns {number} Optimal image width
 */
export function getOptimalImageWidth(containerWidth, devicePixelRatio = null) {
  const dpr = devicePixelRatio || (typeof window !== 'undefined' ? window.devicePixelRatio : 1);
  const width = containerWidth * dpr;
  
  // Round up to nearest standard size for better caching
  const sizes = [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  return sizes.find(size => size >= width) || sizes[sizes.length - 1];
}

/**
 * Generate srcset string for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {number[]} widths - Array of widths to generate
 * @returns {string} srcset string
 */
export function generateSrcSet(baseUrl, widths = [640, 750, 828, 1080, 1200, 1920]) {
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Check if WebP is supported
 * @returns {Promise<boolean>}
 */
export async function supportsWebP() {
  if (typeof window === 'undefined') return false;

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get image format based on browser support
 * @returns {Promise<'webp'|'jpg'>}
 */
export async function getOptimalImageFormat() {
  const webpSupported = await supportsWebP();
  return webpSupported ? 'webp' : 'jpg';
}
