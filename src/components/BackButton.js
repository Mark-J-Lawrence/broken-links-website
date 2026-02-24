'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ fallbackHref = '/', children = '← Back' }) {
  const router = useRouter()

  const handleBack = (e) => {
    e.preventDefault()
    // Always use router.back() - Next.js handles the fallback internally
    router.back()
  }

  return (
    <button
      onClick={handleBack}
      className="back-link"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        marginBottom: 0,
      }}
    >
      {children}
    </button>
  )
}


