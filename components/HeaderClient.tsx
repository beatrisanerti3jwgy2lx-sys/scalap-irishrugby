'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'

export default function HeaderClient() {
  const { totalItems } = useCart()

  return (
    <header className="site-header">
      <div className="site-header__left">
        <button className="site-header__menu" aria-label="Menu">
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <rect width="22" height="2" rx="1" fill="white" />
            <rect y="7" width="22" height="2" rx="1" fill="white" />
            <rect y="14" width="22" height="2" rx="1" fill="white" />
          </svg>
        </button>
        <Link href="/" className="site-header__logo">
          <img src="/images/irfu-logo.png" alt="" className="site-header__shamrock" />
          <span className="site-header__brand">IRFU</span>
        </Link>
      </div>
      <div className="site-header__right">
        <Link href="/cart" className="site-header__icon-btn" aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {totalItems > 0 && <span className="site-header__badge">{totalItems}</span>}
        </Link>
        <button className="site-header__icon-btn" aria-label="Search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </header>
  )
}
