'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/event/ireland-vs-england-six-nations')
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1D4F38' }}>
      <p style={{ color: 'white', fontFamily: 'Inter, sans-serif' }}>Redirecting...</p>
    </div>
  )
}
