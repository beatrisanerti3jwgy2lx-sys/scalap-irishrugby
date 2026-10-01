export interface TicketCategory {
  id: string
  name: string
  price: number
  currency: string
  available: boolean
  seatmapImage: string
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

export const events: EventData[] = [
  {
    slug: 'ireland-vs-england-six-nations',
    title: 'Ireland vs England',
    subtitle: 'Six Nations 2027',
    competition: 'Six Nations',
    date: 'Fri 5th Feb',
    time: '20:10',
    dateISO: '2027-02-05T20:10:00+00:00',
    venue: 'Aviva Stadium',
    venueAddress: '62 Lansdowne Road, Dublin 4, Ireland',
    city: 'Dublin',
    categories: [
      {
        id: 'cat3',
        name: 'Category 3',
        price: 140.99,
        currency: 'EUR',
        available: false,
        seatmapImage: '/images/irfu-seatmap-cat3.png',
      },
      {
        id: 'cat2',
        name: 'Category 2',
        price: 69.99,
        currency: 'EUR',
        available: true,
        seatmapImage: '/images/irfu-seatmap-cat2.png',
      },
      {
        id: 'cat1',
        name: 'Category 1',
        price: 64.99,
        currency: 'EUR',
        available: true,
        seatmapImage: '/images/irfu-seatmap-cat1.png',
      },
    ],
  },
]

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug)
}
