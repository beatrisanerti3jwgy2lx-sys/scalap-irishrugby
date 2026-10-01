import { events, getEventBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import EventClient from '@/components/EventClient'

export const dynamicParams = false

export async function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }))
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  return <EventClient event={event} />
}
