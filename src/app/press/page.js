import Link from 'next/link'
import PageTitle from '../../components/PageTitle'
import { getPostsByCategory, getAllPosts } from '../../lib/getBlogPosts'
import { imgSrc } from '../../lib/basePath'

export const metadata = {
  title: 'Press',
  description: 'Broken Links press coverage — reviews, interviews and media features.',
}

/* ── Category colour map ─────────────────────────────────────── */
const CATEGORY_COLOURS = {
  press:       'var(--amber)',
  review:      'var(--red)',
  interview:   'var(--cyan)',
  feature:     'var(--gold)',
  music:       'var(--magenta)',
  news:        'var(--text-muted)',
  'gig-news':  'var(--red)',
}

function PressCard({ post, index }) {
  const colour = CATEGORY_COLOURS[post.category?.toLowerCase()] || 'var(--text-muted)'

  return (
    <Link
      href={`/news/${post.slug}`}
      className={`press-card reveal delay-${(index % 6) + 1}`}
      style={{ display: 'block' }}
    >
      {/* Featured image if available */}
      {post.image && post.image !== 'null' && (
        <div className="press-card-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc(post.image)}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="card-image-overlay" />
        </div>
      )}

      <div className="press-card-header">
        <span
          className="tag"
          style={{
            borderColor: colour,
            color: colour,
          }}
        >
          {post.category}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.1em', color: 'var(--text-dim)',
        }}>
          {new Date(post.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
        </span>
      </div>

      <h3 className="press-card-title">{post.title}</h3>
      {post.excerpt && <p className="press-card-excerpt">{post.excerpt}</p>}

      <div className="press-card-footer">
        <span className="press-publication">Broken Links</span>
        <span className="press-date">
          {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </Link>
  )
}

export default function PressPage() {
  // Get all press-category posts, plus reviews and interviews
  const pressPosts  = getPostsByCategory('press')
  const reviewPosts = getPostsByCategory('review')

  // Combine and deduplicate, sort newest first
  const seen = new Set()
  const allPressPosts = [...pressPosts, ...reviewPosts]
    .filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="Media"
            title="Press"
            subtitle={`${allPressPosts.length} press items — reviews, interviews and features from the music press.`}
          />
        </div>
      </section>

      {/* ── Press Grid ────────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="section-header reveal">
            <div>
              <p className="section-label">Coverage</p>
              <h2 className="section-title">In the Press</h2>
            </div>
            <Link href="/news" className="section-link">
              All news →
            </Link>
          </div>

          {allPressPosts.length === 0 ? (
            <div className="no-shows reveal" style={{ textAlign: 'center', padding: '80px 32px' }}>
              <p className="no-shows-text">No press posts found.</p>
            </div>
          ) : (
            <div className="grid-3">
              {allPressPosts.map((post, i) => (
                <PressCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Press Contact ─────────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="cta-block reveal">
            <div className="cta-block-corner cta-block-corner-tl" />
            <div className="cta-block-corner cta-block-corner-br" />
            <div style={{ maxWidth: 520 }}>
              <p className="section-label" style={{ marginBottom: 12 }}>Media Enquiries</p>
              <h2 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                color: 'var(--white)',
                marginBottom: 12,
              }}>
                Press & Interview Requests
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
                For press enquiries, interview requests, review copies and media assets,
                please get in touch via email.
              </p>
              <a href="mailto:press@brokenlinksmusic.co.uk" className="btn btn-primary">
                Contact Press
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

