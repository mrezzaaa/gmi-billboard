import { useState, useEffect, lazy, Suspense, memo } from 'react'
import { BRANDS } from './brands.js'
import { clock } from './clock.js'
import ErrorBoundary from './ErrorBoundary.jsx'
import Loader from './Loader.jsx'

// Lazy load heavy 3D components
const HeroCanvas = lazy(() => import('./HeroCanvas.jsx'))
const HeroOverlay = lazy(() => import('./HeroOverlay.jsx'))
const Sections = lazy(() => import('./Sections.jsx'))

// Memoized brand toggle to prevent unnecessary re-renders
const BrandToggle = memo(({ brand, onBrandChange }) => (
  <div className="brand-toggle-fixed">
    {Object.values(BRANDS).map((b) => (
      <button
        key={b.id}
        onClick={() => onBrandChange(b)}
        className={`brand-btn-mini ${brand.id === b.id ? 'active' : ''}`}
        style={{ '--brand-color': b.color }}
        aria-label={`Ganti ke ${b.name}`}
      >
        {b.wordmark}
      </button>
    ))}
  </div>
))

export default function App() {
  const [brand, setBrand] = useState(() => {
    const p = new URLSearchParams(window.location.search)
    return BRANDS[p.get('brand')] || BRANDS.gojek
  })
  const [loading, setLoading] = useState(true)
  const [lowPerf, setLowPerf] = useState(false)

  useEffect(() => {
    const p = new URLSearchParams()
    p.set('brand', brand.id)
    window.history.replaceState(null, '', '?' + p.toString())
    document.documentElement.style.setProperty('--glow', brand.glow)
    document.documentElement.style.setProperty('--brand-color', brand.color)
  }, [brand])

  useEffect(() => {
    // Autoplay animation
    clock.playing = true
    clock.t = 0

    // Detect low performance devices
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
      const isLowEnd = navigator.hardwareConcurrency <= 4
      setLowPerf(isMobile || isLowEnd)
    }
    checkPerformance()
  }, [])

  return (
    <ErrorBoundary>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div className="app" data-low-perf={lowPerf}>
        <Suspense fallback={<div className="loading-fallback">Memuat...</div>}>
          {/* Hero Section - Full Screen with 3D */}
          <section className="hero-section">
            <HeroCanvas brand={brand} lowPerf={lowPerf} />
            <HeroOverlay brand={brand} />
            <BrandToggle brand={brand} onBrandChange={setBrand} />
          </section>

          {/* Content Sections - Scrollable */}
          <Sections brand={brand} />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
