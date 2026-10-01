'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * PageTransition — only animates when the user explicitly navigates via a
 * header nav link. Header links set a 'nav-intent' flag in sessionStorage
 * before the route changes; we check and clear it here. Any other pathname
 * change (router.replace inside modals, sub-path URL syncing, etc.) is
 * ignored.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname()
  const ref = useRef(null)

  useEffect(() => {
    const intent = sessionStorage.getItem('nav-intent')
    if (!intent) return

    sessionStorage.removeItem('nav-intent')
    window.scrollTo(0, 0)

    const el = ref.current
    if (!el) return
    el.classList.remove('page-enter')
    void el.offsetWidth
    el.classList.add('page-enter')
  }, [pathname])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}
