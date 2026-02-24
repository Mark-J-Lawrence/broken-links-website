'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { imgSrc } from '../lib/basePath'

const PER_PAGE = 12

const CATEGORY_COLOURS = {
  announcement: 'var(--amber)',
  review:       'var(--red)',
  music:        'var(--gold)',
  interview:    'var(--cyan)',
  feature:      'var(--magenta)',
}

function BlogCard({ post, index }) {
  const catColour = CATEGORY_COLOURS[post.category?.toLowerCase()] || 'var(--text-muted)'

  return (
    <Link
      href={`/news/${post.slug}`}
      className={`card reveal delay-${(index % 6) + 1}`}
      style={{ display: 'block' }}
    >
      {/* Featured image */}
      <div className="card-image">
        <div className="card-image-overlay" />
        {post.image && post.image !== 'null' && post.image !== null ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc(post.image)}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          // Fallback: show band logo on textured background
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Texture overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              pointerEvents: 'none',
            }} />
            {/* Band logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc('/images/logo.png')}
              alt="Broken Links"
              style={{
                width: '70%',
                height: 'auto',
                opacity: 0.4,
                filter: 'brightness(0.8)',
              }}
            />
          </div>
        )}
      </div>

      <div className="card-body">
        <p className="card-meta">
          <span style={{ color: catColour, textShadow: `0 0 6px ${catColour}40` }}>
            {post.category}
          </span>
          <span className="card-meta-sep" />
          <span>
            {new Date(post.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </p>
        <h3 className="card-title">{post.title}</h3>
        {post.excerpt && <p className="card-excerpt">{post.excerpt}</p>}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function NewsGrid({ posts }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const total = posts.length
  const totalPages = Math.ceil(total / PER_PAGE)
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PER_PAGE
  const pagePosts = posts.slice(start, start + PER_PAGE)

  function goToPage(p) {
    const params = new URLSearchParams(searchParams.toString())
    if (p === 1) {
      params.delete('page')
    } else {
      params.set('page', String(p))
    }
    const query = params.toString()
    router.push(`/news${query ? '?' + query : ''}`, { scroll: true })
  }

  return (
    <section className="page-section">
      <div className="container">
        {pagePosts.length === 0 ? (
          <div className="no-shows reveal" style={{ textAlign: 'center', padding: '80px 32px' }}>
            <p className="no-shows-text">No posts yet.</p>
          </div>
        ) : (
          <div className="grid-3">
            {pagePosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="pagination reveal">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
              className="btn btn-outline"
              style={{ fontSize: '0.7rem', padding: '10px 20px', opacity: safePage <= 1 ? 0.3 : 1, cursor: safePage <= 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous
            </button>

            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`pagination-page${p === safePage ? ' active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className="btn btn-outline"
              style={{ fontSize: '0.7rem', padding: '10px 20px', opacity: safePage >= totalPages ? 0.3 : 1, cursor: safePage >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default function NewsClient({ posts }) {
  return (
    <Suspense fallback={
      <section className="page-section">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '80px 32px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            Loading…
          </div>
        </div>
      </section>
    }>
      <NewsGrid posts={posts} />
    </Suspense>
  )
}

