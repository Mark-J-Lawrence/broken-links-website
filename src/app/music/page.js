import Image from 'next/image'
import PageTitle from '../../components/PageTitle'
import { imgSrc } from '../../lib/basePath'

export const metadata = {
  title: 'Music',
  description: 'Broken Links discography — albums, singles and streaming links.',
  alternates: {
    canonical: 'https://www.brokenlinksmusic.co.uk/music/',
  },
}

const ALBUMS = [
  {
    slug: 'konflux-statez',
    title: 'Konflix::Statez',
    year: '2022',
    type: 'Remix Album',
    tracks: 7,
    cover: '/images/uploads/2022/03/konflix-1.jpg',
    bandcampAlbumId: '3515567676',
    description:
      'A free remix album of tracks taken from Conflict::States, reimagined by producers from across the world. Available as a free download on Bandcamp. Heavier, angrier, and heavily EDM-laden — a different angle on the same fury.',
    streaming: {
      spotify: 'https://open.spotify.com/album/0gnEO0kJ6JvyS9RRZwVpRV',
      apple: 'https://music.apple.com/gb/album/konflix-statez/1613610685',
      bandcamp: 'https://brokenlinks.bandcamp.com/album/konflix-statez',
    },
  },
  {
    slug: 'conflict-states',
    title: 'Conflict::States',
    year: '2021',
    type: 'Album',
    tracks: 12,
    cover: '/images/uploads/2021/02/Broken-Links-Conflict-States-1600x1600-1.jpg',
    bandcampAlbumId: '2837274392',
    description:
      'The third album. An angry 12-track declaration aimed at the current state of the world. Goth-electro textures, post-punk drive, and uncompromising lyrics. "People are living in a world where they think they have choices. There are no choices. We\'re on borrowed time."',
    streaming: {
      spotify: 'https://open.spotify.com/album/4SyPtVjIEpOguYMtQ9oTGr',
      apple: 'https://music.apple.com/gb/album/conflict-states/1548621813',
      bandcamp: 'https://brokenlinks.bandcamp.com/album/conflict-states',
    },
  },
  {
    slug: 'divide-restore',
    title: 'Divide/Restore',
    year: '2015',
    type: 'Album',
    tracks: 10,
    cover: '/images/uploads/2009/04/broken-links-divide-restore-cover-800.jpg',
    bandcampAlbumId: '377594656',
    description:
      'The second album. Darker and more expansive than the debut, Divide/Restore pushed the band\'s sound into new territory — atmospheric, heavy, and relentless. Featured in the end credits of the 2013 film Zombie Resurrection.',
    streaming: {
      spotify: 'https://open.spotify.com/album/4mQ1pXledJS7jDjwPU77je',
      apple: 'https://music.apple.com/gb/album/divide-restore/978822409',
      bandcamp: 'https://brokenlinks.bandcamp.com/album/divide-restore',
    },
  },
  {
    slug: 'disasters-ways-to-leave-a-scene',
    title: 'Disasters: Ways to Leave a Scene',
    year: '2012',
    type: 'Album',
    tracks: 11,
    cover: '/images/uploads/2009/04/disasters-ways-to-leave-a-scene-cover-800.jpg',
    bandcampAlbumId: '2393754006',
    description:
      'The debut album. Raw, energetic and direct — a statement of intent. Received widespread critical acclaim, with reviews in Rock Sound, Powerplay Magazine, and dozens of music blogs. The record that put Broken Links on the map.',
    streaming: {
      spotify: 'https://open.spotify.com/album/2S0t9F3NHTT5hCoqM8bk0u',
      apple: 'https://music.apple.com/gb/album/disasters-ways-to-leave-a-scene/979715913',
      bandcamp: 'https://brokenlinks.bandcamp.com/album/disasters-ways-to-leave-a-scene',
    },
  },
]

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
            alt={`${album.title} album cover`}
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

