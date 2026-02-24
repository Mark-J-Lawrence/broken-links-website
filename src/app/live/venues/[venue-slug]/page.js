import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageTitle from '../../../../components/PageTitle'
import BackButton from '../../../../components/BackButton'
import venuesData from '../../../../data/venues.json'
import gigsData from '../../../../data/gigs.json'

/* ── Static params for static export ────────────────────────── */
export async function generateStaticParams() {
  return venuesData.map(v => ({ 'venue-slug': v.slug }))
}

/* ── Per-venue metadata ──────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const venue = venuesData.find(v => v.slug === resolvedParams['venue-slug'])
  if (!venue) return { title: 'Venue Not Found' }
  return {
    title: venue.name,
    description: `${venue.name} — ${venue.city}${venue.country ? ', ' + venue.country : ''}. Broken Links live shows at this venue.`,
  }
}

/* ── Helpers ─────────────────────────────────────────────────── */
function decodeHtml(str) {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#039;/g, "'")
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  const day   = d.getUTCDate().toString().padStart(2, '0')
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()
  const year  = d.getUTCFullYear()
  return { day, month, year }
}

export default async function VenuePage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams['venue-slug']
  const venue = venuesData.find(v => v.slug === slug)
  if (!venue) notFound()

  const venueName = decodeHtml(venue.name)

  // All shows at this venue, sorted newest first
  const today = new Date().toISOString().slice(0, 10)
  const venueShows = gigsData
    .filter(g => g.venueSlug === slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const upcomingShows = venueShows.filter(g => g.date >= today)
  const pastShows     = venueShows.filter(g => g.date < today)

  // Build Google Maps URL
  const addressParts = [venue.address, venue.city, venue.postcode, venue.country].filter(Boolean)
  const mapsUrl = addressParts.length > 0
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressParts.join(', '))}`
    : null

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <nav style={{ marginBottom: 16 }}>
            <BackButton fallbackHref="/live">
              ← Back
            </BackButton>
          </nav>
          <PageTitle
            label="Venue"
            title={venueName}
            subtitle={[venue.city, venue.province, venue.country].filter(Boolean).join(', ')}
          />
        </div>
      </section>

      {/* ── Venue Details ─────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="venue-layout">

            {/* Info card */}
            <div className="venue-info-card reveal">
              <p className="section-label" style={{ marginBottom: 16 }}>Venue Details</p>

              {venue.address && (
                <div className="venue-detail-row">
                  <span className="venue-detail-label">Address</span>
                  <span className="venue-detail-value">
                    {[venue.address, venue.city, venue.postcode].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}

              {venue.city && (
                <div className="venue-detail-row">
                  <span className="venue-detail-label">City</span>
                  <span className="venue-detail-value">{venue.city}</span>
                </div>
              )}

              {venue.province && (
                <div className="venue-detail-row">
                  <span className="venue-detail-label">Region</span>
                  <span className="venue-detail-value">{venue.province}</span>
                </div>
              )}

              {venue.country && (
                <div className="venue-detail-row">
                  <span className="venue-detail-label">Country</span>
                  <span className="venue-detail-value">{venue.country}</span>
                </div>
              )}

              {venue.phone && (
                <div className="venue-detail-row">
                  <span className="venue-detail-label">Phone</span>
                  <a href={`tel:${venue.phone}`} className="venue-detail-value venue-detail-link">
                    {venue.phone}
                  </a>
                </div>
              )}

              {venue.website && (
                <div className="venue-detail-row">
                  <span className="venue-detail-label">Website</span>
                  <a
                    href={venue.website}
                    className="venue-detail-value venue-detail-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {venue.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </div>
              )}

              <div className="venue-detail-row">
                <span className="venue-detail-label">Shows</span>
                <span className="venue-detail-value">{venueShows.length} total</span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
                {venue.website && (
                  <a
                    href={venue.website}
                    className="btn btn-outline"
                    style={{ fontSize: '0.65rem', padding: '10px 18px' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗ Website
                  </a>
                )}
              </div>
            </div>

            {/* Google Maps embed */}
            {mapsUrl && (
              <div className="venue-map reveal">
                <p className="section-label" style={{ marginBottom: 16 }}>Location</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    position: 'relative',
                    width: '100%',
                    height: 400,
                    border: '1px solid var(--border)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(addressParts.join(', '))}&output=embed`}
                    width="100%"
                    height="400"
                    style={{ border: 0, pointerEvents: 'none' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${venueName}`}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'transparent',
                    }}
                  />
                </a>
                <p style={{
                  marginTop: 8,
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                }}>
                  Click map to open in Google Maps
                </p>
              </div>
            )}

            {/* Shows at this venue */}
            <div className="venue-shows">
              {upcomingShows.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <div className="section-header reveal">
                    <div>
                      <p className="section-label">Upcoming</p>
                      <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Upcoming Shows</h2>
                    </div>
                  </div>
                  <div className="shows-list">
                    {upcomingShows.map((gig, i) => {
                      const { day, month, year } = formatDateShort(gig.date)
                      const hasTickets = gig.ticketUrl && !gig.ticketUrl.includes('brokenlinksmusic.co.uk')
                      return (
                        <div key={gig.id} className={`show-item reveal delay-${(i % 6) + 1}`}>
                          <div className="show-date">
                            <span className="show-date-day">{day}</span>
                            {month} {year}
                          </div>
                          <div className="show-info">
                            <p className="show-venue">{gig.title || venueName}</p>
                          </div>
                          <div className="show-action">
                            {hasTickets ? (
                              <a href={gig.ticketUrl} className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '8px 16px' }} target="_blank" rel="noopener noreferrer">
                                Tickets
                              </a>
                            ) : (
                              <span className="tag">TBC</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {pastShows.length > 0 && (
                <div>
                  <div className="section-header reveal">
                    <div>
                      <p className="section-label">History</p>
                      <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Past Shows</h2>
                    </div>
                  </div>
                  <div className="shows-list">
                    {pastShows.map((gig, i) => {
                      const { day, month, year } = formatDateShort(gig.date)
                      return (
                        <div key={gig.id} className={`show-item reveal delay-${(i % 6) + 1}`}>
                          <div className="show-date">
                            <span className="show-date-day">{day}</span>
                            {month} {year}
                          </div>
                          <div className="show-info">
                            <p className="show-venue">{gig.title || venueName}</p>
                          </div>
                          <div className="show-action">
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                              letterSpacing: '0.1em', color: 'var(--text-dim)',
                              textTransform: 'uppercase',
                            }}>
                              Past
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {venueShows.length === 0 && (
                <div className="no-shows reveal">
                  <p className="no-shows-text">No shows recorded at this venue.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Back / Nav ────────────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)', borderBottom: 'none' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/live" className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '10px 20px' }}>
              ← Upcoming Shows
            </Link>
            <Link href="/live/history" className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '10px 20px' }}>
              Full Show History
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

