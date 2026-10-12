import { useState, useEffect, useRef } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { clock } from './clock.js'

const SCENES = [
  { t: 0, kicker: 'Jakarta tidak pernah berhenti bergerak', title: 'Setiap perjalanan adalah kesempatan' },
  { t: 3.5, kicker: 'Jangkauan strategis di Jabodetabek', title: '9 lokasi premium' },
  { t: 6.5, kicker: 'Dari desain hingga pemasangan', title: 'Satu mitra. Tanpa repot.' },
  { t: 9.5, kicker: 'Dipercaya brand terkemuka sejak 2014', title: 'Pesan Anda. Keahlian kami.' },
  { t: 12.5, kicker: 'Selalu aktif. Selalu terlihat.', title: 'Billboard & LED premium' },
]

export default function HeroOverlay({ brand }) {
  const [scene, setScene] = useState(0)
  const frame = useRef()

  useEffect(() => {
    const tick = () => {
      const idx = SCENES.findIndex((s, i) => {
        const next = SCENES[i + 1]
        return clock.t >= s.t && (!next || clock.t < next.t)
      })
      if (idx !== -1 && idx !== scene) setScene(idx)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [scene])

  const current = SCENES[scene]
  if (!current) return null

  return (
    <div className="hero-overlay">
      <div className="hero-content" key={scene}>
        <p className="hero-kicker">{current.kicker}</p>
        <h1 className="hero-title">
          {current.title.split(' ').map((word, i) => (
            <span key={i} className="hero-word" style={{ animationDelay: `${i * 0.08}s` }}>
              {word}{' '}
            </span>
          ))}
        </h1>
      </div>
      <div className="scroll-indicator">
        <span>Scroll</span>
        <CaretDown size={24} weight="bold" />
      </div>
    </div>
  )
}
