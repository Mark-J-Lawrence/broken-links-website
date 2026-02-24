import Link from 'next/link'

export const metadata = {
  title: '404 — Page Not Found',
}

export default function NotFound() {
  return (
    <section style={{
      minHeight: 'calc(100vh - var(--header-h))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        {/* Glitch number */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--surface-2)',
            letterSpacing: '-0.05em',
            userSelect: 'none',
          }}>
            404
          </p>
          {/* Amber neon overlay */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--amber)',
            letterSpacing: '-0.05em',
            position: 'absolute',
            top: 0, left: 0,
            opacity: 0.15,
            textShadow: '0 0 40px var(--amber-glow), 0 0 80px var(--red-glow)',
            userSelect: 'none',
          }}>
            404
          </p>
        </div>

        {/* Accent line */}
        <div style={{
          width: 60, height: 2,
          background: 'linear-gradient(90deg, var(--red), var(--amber))',
          boxShadow: '0 0 8px var(--red-glow)',
          margin: '0 auto 24px',
        }} />

        <p className="section-label" style={{ marginBottom: 16, justifyContent: 'center' }}>
          Signal Lost
        </p>

        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: 'var(--white)',
          marginBottom: 16,
        }}>
          Page Not Found
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            ← Back to Home
          </Link>
          <Link href="/news" className="btn btn-outline">
            Browse News
          </Link>
        </div>

        {/* Mono footer note */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          marginTop: 48,
        }}>
          brokenlinksmusic.co.uk // error 404
        </p>
      </div>
    </section>
  )
}

