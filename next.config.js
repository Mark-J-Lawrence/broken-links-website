/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
// Empty basePath for custom domain (brokenlinksmusic.co.uk)
const basePath = '';

const nextConfig = {
  output: 'export',
  basePath,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

module.exports = nextConfig
