import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Broken Links - Alternative Rock Band from Southampton, UK',
    template: '%s | Broken Links Band',
  },
  description: 'Broken Links - Industrial alternative rock band from Southampton, UK. Listen to our albums, watch videos, and find live show dates. Est. 2008.',
  keywords: [
    'Broken Links band',
    'Broken Links music',
    'alternative rock band',
    'industrial rock',
    'Southampton band',
    'UK rock band',
    'Broken Links Southampton',
    'electronic rock',
    'post-rock',
    'indie rock UK'
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Broken Links',
    description: 'Alternative rock band from Southampton, UK. Blending electronic, rock, and pop with cinematic intensity.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Broken Links',
    images: [
      {
        url: `${BASE_URL}/images/uploads/2021/02/Split-4000x2250-1-1024x576.jpg`,
        width: 1024,
        height: 576,
        alt: 'Broken Links',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Broken Links',
    description: 'Industrial rock band from Southampton, UK.',
    images: [`${BASE_URL}/images/uploads/2021/02/Split-4000x2250-1-1024x576.jpg`],
  },
  alternates: {
    canonical: `${BASE_URL}/`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/* ── Schema.org MusicGroup structured data ───────────────────── */
const SCHEMA_ORG = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Broken Links',
  url: BASE_URL,
  description: 'Industrial rock band from Southampton, UK, formed in 2008.',
  genre: ['Industrial Rock', 'Alternative Rock', 'Post-Rock'],
  foundingDate: '2008',
  foundingLocation: {
    '@type': 'Place',
    name: 'Southampton',
    addressCountry: 'GB',
  },
  member: [
    { '@type': 'OrganizationRole', member: { '@type': 'Person', name: 'Mark Lawrence' }, roleName: 'Vocals, Guitar' },
    { '@type': 'OrganizationRole', member: { '@type': 'Person', name: 'Lewis Betteridge' }, roleName: 'Bass' },
    { '@type': 'OrganizationRole', member: { '@type': 'Person', name: 'Phil Boulter' }, roleName: 'Drums' },
  ],
  album: [
    { '@type': 'MusicAlbum', name: 'Disasters: Ways to Leave a Scene', datePublished: '2012' },
    { '@type': 'MusicAlbum', name: 'Divide/Restore', datePublished: '2015' },
    { '@type': 'MusicAlbum', name: 'Conflict::States', datePublished: '2021' },
    { '@type': 'MusicAlbum', name: 'Konflix::Statez', datePublished: '2022' },
  ],
  sameAs: [
    'https://www.facebook.com/brokenlinksmusic',
    'https://twitter.com/brokenlinksband',
    'https://www.instagram.com/brokenlinksmusic',
    'https://brokenlinksmusic.bandcamp.com',
    'https://open.spotify.com/artist/broken-links',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org MusicGroup structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }}
        />
        
        {/* Google Analytics 4 - Replace G-XXXXXXXXXX with your Measurement ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-639VRSG3DT"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-639VRSG3DT');
            `,
          }}
        />
      </head>
      <body>
        {/* Skip link for keyboard navigation accessibility */}
        <a href="#content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="content">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  )
}


