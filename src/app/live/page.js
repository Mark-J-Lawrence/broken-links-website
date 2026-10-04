import gigsData from '../../data/gigs.json'
import LiveClient from '../../components/LiveClient'

export const metadata = {
  title: 'Live',
  description: 'Broken Links live shows — upcoming dates, tickets and venue information.',
  alternates: {
    canonical: 'https://www.brokenlinksmusic.co.uk/live/',
  },
}

export default function LivePage() {
  return <LiveClient gigsData={gigsData} />
}
