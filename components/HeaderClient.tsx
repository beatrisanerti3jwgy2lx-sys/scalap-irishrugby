'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'
import { useState } from 'react'

export default function HeaderClient() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Top announcement bar */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <span>Official IRFU Rugby Tickets</span>
          <span className="top-bar-sep">|</span>
          <span>Secure Checkout</span>
          <span className="top-bar-sep">|</span>
          <span>Six Nations 2027</span>
        </div>
      </div>

      {/* Irish tricolour border */}
      <div className="irish-border" />

      {/* Main Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="header-logo">
            {/* IRFU Logo */}
            <div className="irfu-logo-container">
              <svg viewBox="0 0 50 50" className="irfu-shamrock-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="25" cy="14" rx="8" ry="10" fill="currentColor" />
                <ellipse cx="14" cy="25" rx="10" ry="8" fill="currentColor" />
                <ellipse cx="36" cy="25" rx="10" ry="8" fill="currentColor" />
                <rect x="23" y="28" width="4" height="16" rx="2" fill="currentColor" />
              </svg>
              <div className="irfu-logo-text">
                <span className="irfu-brand">IRFU</span>
                <span className="irfu-sub">RUGBY</span>
              </div>
            </div>
          </Link>

          <button
            className="header-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/event/ireland-vs-england-six-nations" onClick={() => setMenuOpen(false)}>Tickets</Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>My Cart</Link>
            <Link href="/cart" className="header-cart" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cart-icon">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
