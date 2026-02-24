'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ children, fallbackHref, className, style }) {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to the provided href if no history
      router.push(fallbackHref)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      style={{ ...style, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      {children}
    </button>
  )
}
