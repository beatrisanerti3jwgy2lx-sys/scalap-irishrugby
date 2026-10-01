'use client'

import { createContext, useContext, useSyncExternalStore, useCallback } from 'react'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  MAX_TICKETS,
  type CartState,
} from '@/lib/cart-store'
import type { EventData, TicketCategory } from '@/lib/data'

interface CartContextValue {
  cart: CartState
  totalItems: number
  totalPrice: number
  addItem: (event: EventData, category: TicketCategory, quantity: number) => void
  removeItem: (eventSlug: string, categoryId: string) => void
  updateItemQuantity: (eventSlug: string, categoryId: string, quantity: number) => void
  clear: () => void
  maxTickets: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addItem = useCallback(
    (event: EventData, category: TicketCategory, quantity: number) => {
      addToCart(event, category, quantity)
    },
    []
  )

  const removeItem = useCallback((eventSlug: string, categoryId: string) => {
    removeFromCart(eventSlug, categoryId)
  }, [])

  const updateItemQuantity = useCallback(
    (eventSlug: string, categoryId: string, quantity: number) => {
      updateQuantity(eventSlug, categoryId, quantity)
    },
    []
  )

  const clear = useCallback(() => {
    clearCart()
  }, [])

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.category.price * item.quantity,
    0
  )

  const value: CartContextValue = {
    cart,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
    maxTickets: MAX_TICKETS,
  }

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
