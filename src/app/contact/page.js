import PageTitle from '../../components/PageTitle'
import ContactForm from '../../components/ContactForm'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Broken Links — booking, press, or general enquiries.',
  alternates: {
    canonical: 'https://www.brokenlinksmusic.co.uk/contact/',
  },
}

const SOCIAL_LINKS = [
  { label: 'Facebook',  href: 'http://www.facebook.com/brokenlinks' },
  { label: 'Instagram', href: 'https://www.instagram.com/brokenlinksmusic' },
  { label: 'Twitter/X', href: 'http://www.twitter.com/broken_links' },
  { label: 'YouTube',   href: 'https://www.youtube.com/user/brokenlinksmusic/' },
  { label: 'Bandcamp',  href: 'https://brokenlinks.bandcamp.com' },
  { label: 'Spotify',   href: 'https://open.spotify.com/artist/0VBx7ymL8y6CI3TgOFFhTz' },
]

export default function ContactPage() {
  return (
    <>
      <section className="page-section">
        <div className="container">
          <PageTitle
            label="Get in Touch"
            title="Contact"
            subtitle="Booking enquiries, press, or just want to say hello?"
          />
        </div>

        <div className="container" style={{ maxWidth: 720, marginTop: 70, }}>

          <div className="contact-card">
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 2, background: 'linear-gradient(90deg, var(--amber), transparent)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 80, background: 'linear-gradient(to bottom, var(--amber), transparent)' }} />

            {/* Contact form */}
            <div style={{ marginBottom: 40 }}>
              <p className="contact-section-label" style={{ marginBottom: 20 }}>Send a message</p>
              <ContactForm />
            </div>

            <div className="contact-divider" />

            {/* Social links */}
            <div style={{ marginBottom: 40 }}>
              <p className="contact-section-label">Social</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: '0.7rem', padding: '8px 16px' }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-divider" />

            {/* Booking note */}
            <div>
              <p className="contact-section-label">Booking & Press</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                For booking enquiries, press requests, or interview opportunities,
                use the form above and we'll get back to you as soon as possible.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  )
}


