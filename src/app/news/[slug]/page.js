import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '../../../lib/getBlogPosts'
import YouTubeEmbed from '../../../components/YouTubeEmbed'
import { imgSrc } from '../../../lib/basePath'

/* ── Static params for static export ────────────────────────── */
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

/* ── Per-post metadata ───────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : [],
    },
  }
}

/* ── MDX component overrides ─────────────────────────────────── */
const MDX_COMPONENTS = {
  YouTubeEmbed,
  h1: (props) => <h1 className="post-h1" {...props} />,
  h2: (props) => <h2 className="post-h2" {...props} />,
  h3: (props) => <h3 className="post-h3" {...props} />,
  h4: (props) => <h4 className="post-h4" {...props} />,
  p:  (props) => <p  className="post-p"  {...props} />,
  a:  ({ href, children, ...props }) => (
    <a
      href={href}
      className="post-link"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: (props) => <ul className="post-ul" {...props} />,
  ol: (props) => <ol className="post-ol" {...props} />,
  li: (props) => <li className="post-li" {...props} />,
  blockquote: (props) => <blockquote className="post-blockquote" {...props} />,
  code: (props) => <code className="post-code-inline" {...props} />,
  pre:  (props) => <pre  className="post-code-block"  {...props} />,
  hr:   () => <hr className="post-hr" />,
  strong: (props) => <strong style={{ color: 'var(--white)', fontWeight: 600 }} {...props} />,
  em:     (props) => <em style={{ color: 'var(--text-muted)', fontStyle: 'italic' }} {...props} />,
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt, ...props }) => (
    <img
      src={src?.startsWith('/') ? imgSrc(src) : src}
      alt={alt || ''}
      style={{ maxWidth: '100%', height: 'auto' }}
      loading="lazy"
      {...props}
    />
  ),
}

const CATEGORY_COLOURS = {
  announcement: 'var(--amber)',
  review:       'var(--red)',
  music:        'var(--gold)',
  interview:    'var(--cyan)',
  feature:      'var(--magenta)',
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  const catColour = CATEGORY_COLOURS[post.category?.toLowerCase()] || 'var(--text-muted)'

  return (
    <>
      {/* ── Post Hero ─────────────────────────────────────────── */}
      <section className="post-hero">
        {post.image && (
          <div className="post-hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc(post.image)} alt={post.title} />
            <div className="post-hero-image-overlay" />
          </div>
        )}
        <div className="container">
          <div className="post-hero-content">
            {/* Breadcrumb */}
            <nav className="post-breadcrumb" aria-label="Breadcrumb">
              <Link href="/news" className="back-link" style={{ marginBottom: 0 }}>
                ← News
              </Link>
            </nav>

            {/* Category + date */}
            <div className="post-meta-row">
              <span
                className="tag tag-accent"
                style={{ borderColor: catColour, color: catColour }}
              >
                {post.category}
              </span>
              <span className="post-meta-date">
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
              {post.author && (
                <>
                  <span style={{ color: 'var(--text-dim)' }}>·</span>
                  <span className="post-meta-author">{post.author}</span>
                </>
              )}
            </div>

            <h1 className="post-title">{post.title}</h1>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
                {post.tags.map(tag => (
                  <Link key={tag} href={`/news/tag/${tag}`} className="tag">
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Post Body ─────────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="post-layout">
            {/* Main content */}
            <article className="post-content">
              <MDXRemote source={post.content} components={MDX_COMPONENTS} />
            </article>

            {/* Sidebar */}
            <aside className="post-sidebar">
              <div className="post-sidebar-card">
                <p className="section-label" style={{ marginBottom: 12 }}>About</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                  {post.author}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                  {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {post.tags?.length > 0 && (
                <div className="post-sidebar-card">
                  <p className="section-label" style={{ marginBottom: 12 }}>Tags</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <Link key={tag} href={`/news/tag/${tag}`} className="tag">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="post-sidebar-card">
                <p className="section-label" style={{ marginBottom: 12 }}>Browse</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/news" className="footer-link">All news</Link>
                  <Link href="/news/tag/announcement" className="footer-link">Announcements</Link>
                  <Link href="/news/tag/review" className="footer-link">Reviews</Link>
                  <Link href="/news/tag/live" className="footer-link">Live</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Prev / Next navigation ────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)', borderBottom: 'none' }}>
        <div className="container">
          <div className="post-nav">
            {prevPost ? (
              <Link href={`/news/${prevPost.slug}`} className="post-nav-item post-nav-prev">
                <span className="post-nav-label">← Previous</span>
                <span className="post-nav-title">{prevPost.title}</span>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link href={`/news/${nextPost.slug}`} className="post-nav-item post-nav-next">
                <span className="post-nav-label">Next →</span>
                <span className="post-nav-title">{nextPost.title}</span>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>
    </>
  )
}

