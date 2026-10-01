'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from './CartProvider'
import type { EventData, TicketCategory } from '@/lib/data'
import SeatMap from './SeatMap'

function QueueOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [queuePosition, setQueuePosition] = useState(Math.floor(Math.random() * 2000) + 3000)
  const [statusMessage, setStatusMessage] = useState('Connecting to ticket server...')

  useEffect(() => {
    const messages = [
      'Connecting to ticket server...',
      'Verifying your session...',
      'You are now in the queue...',
      'Allocating your position...',
      'Checking ticket availability...',
      'Almost there...',
    ]

    let step = 0
    const interval = setInterval(() => {
      step++
      const p = Math.min((step / 12) * 100, 100)
      setProgress(p)
      setQueuePosition((prev) => Math.max(1, prev - Math.floor(Math.random() * 800 + 200)))
      setStatusMessage(messages[Math.min(step - 1, messages.length - 1)])

      if (step >= 12) {
        clearInterval(interval)
        setTimeout(onComplete, 500)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="queue-overlay">
      <div className="queue-modal">
        <div className="queue-logo">
          {/* Shamrock icon */}
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="30" cy="18" rx="10" ry="12" fill="currentColor" />
            <ellipse cx="18" cy="30" rx="12" ry="10" fill="currentColor" />
            <ellipse cx="42" cy="30" rx="12" ry="10" fill="currentColor" />
            <rect x="28" y="32" width="4" height="18" rx="2" fill="currentColor" />
          </svg>
        </div>
        <h2>IRFU Rugby Tickets</h2>
        <h3>Official Ticket Queue</h3>
        <div className="queue-progress-container">
          <div className="queue-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="queue-status">{statusMessage}</p>
        <p className="queue-position">
          Queue position: <strong>{queuePosition.toLocaleString('en-IE')}</strong>
        </p>
        <p className="queue-note">
          Please do not refresh this page. Your position in the queue is reserved.
        </p>
      </div>
    </div>
  )
}

export default function EventClient({ event }: { event: EventData }) {
  const [showQueue, setShowQueue] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedMessage, setAddedMessage] = useState('')
  const { addItem, totalItems, maxTickets } = useCart()
  const router = useRouter()

  const remainingSlots = maxTickets - totalItems

  function handleAddToCart() {
    if (!selectedCategory) return
    try {
      addItem(event, selectedCategory, quantity)
      setAddedMessage(
        `${quantity} x ${selectedCategory.name} ticket${quantity > 1 ? 's' : ''} added to cart`
      )
      setTimeout(() => setAddedMessage(''), 4000)
      setSelectedCategory(null)
      setQuantity(1)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add to cart'
      setAddedMessage(message)
      setTimeout(() => setAddedMessage(''), 4000)
    }
  }

  if (showQueue) {
    return <QueueOverlay onComplete={() => setShowQueue(false)} />
  }

  return (
    <div className="event-detail">
      <div className="event-hero">
        <div className="event-hero-content">
          <span className="event-competition-badge">{event.competition}</span>
          <h1>{event.title}</h1>
          <div className="event-meta">
            <div className="event-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{event.date} - Kick Off {event.time}</span>
            </div>
            <div className="event-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="event-info-section">
          <h2>Match Information</h2>
          <div className="event-info-grid">
            <div className="info-card">
              <h3>Competition</h3>
              <p>{event.competition}</p>
              <p className="info-sub">{event.subtitle}</p>
            </div>
            <div className="info-card">
              <h3>Date & Time</h3>
              <p>{event.date}</p>
              <p className="info-sub">Kick-off: {event.time} GMT</p>
            </div>
            <div className="info-card">
              <h3>Venue</h3>
              <p>{event.venue}</p>
              <p className="info-sub">{event.venueAddress}</p>
            </div>
          </div>
        </div>

        <div className="event-booking-grid">
          <div className="event-booking-left">
            <SeatMap categories={event.categories} />
          </div>
          <div className="event-booking-right">

        <div className="ticket-section">
          <h2>Select Your Tickets</h2>
          {remainingSlots <= 0 ? (
            <div className="ticket-limit-warning">
              <p>You have reached the maximum of {maxTickets} tickets per order.</p>
              <button className="btn-primary" onClick={() => router.push('/cart')}>
                View Cart
              </button>
            </div>
          ) : (
            <>
              <p className="ticket-limit-note">
                Maximum {maxTickets} tickets per transaction ({remainingSlots} remaining). No booking or handling fees.
              </p>
              <div className="category-grid">
                {event.categories.map((cat, idx) => {
                  const colors = ['#169B62', '#1A7A4E', '#FF883E', '#4A90D9']
                  return (
                  <button
                    key={cat.id}
                    data-category-id={cat.id}
                    className={`category-card ${selectedCategory?.id === cat.id ? 'selected' : ''} ${!cat.available ? 'unavailable' : ''}`}
                    onClick={() => cat.available && setSelectedCategory(cat)}
                    disabled={!cat.available}
                  >
                    <span className="category-color-dot" style={{ background: colors[idx] || '#718096' }} />
                    <div className="category-name">{cat.name}</div>
                    <div className="category-price">&euro;{cat.price.toLocaleString('en-IE')}</div>
                    {cat.available && <div className="category-avail">Available</div>}
                    {!cat.available && <div className="category-sold">Sold Out</div>}
                  </button>
                  )
                })}
              </div>

              {selectedCategory && (
                <div className="ticket-selection">
                  <div className="ticket-selection-info">
                    <span className="selected-cat-name">{selectedCategory.name}</span>
                    <span className="selected-cat-price">&euro;{selectedCategory.price.toLocaleString('en-IE')} per ticket</span>
                  </div>
                  <div className="quantity-selector">
                    <label htmlFor="ticket-qty">Quantity:</label>
                    <select
                      id="ticket-qty"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {Array.from({ length: Math.min(6, remainingSlots) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ticket-total">
                    Total: <strong>&euro;{(selectedCategory.price * quantity).toLocaleString('en-IE')}</strong>
                  </div>
                  <button className="btn-primary btn-add-cart" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </div>
              )}
            </>
          )}

          {addedMessage && (
            <div className={`cart-message ${addedMessage.includes('Maximum') || addedMessage.includes('Failed') ? 'error' : 'success'}`}>
              {addedMessage}
            </div>
          )}
        </div>

          </div>
        </div>
      </div>
    </div>
  )
}
