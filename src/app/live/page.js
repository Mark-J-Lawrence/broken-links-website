import gigsData from '../../data/gigs.json'
import venuesData from '../../data/venues.json'
import LiveClient from '../../components/LiveClient'

export const metadata = {
  title: 'Live',
  description: 'Broken Links live shows — upcoming dates, tickets and venue information.',
  alternates: {
    canonical: 'https://www.brokenlinksmusic.co.uk/live/',
  },
}

// Build-time structured data for all gigs that were upcoming at deploy time.
// This provides a baseline for search engine crawlers; the client component
// re-evaluates today's date in the browser so the UI is always accurate.
const buildTimeToday = new Date().toISOString().slice(0, 10)
const allGigsSorted = [...gigsData].sort((a, b) => new Date(b.date) - new Date(a.date))
const upcomingAtBuild = allGigsSorted.filter(
  g => g.date >= buildTimeToday && g.status !== 'cancelled'
)

const eventSchemas = upcomingAtBuild.map(gig => {
  const venue = venuesData.find(v => v.slug === gig.venueSlug) || {}
  const startDateTime = `${gig.date}T${gig.time || '19:00'}:00`
  const endDateTime = gig.time
    ? `${gig.date}T${String(parseInt(gig.time.split(':')[0]) + 3).padStart(2, '0')}:00:00`
    : `${gig.date}T22:00:00`

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `Broken Links at ${gig.venueName}`,
    description: gig.notes || `Broken Links live performance at ${gig.venueName} in ${gig.city}, ${gig.country}. Experience high-energy alternative rock music.`,
    startDate: startDateTime,
    endDate: endDateTime,
    eventStatus: gig.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : gig.status === 'postponed'
      ? 'https://schema.org/EventPostponed'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [
      'https://www.brokenlinksmusic.co.uk/images/uploads/2021/02/Split-4000x2250-1-1024x576.jpg',
      'https://www.brokenlinksmusic.co.uk/images/uploads/2018/03/0007-9.jpg'
    ],
    location: {
      '@type': 'Place',
      name: gig.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.address || '',
        addressLocality: gig.city,
        addressRegion: venue.province || '',
        postalCode: venue.postcode || '',
        addressCountry: gig.country
      }
    },
    organizer: {
      '@type': 'MusicGroup',
      name: 'Broken Links',
      url: 'https://www.brokenlinksmusic.co.uk',
      sameAs: [
        'https://www.facebook.com/brokenlinksmusic',
        'https://www.instagram.com/brokenlinksmusic',
        'https://www.youtube.com/brokenlinksmusic',
        'https://open.spotify.com/artist/brokenlinks'
      ]
    },
    performer: {
      '@type': 'MusicGroup',
      name: 'Broken Links',
      url: 'https://www.brokenlinksmusic.co.uk'
    },
    offers: gig.ticketUrl && !gig.ticketUrl.includes('brokenlinksmusic.co.uk') ? {
      '@type': 'Offer',
      url: gig.ticketUrl,
      price: gig.price === 'Free' ? '0' : gig.price || '10',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    } : {
      '@type': 'Offer',
      url: `https://www.brokenlinksmusic.co.uk/live/venues/${gig.venueSlug}`,
      price: gig.price === 'Free' ? '0' : gig.price || '10',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }
})

export default function LivePage() {
  return (
    <>
      {/* Event structured data for search engine crawlers */}
      {eventSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchemas) }}
        />
      )}

      {/* All display logic runs client-side so today's date is always current */}
      <LiveClient gigsData={gigsData} />
    </>
  )
}
