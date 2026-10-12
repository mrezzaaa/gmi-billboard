import { useState, useEffect, useRef } from 'react'
import { BRANDS, DURATION, SCENE_LEN } from './brands.js'
import { clock, clampT, range, easeOutCubic } from './clock.js'

const SCENES = [
  { name: 'Attention', t: 0 },
  { name: 'Reach', t: 3 },
  { name: 'Coverage', t: 6 },
  { name: 'Service', t: 9 },
  { name: 'Contact', t: 12 },
]

function Counter({ value, duration = 1.2 }) {
  const [count, setCount] = useState(0)
  const start = useRef(0)
  const frame = useRef(0)

  useEffect(() => {
    start.current = performance.now()
    const tick = () => {
      const elapsed = (performance.now() - start.current) / 1000
      const progress = Math.min(1, elapsed / duration)
      setCount(Math.floor(easeOutCubic(progress) * value))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [value, duration])

  return count
}

function Caption({ scene, brand }) {
  const copy = {
    0: {
      kicker: 'Jakarta never stops moving.',
      title: ['Every commute', 'is an impression.'],
      sub: `Millions pass your billboard daily. ${brand.name} riders already see you.`,
    },
    1: {
      kicker: 'Prime visibility across Jabodetabek.',
      title: ['9 strategic', 'zones covered.'],
      sub: 'Jakarta Selatan · Pusat · Timur · Utara · Barat · Depok · Bekasi · Bandung + Toll Roads',
    },
    2: {
      kicker: 'From concept to install, we handle it.',
      title: ['One partner.', 'Zero hassle.'],
      sub: 'In-house design · Production · Permits & tax · Maintenance · Consulting',
    },
    3: {
      kicker: "Built for Indonesia's top brands since 2014.",
      title: ['Your message.', 'Our craft.'],
      sub: 'Workshop in Jagakarsa · Expert installation crew · Trusted by Google, Microsoft, Nokia',
    },
    4: {
      kicker: `${brand.name} × GMI Billboard`,
      title: ['Always on.', 'Always seen.'],
      sub: 'Static & LED screens · High-traffic locations · Full permit & maintenance',
    },
  }

  const c = copy[scene]
  if (!c) return null

  return (
    <div className="caption">
      <p className="kicker">{c.kicker}</p>
      <h1 className="title">
        {c.title.map((line, i) => (
          <span key={i} className="line" style={{ animationDelay: `${i * 0.15}s` }}>
            {line.split(' ').map((word, j) => (
              <span key={j} className="word" style={{ animationDelay: `${(i * 2 + j) * 0.08}s` }}>
                {word}&nbsp;
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className="sub">{c.sub}</p>
    </div>
  )
}

function Stats({ scene }) {
  if (scene !== 3) return null

  const stats = [
    { label: 'Since', value: 2014, unit: '' },
    { label: 'Zones', value: 9, unit: '+' },
    { label: 'Services', value: 5, unit: '' },
    { label: 'Visibility', value: 24, unit: '/7' },
  ]

  return (
    <div className="stats">
      {stats.map((s, i) => (
        <div key={i} className="stat" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="stat-value">
            <Counter value={s.value} />
            {s.unit}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function CTA({ scene, brand }) {
  if (scene < 4) return null

  return (
    <div className="cta">
      <h2 className="cta-title">Ready to reach millions?</h2>
      <div className="cta-grid">
        <a href="tel:+628119522122" className="cta-btn">
          <span className="cta-icon">📞</span>
          <span>0811-9522-122</span>
        </a>
        <a href="https://gmibillboard.co.id" target="_blank" rel="noopener" className="cta-btn">
          <span className="cta-icon">🌐</span>
          <span>gmibillboard.co.id</span>
        </a>
        <a href="https://instagram.com/gmibillboard_jakarta" target="_blank" rel="noopener" className="cta-btn">
          <span className="cta-icon">📸</span>
          <span>@gmibillboard_jakarta</span>
        </a>
      </div>
      <p className="cta-footnote">
        Concept mockup. Brand names are trademarks of their respective owners.
      </p>
    </div>
  )
}

export default function Overlay({ brand, setBrand, reducedMotion }) {
  const [scene, setScene] = useState(reducedMotion ? 4 : 0)
  const [playing, setPlaying] = useState(!reducedMotion)
  const bar = useRef()
  const frame = useRef()

  useEffect(() => {
    if (reducedMotion) clock.t = DURATION
  }, [reducedMotion])

  useEffect(() => {
    const tick = () => {
      const idx = SCENES.findIndex((s, i) => {
        const next = SCENES[i + 1]
        return clock.t >= s.t && (!next || clock.t < next.t)
      })
      if (idx !== -1 && idx !== scene) setScene(idx)
      if (bar.current) bar.current.style.width = `${(clock.t / DURATION) * 100}%`
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [scene])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        setPlaying((p) => {
          clock.playing = !p
          if (!p && clock.t >= DURATION) clock.t = 0
          return !p
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const togglePlay = () => {
    setPlaying((p) => {
      clock.playing = !p
      if (!p && clock.t >= DURATION) clock.t = 0
      return !p
    })
  }

  const replay = () => {
    clock.t = 0
    clock.playing = true
    setPlaying(true)
    setScene(0)
  }

  const seek = (t) => {
    clock.t = clampT(t)
  }

  return (
    <div className="overlay">
      <div className="wipe" key={scene} />

      <header className="header">
        <div className="logo">
          <span className="logo-text">GMI BILLBOARD</span>
          <span className="logo-sub">Outdoor Media</span>
        </div>
        <div className="brand-toggle">
          {Object.values(BRANDS).map((b) => (
            <button
              key={b.id}
              onClick={() => setBrand(b)}
              className={`brand-btn ${brand.id === b.id ? 'active' : ''}`}
              aria-pressed={brand.id === b.id}
              style={{ '--brand-color': b.color }}
            >
              {b.wordmark}
            </button>
          ))}
        </div>
      </header>

      <div className="content" key={`${scene}-${brand.id}`}>
        <Caption scene={scene} brand={brand} />
      </div>

      <Stats scene={scene} />
      <CTA scene={scene} brand={brand} />

      <footer className="transport">
        <div className="progress-wrap">
          <div className="progress-track" onClick={(e) => seek((e.nativeEvent.offsetX / e.target.offsetWidth) * DURATION)}>
            <div className="progress-bar" ref={bar} />
            {SCENES.map((s) => (
              <button
                key={s.t}
                className="progress-mark"
                style={{ left: `${(s.t / DURATION) * 100}%` }}
                onClick={() => seek(s.t)}
                aria-label={`Jump to ${s.name}`}
              />
            ))}
          </div>
        </div>
        <div className="controls">
          <button className="play-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {clock.t >= DURATION ? '↻' : playing ? '❚❚' : '▶'}
          </button>
          <span className="timecode">
            {Math.floor(clock.t)}s / {DURATION}s
          </span>
        </div>
      </footer>
    </div>
  )
}
