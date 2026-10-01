'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from './CartProvider'
import type { EventData, TicketCategory } from '@/lib/data'

/* ---------- helpers ---------- */
function formatPrice(price: number): string {
  return '€' + price.toFixed(2).replace('.', ',')
}

/* ---------- Queue overlay ---------- */
function QueueOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [queuePosition, setQueuePosition] = useState(4200)
  const [statusMessage, setStatusMessage] = useState(
    'Connecting to ticket server...'
  )

  /* Set a random starting position only on the client to avoid hydration mismatch */
  useEffect(() => {
    setQueuePosition(Math.floor(Math.random() * 2000) + 3000)
  }, [])

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
      setQueuePosition((prev) =>
        Math.max(1, prev - Math.floor(Math.random() * 800 + 200))
      )
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
          <svg
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="30" cy="18" rx="10" ry="12" fill="currentColor" />
            <ellipse cx="18" cy="30" rx="12" ry="10" fill="currentColor" />
            <ellipse cx="42" cy="30" rx="12" ry="10" fill="currentColor" />
            <rect
              x="28"
              y="32"
              width="4"
              height="18"
              rx="2"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2>IRFU Rugby Tickets</h2>
        <h3>Official Ticket Queue</h3>
        <div className="queue-progress-container">
          <div
            className="queue-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="queue-status">{statusMessage}</p>
        <p className="queue-position">
          Queue position:{' '}
          <strong>{queuePosition.toLocaleString('en-IE')}</strong>
        </p>
        <p className="queue-note">
          Please do not refresh this page. Your position in the queue is
          reserved.
        </p>
      </div>
    </div>
  )
}

/* ---------- Hero field-line SVG ---------- */
function HeroFieldLines() {
  return (
    <svg
      className="match-hero__lines"
      viewBox="0 0 800 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMin slice"
    >
      {/* Outer rounded rect - top right */}
      <rect
        x="440"
        y="30"
        width="340"
        height="420"
        rx="40"
        stroke="#3DBB6E"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Inner rounded rect - top right */}
      <rect
        x="520"
        y="30"
        width="260"
        height="320"
        rx="35"
        stroke="#3DBB6E"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Vertical center line */}
      <line
        x1="440"
        y1="0"
        x2="440"
        y2="900"
        stroke="#3DBB6E"
        strokeWidth="2.5"
      />
      {/* Horizontal line at midpoint */}
      <line
        x1="440"
        y1="450"
        x2="800"
        y2="450"
        stroke="#3DBB6E"
        strokeWidth="2.5"
      />
      {/* Lower outer rounded rect */}
      <rect
        x="440"
        y="450"
        width="340"
        height="420"
        rx="40"
        stroke="#3DBB6E"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Lower inner rounded rect */}
      <rect
        x="520"
        y="550"
        width="260"
        height="320"
        rx="35"
        stroke="#3DBB6E"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  )
}

/* ---------- England Rose SVG ---------- */
function EnglandRose() {
  return (
    <svg
      viewBox="0 0 140 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="match-hero__england-logo"
    >
      {/* Outer petals */}
      <ellipse cx="70" cy="45" rx="22" ry="26" fill="#C41E3A" />
      <ellipse
        cx="45"
        cy="60"
        rx="22"
        ry="18"
        fill="#C41E3A"
        transform="rotate(-20 45 60)"
      />
      <ellipse
        cx="95"
        cy="60"
        rx="22"
        ry="18"
        fill="#C41E3A"
        transform="rotate(20 95 60)"
      />
      <ellipse cx="55" cy="78" rx="18" ry="16" fill="#D4294A" />
      <ellipse cx="85" cy="78" rx="18" ry="16" fill="#D4294A" />
      {/* Inner center */}
      <circle cx="70" cy="62" r="14" fill="#E8284B" />
      <circle cx="70" cy="62" r="8" fill="#F25C7A" />
      <circle cx="70" cy="62" r="4" fill="#E8284B" />
      {/* Leaves */}
      <path
        d="M60,92 Q45,105 35,115 Q50,112 60,100 Z"
        fill="#1D4F38"
        opacity="0.7"
      />
      <path
        d="M80,92 Q95,105 105,115 Q90,112 80,100 Z"
        fill="#1D4F38"
        opacity="0.7"
      />
      <path
        d="M65,95 Q55,115 50,125 Q60,118 68,102 Z"
        fill="#2E7A50"
        opacity="0.6"
      />
      <path
        d="M75,95 Q85,115 90,125 Q80,118 72,102 Z"
        fill="#2E7A50"
        opacity="0.6"
      />
      {/* Stem */}
      <line
        x1="70"
        y1="92"
        x2="70"
        y2="120"
        stroke="#1D4F38"
        strokeWidth="3"
      />
      {/* Text */}
      <text
        x="70"
        y="138"
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize="12"
        fontWeight="600"
        fontFamily="Inter, sans-serif"
      >
        England
      </text>
      <text
        x="70"
        y="152"
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize="12"
        fontWeight="600"
        fontFamily="Inter, sans-serif"
      >
        Rugby
      </text>
    </svg>
  )
}

/* ---------- Main component ---------- */
export default function EventClient({ event }: { event: EventData }) {
  const [showQueue, setShowQueue] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(
    () => event.categories.find((c) => c.id === 'cat2') ?? null
  )
  const [quantity, setQuantity] = useState(1)
  const [addedMessage, setAddedMessage] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const handleComplete = useCallback(() => setShowQueue(false), [])

  function handleCategoryChange(cat: TicketCategory) {
    if (!cat.available) return
    setSelectedCategory(cat)
  }

  function handleAddToCart(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedCategory) return
    try {
      addItem(event, selectedCategory, quantity)
      setAddedMessage(
        `${quantity} x ${selectedCategory.name} ticket${quantity > 1 ? 's' : ''} added to cart`
      )
      setTimeout(() => {
        setAddedMessage('')
        router.push('/cart')
      }, 1200)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to add to cart'
      setAddedMessage(message)
      setTimeout(() => setAddedMessage(''), 4000)
    }
  }

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1))
  }
  function increment() {
    setQuantity((q) => Math.min(6, q + 1))
  }

  if (showQueue) {
    return <QueueOverlay onComplete={handleComplete} />
  }

  return (
    <div className="event-page">
      {/* ========== HERO ========== */}
      <section className="match-hero">
        <HeroFieldLines />
        <div className="match-hero__content">
          <p className="match-hero__venue">Aviva Stadium</p>
          <p className="match-hero__datetime">
            {event.date} - {event.time}
          </p>
          <p className="match-hero__competition">Six Nations</p>

          <div className="match-hero__teams">
            <div className="match-hero__team">
              <img
                src="/images/irfu-logo.png"
                alt="IRFU"
                className="match-hero__irfu-logo"
              />
              <span className="match-hero__team-name">Ireland</span>
            </div>
            <div className="match-hero__team">
              <EnglandRose />
              <span className="match-hero__team-name">England</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TABS BAR ========== */}
      <div className="match-tabs">
        <div className="match-tabs__pills">
          <button className="match-tabs__add" aria-label="Add">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="9" y1="2" x2="9" y2="16" />
              <line x1="2" y1="9" x2="16" y2="9" />
            </svg>
          </button>
          <button className="match-tabs__pill match-tabs__pill--active">
            Match Day
          </button>
          <button className="match-tabs__pill">Related</button>
        </div>
        <div className="match-tabs__sub">
          <button className="match-tabs__sub-link match-tabs__sub-link--active">
            Overview
          </button>
          <button className="match-tabs__sub-link">As It Happened</button>
        </div>
      </div>

      {/* ========== TICKETS SECTION ========== */}
      <section className="match-content">
        <form
          className="mt"
          onSubmit={handleAddToCart}
        >
          <h2 className="mt__heading">Tickets</h2>

          <ul className="mt__list">
            {event.categories.map((cat) => {
              const isSelected = selectedCategory?.id === cat.id
              const isUnavailable = !cat.available
              let className = 'mt__option'
              if (isSelected) className += ' is-selected'
              if (isUnavailable) className += ' is-unavailable'

              return (
                <li key={cat.id}>
                  <label className={className}>
                    <input
                      type="radio"
                      name="id"
                      checked={isSelected}
                      disabled={isUnavailable}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <span className="mt__mark" />
                    <span className="mt__thumb">
                      <img src={cat.seatmapImage} alt={cat.name} />
                    </span>
                    <span className="mt__name">{cat.name}</span>
                    {isUnavailable ? (
                      <span className="mt__row-price">Sold out</span>
                    ) : (
                      <span className="mt__row-price">{formatPrice(cat.price)}</span>
                    )}
                  </label>
                </li>
              )
            })}
          </ul>

          {selectedCategory && (
            <>
              <div className="mt__line">
                <span className="mt__line-label">Price</span>
                <span className="mt__price-value">
                  {formatPrice(selectedCategory.price)}
                </span>
              </div>

              <div className="mt__line">
                <span className="mt__line-label">Quantity</span>
                <div className="mt__stepper">
                  <button type="button" onClick={decrement} aria-label="Decrease">
                    &#8722;
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={6}
                    readOnly
                  />
                  <button type="button" onClick={increment} aria-label="Increase">
                    +
                  </button>
                </div>
              </div>

              <button type="submit" className="mt__buy">
                Add to cart
              </button>
            </>
          )}

          {addedMessage && (
            <div
              className={`mt__message ${addedMessage.includes('Maximum') || addedMessage.includes('Failed') ? 'mt__message--error' : 'mt__message--success'}`}
            >
              {addedMessage}
            </div>
          )}
        </form>

        {/* ========== MATCH DETAILS ========== */}
        <div className="match-details">
          <button
            className={`match-details__toggle ${detailsOpen ? 'is-open' : ''}`}
            onClick={() => setDetailsOpen(!detailsOpen)}
          >
            <span>Match Details</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="2,4 7,9 12,4" />
            </svg>
          </button>
          {detailsOpen && (
            <div className="match-details__body">
              <div className="match-details__row">
                <span className="match-details__label">Kick Off</span>
                <span className="match-details__value">{event.time}</span>
              </div>
              <div className="match-details__row">
                <span className="match-details__label">Competition</span>
                <span className="match-details__value">
                  {event.competition}
                </span>
              </div>
              <div className="match-details__row">
                <span className="match-details__label">Venue</span>
                <span className="match-details__value">
                  {event.venue}, {event.city}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========== SPONSORS ========== */}
        <div className="match-sponsors">
          <p className="match-sponsors__label">Official Sponsors</p>
          <div className="match-sponsors__grid">
            {[
              'Vodafone',
              'Canterbury',
              'Guinness',
              'Aviva',
              'Bank of Ireland',
              'Opel',
              'Energia',
              'AON',
              'PwC',
              'Aldi',
              'Lucozade Sport',
              'Gilbert',
              'Dove Men+Care',
              'Sport Ireland',
              'Eden Park',
              'Evoke',
              'DHL',
              'AG1',
            ].map((name) => (
              <span key={name} className="match-sponsors__item">
                {name}
              </span>
            ))}
          </div>
          <p className="match-sponsors__label" style={{ marginTop: 24 }}>
            Official Charity
          </p>
          <div className="match-sponsors__grid">
            <span className="match-sponsors__item">
              Shoulder to Shoulder
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
