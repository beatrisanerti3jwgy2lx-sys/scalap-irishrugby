import type { TicketCategory, EventData } from './data'

export interface CartItem {
  eventSlug: string
  eventTitle: string
  eventDate: string
  eventTime: string
  venue: string
  city: string
  category: TicketCategory
  quantity: number
}

export interface CartState {
  items: CartItem[]
  deadline: number | null
}

const CART_KEY = 'irfu-cart'
const DEADLINE_KEY = 'irfu-cart-deadline'
const MAX_TICKETS = 4
const TIMER_DURATION = 10 * 60 * 1000 // 10 minutes

type Listener = () => void

let cachedCartRaw: string | null = null
let cachedDeadlineRaw: string | null = null
let cachedState: CartState = { items: [], deadline: null }
const SERVER_STATE: CartState = { items: [], deadline: null }

function refreshCache() {
  if (typeof window === 'undefined') return
  try {
    const cartRaw = localStorage.getItem(CART_KEY)
    const deadlineRaw = localStorage.getItem(DEADLINE_KEY)
    if (cartRaw !== cachedCartRaw || deadlineRaw !== cachedDeadlineRaw) {
      cachedCartRaw = cartRaw
      cachedDeadlineRaw = deadlineRaw
      const items: CartItem[] = cartRaw ? JSON.parse(cartRaw) : []
      const deadline: number | null = deadlineRaw ? Number(deadlineRaw) : null
      cachedState = { items, deadline }
    }
  } catch {
    cachedState = { items: [], deadline: null }
    cachedCartRaw = null
    cachedDeadlineRaw = null
  }
}

let listeners: Listener[] = []

function getCartFromStorage(): CartState {
  if (typeof window === 'undefined') {
    return { items: [], deadline: null }
  }
  try {
    const itemsRaw = localStorage.getItem(CART_KEY)
    const deadlineRaw = localStorage.getItem(DEADLINE_KEY)
    const items: CartItem[] = itemsRaw ? JSON.parse(itemsRaw) : []
    const deadline: number | null = deadlineRaw ? Number(deadlineRaw) : null
    return { items, deadline }
  } catch {
    return { items: [], deadline: null }
  }
}

function saveCart(state: CartState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state.items))
    if (state.deadline) {
      localStorage.setItem(DEADLINE_KEY, String(state.deadline))
    } else {
      localStorage.removeItem(DEADLINE_KEY)
    }
  } catch {
    // storage unavailable
  }
}

function emitChange() {
  refreshCache()
  for (const listener of listeners) {
    listener()
  }
}

export function subscribe(listener: Listener): () => void {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function getSnapshot(): CartState {
  refreshCache()
  return cachedState
}

export function getServerSnapshot(): CartState {
  return SERVER_STATE
}

export function addToCart(event: EventData, category: TicketCategory, quantity: number) {
  const state = getCartFromStorage()
  const currentTotal = state.items.reduce((sum, item) => sum + item.quantity, 0)

  if (currentTotal + quantity > MAX_TICKETS) {
    throw new Error(`Maximum ${MAX_TICKETS} tickets allowed per order`)
  }

  const existingIndex = state.items.findIndex(
    (item) => item.eventSlug === event.slug && item.category.id === category.id
  )

  if (existingIndex >= 0) {
    const newQuantity = state.items[existingIndex].quantity + quantity
    if (currentTotal - state.items[existingIndex].quantity + newQuantity > MAX_TICKETS) {
      throw new Error(`Maximum ${MAX_TICKETS} tickets allowed per order`)
    }
    state.items[existingIndex].quantity = newQuantity
  } else {
    state.items.push({
      eventSlug: event.slug,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      venue: event.venue,
      city: event.city,
      category,
      quantity,
    })
  }

  if (!state.deadline) {
    state.deadline = Date.now() + TIMER_DURATION
  }

  saveCart(state)
  emitChange()
}

export function removeFromCart(eventSlug: string, categoryId: string) {
  const state = getCartFromStorage()
  state.items = state.items.filter(
    (item) => !(item.eventSlug === eventSlug && item.category.id === categoryId)
  )

  if (state.items.length === 0) {
    state.deadline = null
  }

  saveCart(state)
  emitChange()
}

export function clearCart() {
  const state: CartState = { items: [], deadline: null }
  saveCart(state)
  emitChange()
}

export function updateQuantity(eventSlug: string, categoryId: string, quantity: number) {
  const state = getCartFromStorage()
  const itemIndex = state.items.findIndex(
    (item) => item.eventSlug === eventSlug && item.category.id === categoryId
  )

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      state.items.splice(itemIndex, 1)
    } else {
      const otherTotal = state.items
        .filter((_, i) => i !== itemIndex)
        .reduce((sum, item) => sum + item.quantity, 0)
      if (otherTotal + quantity > MAX_TICKETS) {
        throw new Error(`Maximum ${MAX_TICKETS} tickets allowed per order`)
      }
      state.items[itemIndex].quantity = quantity
    }
  }

  if (state.items.length === 0) {
    state.deadline = null
  }

  saveCart(state)
  emitChange()
}

export { MAX_TICKETS, TIMER_DURATION }
