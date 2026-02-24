'use client'

import { useState } from 'react'

// Formspree endpoint — replace XXXXXXXX with your Formspree form ID
// Sign up free at https://formspree.io → New Form → copy the form ID
// e.g. https://formspree.io/f/xpwzgkdo  →  FORMSPREE_ID = 'xpwzgkdo'
const FORMSPREE_ID = 'mdalvjjd'
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`

const SUBJECTS = [
  'General enquiry',
  'Booking / live show',
  'Press / interview',
  'Licensing / sync',
  'Other',
]

export default function ContactForm() {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    subject: SUBJECTS[0],
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setFields({ name: '', email: '', subject: SUBJECTS[0], message: '' })
      } else {
        setStatus('error')
        setErrorMsg(data?.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success">
        <div className="contact-success-icon">✓</div>
        <p className="contact-success-title">Message sent</p>
        <p className="contact-success-body">
          Thanks for getting in touch. We'll get back to you as soon as we can.
        </p>
        <button
          className="btn btn-outline"
          style={{ marginTop: 24, fontSize: '0.75rem' }}
          onClick={() => setStatus('idle')}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>

      <div className="contact-form-row">
        <div className="contact-field">
          <label className="contact-label" htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            className="contact-input"
            placeholder="Your name"
            value={fields.name}
            onChange={handleChange}
            required
            disabled={status === 'sending'}
          />
        </div>
        <div className="contact-field">
          <label className="contact-label" htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            className="contact-input"
            placeholder="your@email.com"
            value={fields.email}
            onChange={handleChange}
            required
            disabled={status === 'sending'}
          />
        </div>
      </div>

      <div className="contact-field">
        <label className="contact-label" htmlFor="cf-subject">Subject</label>
        <select
          id="cf-subject"
          name="subject"
          className="contact-input contact-select"
          value={fields.subject}
          onChange={handleChange}
          disabled={status === 'sending'}
        >
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="contact-field">
        <label className="contact-label" htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          className="contact-input contact-textarea"
          placeholder="Your message..."
          rows={6}
          value={fields.message}
          onChange={handleChange}
          required
          disabled={status === 'sending'}
        />
      </div>

      {status === 'error' && (
        <p className="contact-error">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="btn"
        disabled={status === 'sending'}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>

    </form>
  )
}


