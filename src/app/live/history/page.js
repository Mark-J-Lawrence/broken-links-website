import Link from 'next/link'
import PageTitle from '../../../components/PageTitle'
import gigsData from '../../../data/gigs.json'
import venuesData from '../../../data/venues.json'

export const metadata = {
  title: 'Show History',
  description: 'Broken Links complete live show history — every gig, every venue.',
}

/* ── Sort all gigs ───────────────────────────────────────────── */
const allGigs = [...gigsData].sort((a, b) => new Date(b.date) - new Date(a.date))

/* ── Group by year ───────────────────────────────────────────── */
const gigsByYear = allGigs.reduce((acc, gig) => {
  const year = (gig.date || '').slice(0, 4)
  if (!acc[year]) acc[year] = []
  acc[year].push(gig)
  return acc
}, {})

const years = Object.keys(gigsByYear).sort((a, b) => b - a)

export default function LiveHistoryPage() {
  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="Live History"
            title="Show History"
            subtitle={`Every gig, every venue. ${allGigs.length} shows archived.`}
          />
        </div>
      </section>

      {/* ── Back link ─────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: 24 }}>
        <Link href="/live" className="back-link reveal">
          ← Upcoming shows
        </Link>
      </div>

      {/* ── Shows by Year ─────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          {years.map(year => {
            const shows = gigsByYear[year]
            return (
              <div key={year} className="history-year-group">
                <div className="history-year-header reveal">
                  <h2 className="history-year-label">{year}</h2>
                  <span className="history-year-count">{shows.length} show{shows.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="shows-list">
                  {shows.map((gig, i) => {
                    const d = new Date(gig.date)
                    const day   = d.getUTCDate().toString().padStart(2, '0')
                    const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()
                    const yr    = d.getUTCFullYear()

                    return (
                      <div key={gig.id} className={`show-item reveal delay-${(i % 6) + 1}`}>
                        <div className="show-date">
                          <span className="show-date-day">{day}</span>
                          {month} {yr}
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
                          <Link
                            href={`/live/venues/${gig.venueSlug}`}
                            className="btn btn-outline"
                            style={{ fontSize: '0.65rem', padding: '8px 16px' }}
                          >
                            Venue →
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

