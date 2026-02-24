import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag, getAllPosts } from '../../../../lib/getBlogPosts'
import PageTitle from '../../../../components/PageTitle'

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(tag => ({ tag }))
}

export async function generateMetadata({ params }) {
  const { tag } = await params
  return {
    title: `#${tag}`,
    description: `Broken Links news articles tagged with "${tag}".`,
  }
}

const CATEGORY_COLOURS = {
  announcement: 'var(--amber)',
  review:       'var(--red)',
  music:        'var(--gold)',
  interview:    'var(--cyan)',
  feature:      'var(--magenta)',
}

export default async function TagPage({ params }) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  if (!posts) notFound()

  const catColour = (cat) => CATEGORY_COLOURS[cat?.toLowerCase()] || 'var(--text-muted)'

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <nav style={{ marginBottom: 16 }}>
            <Link href="/news" className="back-link" style={{ marginBottom: 0 }}>
              ← All news
            </Link>
          </nav>
          <PageTitle
            label="Tag"
            title={`#${tag}`}
            subtitle={`${posts.length} post${posts.length !== 1 ? 's' : ''} tagged with "${tag}".`}
          />
        </div>
      </section>

      {/* ── Posts ─────────────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          {posts.length === 0 ? (
            <div className="no-shows reveal" style={{ textAlign: 'center', padding: '80px 32px' }}>
              <p className="no-shows-text">No posts with this tag yet.</p>
              <Link href="/news" className="btn btn-outline" style={{ marginTop: 24, fontSize: '0.7rem' }}>
                Browse all news
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className={`card reveal delay-${(i % 6) + 1}`}
                  style={{ display: 'block' }}
                >
                  <div className="card-image">
                    <div className="card-image-overlay" />
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image} alt={post.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--text-dim)',
                      }}>
                        //
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <p className="card-meta">
                      <span style={{ color: catColour(post.category) }}>{post.category}</span>
                      <span className="card-meta-sep" />
                      <span>{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </p>
                    <h3 className="card-title">{post.title}</h3>
                    {post.excerpt && <p className="card-excerpt">{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

