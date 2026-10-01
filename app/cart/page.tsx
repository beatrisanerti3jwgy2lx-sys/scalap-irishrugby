'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

function formatTime(ms: number): string {
  if (ms <= 0) return '00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function CartPage() {
  const { cart, totalItems, totalPrice, removeItem, updateItemQuantity, maxTickets } = useCart()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!cart.deadline) {
      setTimeLeft(null)
      return
    }

    function tick() {
      const remaining = (cart.deadline ?? 0) - Date.now()
      setTimeLeft(Math.max(0, remaining))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [cart.deadline])

  const isUrgent = timeLeft !== null && timeLeft < 120000 && timeLeft > 0
  const isExpired = timeLeft !== null && timeLeft <= 0

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2>Your cart is empty</h2>
          <p>Browse available events and add tickets to your cart.</p>
          <Link href="/" className="btn-primary">
            View Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {timeLeft !== null && (
        <div className={`cart-timer ${isUrgent ? 'urgent' : ''}`}>
          <span className="cart-timer-text">
            {isExpired
              ? 'Your reservation time has expired. Please complete your purchase.'
              : 'Complete your purchase before time runs out. Tickets are in high demand.'}
          </span>
          <span className="cart-timer-clock">{formatTime(timeLeft)}</span>
        </div>
      )}

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={`${item.eventSlug}-${item.category.id}`} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.eventTitle}</h3>
              <p className="cart-item-details">
                {item.category.name} | {item.eventDate} - {item.eventTime} | {item.venue}, {item.city}
              </p>
            </div>
            <div className="cart-item-right">
              <div className="cart-item-qty">
                <label>Qty:</label>
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateItemQuantity(item.eventSlug, item.category.id, Number(e.target.value))
                  }
                >
                  {Array.from({ length: maxTickets }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <span className="cart-item-price">
                &euro;{(item.category.price * item.quantity).toLocaleString('en-IE')}
              </span>
              <button
                className="cart-item-remove"
                onClick={() => removeItem(item.eventSlug, item.category.id)}
                aria-label="Remove item"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Tickets</span>
          <span>{totalItems}</span>
        </div>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>&euro;{totalPrice.toLocaleString('en-IE')}</span>
        </div>
        <div className="cart-summary-row">
          <span>Service Fee</span>
          <span>&euro;0</span>
        </div>
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span>&euro;{totalPrice.toLocaleString('en-IE')}</span>
        </div>
        <div className="cart-actions">
          <Link href="/" className="btn-secondary">
            Continue Shopping
          </Link>
          <button className="btn-primary">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
