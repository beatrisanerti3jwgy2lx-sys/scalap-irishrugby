'use client'

import { useState, useRef } from 'react'
import type { TicketCategory } from '@/lib/data'

interface SeatMapProps {
  categories: TicketCategory[]
}

const CATEGORY_COLORS = [
  '#169B62', // Cat 1 - Irish green
  '#1A7A4E', // Cat 2 - darker green
  '#FF883E', // Cat 3 - Irish orange
  '#4A90D9', // Cat 4 - blue
]

function getColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}

interface Section {
  id: string
  catIndex: number
  label: string
  d: string
}

function buildSections(categories: TicketCategory[]): Section[] {
  const sections: Section[] = []
  const count = categories.length

  // Aviva Stadium: horseshoe-shaped, open at south end
  // West Stand (left side) - premium sideline
  sections.push({
    id: 'w-upper', catIndex: 0, label: 'West Stand Upper',
    d: 'M 80,80 Q 75,65 85,50 L 85,340 Q 75,325 80,310 L 110,305 Q 105,295 105,285 L 105,105 Q 105,95 110,85 Z',
  })
  sections.push({
    id: 'w-lower', catIndex: Math.min(1, count - 1), label: 'West Stand Lower',
    d: 'M 110,85 Q 105,95 105,105 L 105,285 Q 105,295 110,305 L 140,300 Q 138,292 138,280 L 138,110 Q 138,98 140,90 Z',
  })
  // East Stand (right side)
  sections.push({
    id: 'e-upper', catIndex: Math.min(1, count - 1), label: 'East Stand Upper',
    d: 'M 620,80 Q 625,65 615,50 L 615,340 Q 625,325 620,310 L 590,305 Q 595,295 595,285 L 595,105 Q 595,95 590,85 Z',
  })
  sections.push({
    id: 'e-lower', catIndex: Math.min(2, count - 1), label: 'East Stand Lower',
    d: 'M 590,85 Q 595,95 595,105 L 595,285 Q 595,295 590,305 L 560,300 Q 562,292 562,280 L 562,110 Q 562,98 560,90 Z',
  })
  // North Stand (top, curved)
  sections.push({
    id: 'n-upper', catIndex: Math.min(2, count - 1), label: 'North Stand Upper',
    d: 'M 85,50 Q 170,10 350,5 Q 530,10 615,50 L 590,85 Q 520,50 350,46 Q 180,50 110,85 Z',
  })
  sections.push({
    id: 'n-lower', catIndex: Math.min(3, count - 1), label: 'North Stand Lower',
    d: 'M 110,85 Q 180,50 350,46 Q 520,50 590,85 L 560,90 Q 500,62 350,58 Q 200,62 140,90 Z',
  })
  // South Stand (bottom, horseshoe open - smaller sections)
  sections.push({
    id: 's-west', catIndex: Math.min(3, count - 1), label: 'South Stand West',
    d: 'M 85,340 Q 120,370 200,380 L 200,360 Q 130,352 110,305 L 80,310 Z',
  })
  sections.push({
    id: 's-east', catIndex: Math.min(3, count - 1), label: 'South Stand East',
    d: 'M 615,340 Q 580,370 500,380 L 500,360 Q 570,352 590,305 L 620,310 Z',
  })

  return sections
}

export default function SeatMap({ categories }: SeatMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; cat: string; price: string } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const sections = buildSections(categories)

  function getCatInfo(catIndex: number) {
    const cat = categories[catIndex]
    if (!cat) return { name: 'Unknown', price: '--' }
    return { name: cat.name, price: `€${cat.price}` }
  }

  function handleMouseEnter(section: Section, e: React.MouseEvent) {
    setHovered(section.id)
    const info = getCatInfo(section.catIndex)
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 10,
        label: section.label,
        cat: info.name,
        price: info.price,
      })
    }
  }

  function handleMouseLeave() {
    setHovered(null)
    setTooltip(null)
  }

  function handleClick(catIndex: number) {
    const cat = categories[catIndex]
    if (!cat) return
    const el = document.querySelector(`[data-category-id="${cat.id}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('seatmap-highlight')
      setTimeout(() => el.classList.remove('seatmap-highlight'), 2000)
    }
  }

  const legend = categories.map((cat, i) => ({
    id: cat.id,
    name: cat.name,
    color: getColor(i),
    price: `€${cat.price}`,
    index: i,
  }))

  return (
    <div className="seatmap-container">
      <h2 className="seatmap-title">Aviva Stadium</h2>
      <div className="seatmap-wrapper">
        <svg
          ref={svgRef}
          viewBox="0 0 700 400"
          xmlns="http://www.w3.org/2000/svg"
          className="seatmap-svg"
        >
          {/* Outer oval boundary */}
          <ellipse cx="350" cy="195" rx="290" ry="195" fill="#0a0a0a" stroke="#333" strokeWidth="2" />

          {/* Sections */}
          {sections.map((section) => (
            <path
              key={section.id}
              d={section.d}
              fill={getColor(section.catIndex)}
              fillOpacity={hovered === section.id ? 0.95 : 0.75}
              stroke={hovered === section.id ? '#ffffff' : 'rgba(255,255,255,0.3)'}
              strokeWidth={hovered === section.id ? 2 : 0.5}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, stroke-width 0.2s' }}
              onMouseEnter={(e) => handleMouseEnter(section, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(section.catIndex)}
            />
          ))}

          {/* Pitch - rugby field */}
          <rect x="155" y="95" width="390" height="200" rx="8" fill="#1B4332" />
          {/* Centre line */}
          <line x1="350" y1="95" x2="350" y2="295" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          {/* 10m lines */}
          <line x1="305" y1="95" x2="305" y2="295" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4" />
          <line x1="395" y1="95" x2="395" y2="295" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4" />
          {/* 22m lines */}
          <line x1="244" y1="95" x2="244" y2="295" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4" />
          <line x1="456" y1="95" x2="456" y2="295" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4" />
          {/* In-goal areas */}
          <rect x="155" y="95" width="15" height="200" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="530" y="95" width="15" height="200" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          {/* Try lines */}
          <line x1="170" y1="95" x2="170" y2="295" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <line x1="530" y1="95" x2="530" y2="295" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

          {/* Stand labels */}
          <text x="350" y="-2" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700" letterSpacing="2">NORTH STAND</text>
          <text x="350" y="398" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700" letterSpacing="2">SOUTH END</text>
          <text x="55" y="200" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700" letterSpacing="2" transform="rotate(-90,55,200)">WEST STAND</text>
          <text x="645" y="200" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700" letterSpacing="2" transform="rotate(90,645,200)">EAST STAND</text>

          {/* Capacity label */}
          <text x="350" y="200" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="14" fontWeight="900" letterSpacing="4">51,700</text>
        </svg>

        {tooltip && (
          <div
            className="seatmap-tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <div className="seatmap-tooltip__label">{tooltip.label}</div>
            <div className="seatmap-tooltip__cat">{tooltip.cat}</div>
            <div className="seatmap-tooltip__price">{tooltip.price}</div>
          </div>
        )}
      </div>

      <div className="seatmap-legend">
        {legend.map((item) => (
          <button
            key={item.id}
            className="seatmap-legend__item"
            onClick={() => handleClick(item.index)}
          >
            <span className="seatmap-legend__color" style={{ background: item.color }} />
            <span className="seatmap-legend__name">{item.name}</span>
            <span className="seatmap-legend__price">{item.price}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
