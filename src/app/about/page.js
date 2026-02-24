import PageTitle from '../../components/PageTitle'
import { imgSrc } from '../../lib/basePath'

export const metadata = {
  title: 'About',
  description: 'Broken Links — alternative rock band from Eastleigh, Hampshire. Blending electronic, rock, and pop with cinematic intensity. Biography, history and band members.',
  alternates: {
    canonical: 'https://www.brokenlinksmusic.co.uk/about/',
  },
}

const MEMBERS = [
  {
    name: 'Mark Lawrence',
    role: 'Vocals / Guitar',
    bio: 'Founding member, primary songwriter and producer. Responsible for the band\'s signature sound and lyrical direction.',
    image: '/images/uploads/2014/04/mark-shout-graveyeard.jpg',
  },
  {
    name: 'Lewis Betteridge',
    role: 'Bass',
    bio: 'Provides the grimy, driving low end that underpins the Broken Links sound. His bass lines form the backbone of the band\'s compositions — huge, fluid and relentless.',
    image: '/images/uploads/2014/04/lewis-deer-bike-1.jpg',
  },
  {
    name: 'Phil Boulter',
    role: 'Drums',
    bio: 'The mechanical engine of the band. Phil\'s drumming locks into the electronic textures to create the dense, driving rhythms that define the live experience.',
    image: '/images/uploads/2014/04/phil-subway-1.jpg',
  },
]

const TIMELINE = [
  { year: '2008', event: 'Band formed in Eastleigh, Hampshire. First gig at The Joiners, Southampton.' },
  { year: '2009', event: 'First EP "Resisting Movement and the Almost Advisory" released. Extensive UK gigging begins.' },
  { year: '2010', event: '"The Fine Line Between Choice/Decay" EP released. European shows including Germany and Berlin.' },
  { year: '2011', event: '"Prototypes/Cause+Effect" EP released. Supported The Boxer Rebellion, InMe and The Xcerts.' },
  { year: '2012', event: 'Debut album "Disasters: Ways to Leave a Scene" released. UK and European touring.' },
  { year: '2015', event: '"Divide/Restore" — second album released.' },
  { year: '2021', event: '"Conflict::States" released — confrontational, wired, unfiltered. 12 tracks of goth-electro fury.' },
  { year: '2022', event: '"Konflix::Statez" released. Continued live activity.' },
  { year: '2025', event: 'New material in progress. Heavier. Faster. More volatile.' },
]

const PRESS_QUOTES = [
  {
    quote: 'Broken Links are one of a kind, a desperate, post-apocalyptic fusion of music from another age, electro-rock pulsing behind melancholic vocals and haunting lyrics with frenetic psychological elements.',
    source: 'Hit the Floor',
  },
  {
    quote: 'This is a stunning debut album which gets under your skin, fusing rock and electronic genres to produce something slightly familiar, but at the same time unique. It is an album which draws you in, and does not let go.',
    source: 'Rock Regeneration',
  },
  {
    quote: 'Wow. This has to be one of the best indie releases I\'ve ever heard! Delicate guitar harmonies mix with emo vocals and dark melodies to produce a melancholic, yet powerful and captivating sound.',
    source: 'Battle Helm',
  },
]


export default function AboutPage() {
  const bandPhoto = imgSrc('/images/uploads/2021/02/Split-4000x2250-1-1024x576.jpg')

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="The Band"
            title="About"
            subtitle="Alternative rock from the UK. Raw sound, honest noise. Est. 2008."
          />
        </div>
      </section>

      {/* ── Biography ─────────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="about-grid">
            {/* Text column */}
            <div className="about-text">
              <div className="section-header reveal">
                <div>
                  <p className="section-label">Biography</p>
                  <h2 className="section-title">The Story</h2>
                </div>
              </div>

              <div className="prose reveal">
                <p>
                  <strong>BROKEN LINKS</strong> started in 2008. They are still here.
                </p>
                <p>
                  Mark Lawrence (vocals/guitars), Lewis Betteridge (bass), and Phil Boulter (drums)
                  create dark, melodic alternative rock driven by electronics, tension, and weight.
                  Brooding guitars lock into mechanical rhythms. Hooks cut through distortion.
                  The atmosphere is dense. The intent is direct.
                </p>
                <p>
                  Three EPs. Three albums. One remix record. Extensive UK and European touring.
                  Independent. Self-built. Always moving forward.
                </p>
                <p>
                  <em>Conflict::States</em> marked a turning point — confrontational, wired, and unfiltered.
                  A collision of goth-electro textures and guitar-driven force aimed squarely at modern disillusionment.
                </p>
                <p>
                  New material pushes into the raw physicality of 90s rave and acid — distorted pulse,
                  relentless momentum, guitars grinding against breakbeats. It's heavier. Faster. More volatile.
                  Built for dark rooms and high volume.
                </p>
                <p>
                  No nostalgia. No waiting for permission. No interest in fading quietly.
                </p>
                <p>
                  <strong>BROKEN LINKS endure. And they're louder than ever.</strong>
                </p>
              </div>

            </div>

            {/* Image column */}
            <div className="about-image reveal-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bandPhoto}
                alt="Broken Links band photo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header reveal">
            <div>
              <p className="section-label">History</p>
              <h2 className="section-title">Timeline</h2>
            </div>
          </div>

          <div className="timeline">
            {TIMELINE.map(({ year, event }, i) => (
              <div key={year} className={`timeline-item reveal delay-${(i % 6) + 1}`}>
                <div className="timeline-year">{year}</div>
                <div className="timeline-connector">
                  <div className="timeline-dot" />
                  <div className="timeline-line" />
                </div>
                <div className="timeline-event">{event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Band Members ──────────────────────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="section-header reveal">
            <div>
              <p className="section-label">The People</p>
              <h2 className="section-title">Band Members</h2>
            </div>
          </div>

          <div className="grid-3">
            {MEMBERS.map((member, i) => (
              <div key={member.name} className={`member-card reveal delay-${i + 1}`}>
                <div className="member-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc(member.image)}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press Quotes ──────────────────────────────────────── */}
      <section className="page-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header reveal">
            <div>
              <p className="section-label">Press</p>
              <h2 className="section-title">What They Say</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {PRESS_QUOTES.map((item, i) => (
              <div key={i} className={`quote-block reveal delay-${i + 1}`}>
                <blockquote className="pull-quote">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <cite className="pull-quote-source">— {item.source}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

