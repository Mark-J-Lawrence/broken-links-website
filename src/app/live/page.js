import Link from 'next/link'
import PageTitle from '../../components/PageTitle'
import MailingListForm from '../../components/MailingListForm'
import gigsData from '../../data/gigs.json'
import venuesData from '../../data/venues.json'

export const metadata = {
  title: 'Live',
  description: 'Broken Links live shows — upcoming dates, tickets and venue information.',
  alternates: {
    canonical: 'https://www.brokenlinksmusic.co.uk/live/',
  },
}

/* ── Split into upcoming vs past ─────────────────────────────── */
const today = new Date().toISOString().slice(0, 10)
const allGigs = [...gigsData].sort((a, b) =>
  new Date(b.date) - new Date(a.date)
)
const upcomingShows = allGigs.filter(g => g.date >= today && g.status !== 'cancelled')
const recentShows   = allGigs.filter(g => g.date < today).slice(0, 5)

/* ── Show Row ────────────────────────────────────────────────── */
function ShowRow({ gig, index }) {
  const d = new Date(gig.date)
  const day   = d.getUTCDate().toString().padStart(2, '0')
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()
  const year  = d.getUTCFullYear()

  const isPast = gig.date < today
  const hasTickets = gig.ticketUrl && !gig.ticketUrl.includes('brokenlinksmusic.co.uk')

  return (
    <div className={`show-item reveal delay-${(index % 6) + 1}`}>
      <div className="show-date">
        <span className="show-date-day">{day}</span>
        {month} {year}
      </div>

      <div className="show-info">
        <p className="show-venue">
          <Link href={`/live/venues/${gig.venueSlug}`} className="show-venue-link">
            {gig.venueName}
          </Link>
        </p>
        <p className="show-location">
          {gig.city}{gig.city && gig.country ? ', ' : ''}{gig.country}
        </p>
        <p className="show-notes">{gig.notes || '\u00A0'}</p>
      </div>

      <div className="show-action">
        {isPast || !hasTickets ? (
          <Link
            href={`/live/venues/${gig.venueSlug}`}
            className="btn btn-outline"
            style={{ fontSize: '0.65rem', padding: '8px 16px' }}
          >
            Venue →
          </Link>
        ) : (
          <a
            href={gig.ticketUrl}
            className="btn btn-outline"
            style={{ fontSize: '0.65rem', padding: '8px 16px' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tickets
          </a>
        )}
      </div>
    </div>
  )
}

export default function LivePage() {
  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="On Tour"
            title="Live Shows"
            subtitle={upcomingShows.length > 0
              ? `${upcomingShows.length} upcoming date${upcomingShows.length !== 1 ? 's' : ''} — tickets available now.`
              : 'No upcoming shows scheduled — check back soon.'}
          />
        </div>
      </section>

      {/* ── Upcoming Shows ────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="section-header reveal">
            <div>
              <p className="section-label">Upcoming</p>
              <h2 className="section-title">Tour Dates</h2>
            </div>
            <Link href="/live/history" className="section-link">
              Show history →
            </Link>
          </div>

          {upcomingShows.length > 0 ? (
            <div className="shows-list">
              {upcomingShows.map((gig, i) => (
                <ShowRow key={gig.id} gig={gig} index={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="no-shows reveal">
                <p className="no-shows-text">No upcoming shows scheduled.</p>
                <p className="no-shows-sub">Check back soon or follow us on social media for announcements.</p>
              </div>

              {/* Show most recent past shows as context */}
              {recentShows.length > 0 && (
                <>
                  <div className="section-header reveal" style={{ marginTop: 48 }}>
                    <div>
                      <p className="section-label">Recent</p>
                      <h2 className="section-title">Past Shows</h2>
                    </div>
                    <Link href="/live/history" className="section-link">
                      Full history →
                    </Link>
                  </div>
                  <div className="shows-list">
                    {recentShows.map((gig, i) => (
                      <ShowRow key={gig.id} gig={gig} index={i} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Mailing List CTA ──────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="cta-block reveal">
            <div className="cta-block-corner cta-block-corner-tl" />
            <div className="cta-block-corner cta-block-corner-br" />
            <div style={{ maxWidth: 520 }}>
              <p className="section-label" style={{ marginBottom: 12 }}>Never Miss a Show</p>
              <h2 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                color: 'var(--white)',
                marginBottom: 12,
              }}>
                Get tour announcements first
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
                Sign up to the mailing list and be the first to know about new tour dates and ticket sales.
              </p>
              <MailingListForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Links ───────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="section-header reveal">
            <div>
              <p className="section-label">More</p>
              <h2 className="section-title">Quick Links</h2>
            </div>
          </div>
          <div className="grid-3">
            <Link href="/live/history" className="quick-link-card reveal delay-1">
              <span className="quick-link-icon">◎</span>
              <div>
                <p className="quick-link-title">Show History</p>
                <p className="quick-link-desc">Browse all {allGigs.length} past performances</p>
              </div>
            </Link>
            <Link href="/photos" className="quick-link-card reveal delay-2">
              <span className="quick-link-icon">◈</span>
              <div>
                <p className="quick-link-title">Live Photos</p>
                <p className="quick-link-desc">912 photos from live shows</p>
              </div>
            </Link>
            <Link href="/videos" className="quick-link-card reveal delay-3">
              <span className="quick-link-icon">▶</span>
              <div>
                <p className="quick-link-title">Live Videos</p>
                <p className="quick-link-desc">Watch live recordings on YouTube</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

