/**
 * PageTitle — reusable industrial-style page header
 * Used at the top of every static page (About, Music, Live, etc.)
 *
 * Props:
 *   label      — small eyebrow text (e.g. "The Band")
 *   title      — main heading
 *   subtitle   — optional paragraph below the title
 *   accent     — optional accent word rendered in amber (replaces last word if true, or pass a string)
 */
export default function PageTitle({ label, title, subtitle, children }) {
  return (
    <div className="page-title-wrap">
      {label && <p className="section-label">{label}</p>}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      {children}
    </div>
  )
}

