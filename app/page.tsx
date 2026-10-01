import Link from 'next/link'
import { events } from '@/lib/data'

export default function HomePage() {
  const event = events[0]

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-abstract-bg" />
        <div className="hero-content">
          <div className="hero-shamrock">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="40" cy="22" rx="14" ry="18" fill="rgba(255,255,255,0.2)" />
              <ellipse cx="22" cy="40" rx="18" ry="14" fill="rgba(255,255,255,0.2)" />
              <ellipse cx="58" cy="40" rx="18" ry="14" fill="rgba(255,255,255,0.2)" />
              <rect x="37" y="44" width="6" height="26" rx="3" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
          <h1>IRELAND vs ENGLAND</h1>
          <p className="hero-subtitle">SIX NATIONS 2027</p>
          <div className="hero-details">
            <span>{event.date}</span>
            <span className="hero-dot">&bull;</span>
            <span>Kick Off {event.time}</span>
            <span className="hero-dot">&bull;</span>
            <span>{event.venue}, {event.city}</span>
          </div>
          <Link href={`/event/${event.slug}`} className="btn-primary hero-cta">
            Buy Tickets
          </Link>
        </div>
      </section>

      {/* Event Card */}
      <section className="event-listing-section">
        <div className="event-listing-inner">
          <h2>Available Matches</h2>
          <div className="event-listing-grid">
            <Link href={`/event/${event.slug}`} className="event-card">
              <div className="event-card-header">
                <span className="event-card-competition">{event.competition}</span>
                <h3 className="event-card-title">{event.title}</h3>
              </div>
              <div className="event-card-body">
                <div className="event-card-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{event.date} - {event.time}</span>
                </div>
                <div className="event-card-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{event.venue}, {event.city}</span>
                </div>
                <div className="event-card-price">
                  <span className="event-card-from">From <strong>&euro;{event.categories[event.categories.length - 1].price}</strong></span>
                  <span className="btn-tickets">Buy Tickets</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-banner">
        <div className="info-banner-inner">
          <div className="info-banner-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h3>Secure Purchase</h3>
            <p>All transactions are encrypted and secure</p>
          </div>
          <div className="info-banner-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h3>Instant Delivery</h3>
            <p>E-tickets delivered directly to your email</p>
          </div>
          <div className="info-banner-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3>Official Tickets</h3>
            <p>100% guaranteed authentic tickets</p>
          </div>
        </div>
      </section>
    </>
  )
}
