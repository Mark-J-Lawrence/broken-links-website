'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * PageTransition — wraps page content with a fade-in + slight upward slide
 * on every route change. Uses a key derived from the pathname so React
 * remounts the wrapper (and re-runs the animation) on each navigation.
 * Also scrolls to top on route change.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname()
  const ref = useRef(null)

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)
    
    const el = ref.current
    if (!el) return
    // Remove then re-add the class to restart the animation
    el.classList.remove('page-enter')
    // Force reflow so the browser registers the removal
    void el.offsetWidth
    el.classList.add('page-enter')
  }, [pathname])

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  )
}


