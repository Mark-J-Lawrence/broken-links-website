'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * TagCloud — collapsible tag browser for the News page.
 *
 * Collapsed (default): shows a single "Browse by tag ▾" button.
 * Expanded: shows all tags as clickable filter links.
 */
export default function TagCloud({ tags }) {
  const [open, setOpen] = useState(false)

  if (!tags || tags.length === 0) return null

  return (
    <div className="filter-bar">
      <div className="container">
        <div className="filter-bar-inner" style={{ flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>

          {/* Toggle button — always visible */}
          <button
            onClick={() => setOpen(v => !v)}
            className="filter-tab"
            aria-expanded={open}
            style={{
              cursor: 'pointer',
              background: 'none',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              color: open ? 'var(--amber)' : 'var(--text-muted)',
              borderColor: open ? 'var(--amber)' : 'var(--border)',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Browse by tag
            </span>
            <span style={{
              display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s',
              fontSize: '0.6rem',
              lineHeight: 1,
            }}>
              ▾
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-dim)',
              marginLeft: 2,
            }}>
              ({tags.length})
            </span>
          </button>

          {/* Tag list — only rendered when open */}
          {open && (
            <div
              className="filter-tabs"
              style={{ flexWrap: 'wrap', flex: '1 1 auto' }}
            >
              {tags.map(tag => (
                <Link
                  key={tag}
                  href={`/news/tag/${tag}`}
                  className="filter-tab"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}


