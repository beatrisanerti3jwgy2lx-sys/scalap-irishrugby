export interface TicketCategory {
  id: string
  name: string
  price: number
  currency: string
  available: boolean
}

export interface EventData {
  slug: string
  title: string
  subtitle: string
  competition: string
  date: string
  time: string
  dateISO: string
  venue: string
  venueAddress: string
  city: string
  categories: TicketCategory[]
}

const sixNationsCategories: TicketCategory[] = [
  { id: 'cat1', name: 'Category 1 - Premium', price: 375, currency: 'EUR', available: true },
  { id: 'cat2', name: 'Category 2 - Prime', price: 295, currency: 'EUR', available: true },
  { id: 'cat3', name: 'Category 3 - Standard', price: 195, currency: 'EUR', available: true },
  { id: 'cat4', name: 'Category 4 - Upper Tier', price: 125, currency: 'EUR', available: true },
]

export const events: EventData[] = [
  {
    slug: 'ireland-vs-england-six-nations',
    title: 'Ireland vs England',
    subtitle: 'Six Nations 2027',
    competition: 'Six Nations',
    date: 'Friday, 05 February 2027',
    time: '20:10',
    dateISO: '2027-02-05T20:10:00+00:00',
    venue: 'Aviva Stadium',
    venueAddress: '62 Lansdowne Road, Dublin 4, Ireland',
    city: 'Dublin',
    categories: sixNationsCategories,
  },
]

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug)
}
