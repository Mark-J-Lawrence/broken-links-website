# Broken Links Official Website

Official website for **Broken Links**, a cinematic dark rock band from Eastleigh / Southampton, Hampshire, UK (Est. 2008).

Migrated from the original WordPress website and modernised as a fast, static site built with [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), and [MDX](https://mdxjs.com/). Exported as a static site and deployed automatically via GitHub Pages to [brokenlinksmusic.co.uk](https://www.brokenlinksmusic.co.uk).

---

## Features

- **Music & Discography**: Full discography with streaming and purchase links for albums, EPs, and singles.
- **News & Blog**: MDX-powered blog posts and news archive with tag filtering and search.
- **Live Gigs**: Interactive gig and tour listing with venue details and date filtering.
- **Photos & Videos**: Embedded media galleries, YouTube video showcases, and categorized photo albums.
- **Press & About**: Band biography, history timeline, member profiles, and press quotes.
- **SEO & Structured Data**: Automated XML sitemaps (pages, images, and videos) and Schema.org JSON-LD structured data.
- **Static Export**: Zero-server static build (`output: 'export'`) hosted seamlessly on GitHub Pages with custom domain support.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Static Export)
- **UI Library**: [React 19](https://react.dev/)
- **Content**: MDX (`next-mdx-remote`, `gray-matter`) & JSON data
- **Linting**: ESLint (`eslint-config-next`)
- **Deployment**: GitHub Actions + GitHub Pages

---

## Project Structure

```text
broken-links-website/
├── .github/workflows/       # GitHub Actions deployment workflow
├── public/                  # Static assets (images, favicons, CNAME, sitemaps)
├── scripts/                 # Sitemap and build generation scripts
├── src/
│   ├── app/                 # Next.js App Router pages and global layout
│   │   ├── about/           # Band biography and member profiles
│   │   ├── blog/ / news/    # MDX blog posts and news archive
│   │   ├── contact/         # Contact info and mailing list form
│   │   ├── live/            # Gig listings and tour history
│   │   ├── music/           # Discography and release details
│   │   ├── photos/          # Photo galleries
│   │   ├── press/           # Press reviews and coverage
│   │   └── videos/          # Video library and music videos
│   ├── components/          # Reusable React UI components
│   ├── data/                # Site data (albums.json, gigs.json, photos.json, MDX posts)
│   └── lib/                 # Utilities and helper functions
├── next.config.js           # Next.js configuration (static export)
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20` or higher
- **npm**: `v10` or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Mark-J-Lawrence/broken-links-website.git
cd broken-links-website
npm install
```

### Development

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To generate the static production export:

```bash
npm run build
```

This will compile and output static files into the `out/` directory.

### Generating Sitemaps

To regenerate page, image, and video sitemaps:

```bash
npm run sitemaps
```

---

## Deployment

The site is automatically built and deployed to GitHub Pages on every push to the `main` branch via the [deploy.yml](.github/workflows/deploy.yml) GitHub Actions workflow.

---

## Band Members

- **Mark Lawrence** — Vocals / Guitar
- **Lewis Betteridge** — Bass
- **Phil Boulter** — Drums

---

## License

All content, music, images, and brand assets © Broken Links. All rights reserved.
