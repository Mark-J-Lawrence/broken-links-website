import { redirect } from 'next/navigation'

// Redirect /blog → /news (permanent, handles old WordPress URLs)
export default function BlogRedirect() {
  redirect('/news')
}

export const metadata = {
  title: 'Redirecting to News…',
}


