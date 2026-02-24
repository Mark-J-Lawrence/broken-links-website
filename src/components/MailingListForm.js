'use client'

// Mailchimp embedded form URL
const MAILCHIMP_ACTION = 'https://live.us2.list-manage.com/subscribe/post?u=b2ed6c2e33f82dc5e84b241ae&id=ba36deac56'

export default function MailingListForm() {
  return (
    <form
      action={MAILCHIMP_ACTION}
      method="post"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
    >
      <input
        type="email"
        name="EMAIL"
        placeholder="your@email.com"
        aria-label="Email address"
        required
        className="email-input"
      />
      {/* Mailchimp anti-bot honeypot — must stay hidden */}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name="b_b2ed6c2e33f82dc5e84b241ae_ba36deac56" tabIndex="-1" defaultValue="" readOnly />
      </div>
      <button type="submit" className="btn btn-primary">
        Subscribe
      </button>
    </form>
  )
}


