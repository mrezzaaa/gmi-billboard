import { useState, useEffect } from 'react'

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-logo">
          <span className="loader-text">GMI BILLBOARD</span>
          <span className="loader-subtext">Media Advertising Outdoor</span>
        </div>
        <div className="loader-bar-wrapper">
          <div
            className="loader-bar"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="loader-progress">{Math.floor(progress)}%</div>
      </div>
    </div>
  )
}
