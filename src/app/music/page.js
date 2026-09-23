import Image from 'next/image'
import PageTitle from '../../components/PageTitle'
import { imgSrc } from '../../lib/basePath'
import albumsData from '../../data/albums.json'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

export const metadata = {
  title: 'Music',
  description: 'Broken Links discography — albums, singles and streaming links.',
  alternates: {
    canonical: `${BASE_URL}/music/`,
  },
  openGraph: {
    title: 'Music — Broken Links Discography',
    description: 'Broken Links discography — albums, singles and streaming links. Including Conflict::States (2021), Divide/Restore (2015) and more.',
    type: 'website',
    url: `${BASE_URL}/music`,
    images: [
      {
        url: `${BASE_URL}${albumsData[0]?.cover}`,
        width: 800,
        height: 800,
        alt: `Broken Links — ${albumsData[0]?.title} (${albumsData[0]?.year}) — Official Album Cover`,
      },
    ],
  },
}

/* Schema.org MusicAlbum + ImageObject structured data */
const MUSIC_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': albumsData.map(album => ({
    '@type': 'MusicAlbum',
    name: album.title,
    byArtist: { '@type': 'MusicGroup', name: 'Broken Links', url: BASE_URL },
    datePublished: album.year,
    image: {
      '@type': 'ImageObject',
      contentUrl: `${BASE_URL}${album.cover}`,
      name: `Broken Links — ${album.title} (${album.year}) — Official Album Cover`,
      description: `Official album cover artwork for ${album.title} by Broken Links.`,
      creditText: 'Broken Links',
      copyrightNotice: `© ${album.year} Broken Links. All rights reserved.`,
      license: `${BASE_URL}/music`,
      acquireLicensePage: `${BASE_URL}/contact`,
      creator: {
        '@type': 'Organization',
        name: 'Broken Links',
        url: BASE_URL,
      },
    },
    url: album.streaming.spotify,
    numTracks: album.tracks,
  })),
}

const ALBUMS = albumsData

const STREAMING_PLATFORMS = [
  { label: 'Spotify',     href: 'https://open.spotify.com/artist/0VBx7ymL8y6CI3TgOFFhTz', icon: '♫' },
  { label: 'Apple Music', href: 'https://music.apple.com/gb/artist/broken-links/305262241', icon: '♪' },
  { label: 'Bandcamp',    href: 'https://brokenlinks.bandcamp.com/', icon: '◈' },
  { label: 'YouTube',     href: 'https://www.youtube.com/c/brokenlinksmusic/videos', icon: '▶' },
  { label: 'Deezer',      href: 'https://www.deezer.com/search/Broken%20Links', icon: '≋' },
  { label: 'Amazon',      href: 'https://www.amazon.co.uk/s?k=Broken+Links&i=digital-music', icon: '◉' },
]

function AlbumRow({ album, index }) {
  const isEven = index % 2 === 0
  return (
    <div id={album.slug} className={`album-row reveal ${isEven ? '' : 'album-row-reverse'}`}>
      {/* Album art */}
      <div className="album-row-art">
        <div className="album-row-art-inner">
          <Image
            src={imgSrc(album.cover)}
            alt={`Broken Links — ${album.title} (${album.year}) — Official Album Cover`}
            width={500}
            height={500}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            unoptimized
          />
          <div className="album-overlay">
            <a href={album.streaming.spotify} className="btn btn-primary" style={{ fontSize: '0.65rem', padding: '10px 20px' }} target="_blank" rel="noopener noreferrer">
              ▶ Play
            </a>
          </div>
        </div>
      </div>

      {/* Album info */}
      <div className="album-row-info">
        <p className="section-label" style={{ marginBottom: 8 }}>
          {album.type} · {album.year} · {album.tracks} tracks
        </p>
        <h2 className="album-row-title">{album.title}</h2>
        <p className="album-row-desc">{album.description}</p>

        {/* Bandcamp Player */}
        {album.bandcampAlbumId && (
          <div style={{ marginTop: 24, marginBottom: 24 }}>
            <iframe
              style={{
                border: 0,
                width: '100%',
                height: '470px',
                maxWidth: '700px',
              }}
              src={`https://bandcamp.com/EmbeddedPlayer/album=${album.bandcampAlbumId}/size=large/bgcol=050508/linkcol=d4af37/tracklist=true/artwork=small/transparent=true/`}
              seamless
            >
              <a href={album.streaming.bandcamp}>
                {album.title} by Broken Links
              </a>
            </iframe>
          </div>
        )}

        {/* Streaming links */}
        <div className="album-streaming">
          {Object.entries(album.streaming).map(([platform, href]) => (
            <a
              key={platform}
              href={href}
              className="btn btn-outline"
              style={{ fontSize: '0.65rem', padding: '8px 16px' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MusicPage() {
  return (
    <>
      {/* Schema.org MusicAlbum + ImageObject structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MUSIC_SCHEMA) }}
      />

      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="Discography"
            title="Music"
            subtitle="Four releases blending electronic, rock, and pop. Available on all major platforms."
          />
        </div>
      </section>

      {/* ── All Platforms Banner ──────────────────────────────── */}
      <div className="streaming-banner reveal">
        <div className="container">
          <div className="streaming-banner-inner">
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>Stream & Download</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                All releases available on every major platform
              </p>
            </div>
            <div className="streaming-links">
              {STREAMING_PLATFORMS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  className="streaming-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <span className="streaming-link-icon">{icon}</span>
                  <span className="streaming-link-label">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Albums ────────────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="section-header reveal">
            <div>
              <p className="section-label">Releases</p>
              <h2 className="section-title">Albums</h2>
            </div>
          </div>

          <div className="albums-list">
            {ALBUMS.map((album, i) => (
              <AlbumRow key={album.slug} album={album} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bandcamp CTA ──────────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="cta-block reveal">
            <div className="cta-block-corner cta-block-corner-tl" />
            <div className="cta-block-corner cta-block-corner-br" />
            <div>
              <p className="section-label" style={{ marginBottom: 12 }}>Support the Band</p>
              <h2 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                color: 'var(--white)',
                marginBottom: 12,
              }}>
                Buy direct on Bandcamp
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem', maxWidth: 480 }}>
                Purchase digital downloads and physical merchandise directly from the band.
                100% of Bandcamp sales go directly to Broken Links.
              </p>
              <a
                href="https://brokenlinks.bandcamp.com/"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                ◈ Visit Bandcamp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

