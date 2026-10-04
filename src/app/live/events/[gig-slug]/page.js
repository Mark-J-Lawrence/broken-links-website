import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageTitle from '../../../../components/PageTitle'
import gigsData from '../../../../data/gigs.json'
import venuesData from '../../../../data/venues.json'

const BASE_URL = 'https://www.brokenlinksmusic.co.uk'

export function generateStaticParams() {
    return gigsData.map(gig => ({ 'gig-slug': gig.slug }))
}

function formatDate(date, time) {
    const value = new Date(`${date}T${time || '12:00'}:00Z`)
    const dateLabel = value.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    })
    return time ? `${dateLabel} at ${time}` : dateLabel
}

function getEventName(gig, venueName) {
    return gig.title && gig.title !== venueName ? gig.title : `Broken Links at ${venueName}`
}

function getPrice(price) {
    if (price === 'Free') return 0
    const amount = Number.parseFloat(String(price || '').replace(/[^\d.]/g, ''))
    return Number.isFinite(amount) ? amount : null
}

function getEventSchema(gig, venue) {
    const eventUrl = `${BASE_URL}/live/events/${gig.slug}/`
    const venueName = venue?.name || gig.venueName
    const startDate = gig.time ? `${gig.date}T${gig.time}:00` : gig.date
    const price = getPrice(gig.price)
    const hasTicketPage = Boolean(
        gig.date >= new Date().toISOString().slice(0, 10)
        && gig.status !== 'cancelled'
        && gig.ticketUrl
        && !gig.ticketUrl.includes('brokenlinksmusic.co.uk')
    )
    const event = {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        '@id': eventUrl,
        url: eventUrl,
        name: getEventName(gig, venueName),
        startDate,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: venueName,
            address: {
                '@type': 'PostalAddress',
                ...(venue?.address ? { streetAddress: venue.address } : {}),
                addressLocality: venue?.city || gig.city,
                ...(venue?.province ? { addressRegion: venue.province } : {}),
                ...(venue?.postcode ? { postalCode: venue.postcode } : {}),
                addressCountry: 'GB',
            },
        },
        performer: {
            '@type': 'MusicGroup',
            name: 'Broken Links',
            url: BASE_URL,
        },
    }

    event.description = gig.notes || `Broken Links live at ${venueName} in ${gig.city}.`
    if (gig.status === 'cancelled') event.eventStatus = 'https://schema.org/EventCancelled'
    else if (gig.date >= new Date().toISOString().slice(0, 10)) event.eventStatus = 'https://schema.org/EventScheduled'
    if (hasTicketPage && price !== null) {
        event.offers = {
            '@type': 'Offer',
            url: gig.ticketUrl,
            price,
            priceCurrency: 'GBP',
        }
    }

    return event
}

export async function generateMetadata({ params }) {
    const { 'gig-slug': slug } = await params
    const gig = gigsData.find(item => item.slug === slug)
    if (!gig) return { title: 'Event Not Found' }

    const venue = venuesData.find(item => item.slug === gig.venueSlug)
    const venueName = venue?.name || gig.venueName
    const eventName = getEventName(gig, venueName)
    const eventDate = new Date(`${gig.date}T12:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    })
    const title = `${eventName} | ${eventDate}`
    return {
        title: { absolute: title },
        description: `${eventName} on ${formatDate(gig.date, gig.time)} in ${gig.city}${gig.country ? `, ${gig.country}` : ''}.`,
        alternates: { canonical: `${BASE_URL}/live/events/${gig.slug}/` },
        openGraph: { title, type: 'article' },
    }
}

export default async function EventPage({ params }) {
    const { 'gig-slug': slug } = await params
    const gig = gigsData.find(item => item.slug === slug)
    if (!gig) notFound()

    const venue = venuesData.find(item => item.slug === gig.venueSlug)
    const venueName = venue?.name || gig.venueName
    const address = [venue?.address, venue?.city || gig.city, venue?.postcode, venue?.country || gig.country]
        .filter(Boolean)
        .join(', ')
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    const hasTicketPage = Boolean(
        gig.date >= new Date().toISOString().slice(0, 10)
        && gig.status !== 'cancelled'
        && gig.ticketUrl
        && !gig.ticketUrl.includes('brokenlinksmusic.co.uk')
    )
    const dateLabel = formatDate(gig.date, gig.time)
    const schema = getEventSchema(gig, venue)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
            />

            <section className="page-hero">
                <div className="container">
                    <nav style={{ marginBottom: 16 }}>
                        <Link href="/live" className="back-link">← All shows</Link>
                    </nav>
                    <PageTitle
                        label="Live Event"
                        title={getEventName(gig, venueName)}
                        subtitle={`${dateLabel} · ${gig.city}${gig.country ? `, ${gig.country}` : ''}`}
                    />
                </div>
            </section>

            <section className="page-section">
                <div className="container">
                    <div className="venue-layout">
                        <div className="venue-info-card reveal">
                            <p className="section-label" style={{ marginBottom: 16 }}>Event Details</p>
                            <div className="venue-detail-row">
                                <span className="venue-detail-label">Date</span>
                                <span className="venue-detail-value">{dateLabel}</span>
                            </div>
                            {gig.status === 'cancelled' && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Status</span>
                                    <span className="venue-detail-value">Cancelled</span>
                                </div>
                            )}
                            <div className="venue-detail-row">
                                <span className="venue-detail-label">Venue</span>
                                <span className="venue-detail-value">
                                    <Link href={`/live/venues/${gig.venueSlug}`} className="venue-detail-link">{venueName}</Link>
                                </span>
                            </div>
                            <div className="venue-detail-row">
                                <span className="venue-detail-label">Location</span>
                                <span className="venue-detail-value">{[gig.city, venue?.province, gig.country].filter(Boolean).join(', ')}</span>
                            </div>
                            {gig.admittance && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Admittance</span>
                                    <span className="venue-detail-value">{gig.admittance}</span>
                                </div>
                            )}
                            {gig.price && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Price</span>
                                    <span className="venue-detail-value">{gig.price}</span>
                                </div>
                            )}
                            {gig.notes && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Details</span>
                                    <span className="venue-detail-value">{gig.notes}</span>
                                </div>
                            )}
                            {gig.tour && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Tour</span>
                                    <span className="venue-detail-value">{gig.tour}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
                                {hasTicketPage && (
                                    <a href={gig.ticketUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                        Tickets
                                    </a>
                                )}
                                <Link href={`/live/venues/${gig.venueSlug}`} className="btn btn-outline">
                                    Venue details
                                </Link>
                            </div>
                        </div>

                        <div className="venue-info-card reveal">
                            <p className="section-label" style={{ marginBottom: 16 }}>Venue Details</p>
                            {venue?.address && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Address</span>
                                    <span className="venue-detail-value">{[venue.address, venue.city, venue.postcode].filter(Boolean).join(', ')}</span>
                                </div>
                            )}
                            {venue?.phone && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Phone</span>
                                    <a href={`tel:${venue.phone}`} className="venue-detail-value venue-detail-link">{venue.phone}</a>
                                </div>
                            )}
                            {venue?.website && (
                                <div className="venue-detail-row">
                                    <span className="venue-detail-label">Website</span>
                                    <a href={venue.website} className="venue-detail-value venue-detail-link" target="_blank" rel="noopener noreferrer">
                                        {venue.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                    </a>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
                                <a href={mapsUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                    Directions
                                </a>
                                <Link href={`/live/venues/${gig.venueSlug}`} className="btn btn-outline">
                                    All shows at {venueName}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}