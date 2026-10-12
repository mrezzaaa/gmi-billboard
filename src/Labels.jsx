import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { clock, range } from './clock.js'
import { ZONES, TOLL_LABEL, RING_LABELS } from './shapes.js'

function Label({ pos, name, tag, show }) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) ref.current.style.opacity = show(clock.t)
  })
  return (
    <Html position={pos} center distanceFactor={8}>
      <div ref={ref} style={{ pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s' }}>
        <div
          style={{
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)',
            border: tag ? '1px solid #ffc107' : '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {name}
          {tag && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                background: '#ffc107',
                color: '#000',
                padding: '2px 6px',
                borderRadius: 3,
                fontWeight: 900,
              }}
            >
              {tag}
            </span>
          )}
        </div>
      </div>
    </Html>
  )
}

export function ZoneLabels() {
  const show = (t) => Math.max(0, Math.min(1, range(t, 4.5, 5.2) - range(t, 7.0, 7.6)))
  return (
    <>
      {ZONES.map((z) => (
        <Label key={z.name} pos={z.label} name={z.name} tag={z.tag} show={show} />
      ))}
      <Label pos={TOLL_LABEL.label} name={TOLL_LABEL.name} tag={TOLL_LABEL.tag} show={show} />
    </>
  )
}

export function ServiceLabels() {
  const show = (t) => Math.max(0, Math.min(1, range(t, 7.8, 8.4) - range(t, 10.2, 10.8)))
  return (
    <>
      {RING_LABELS.map((r) => (
        <Label key={r.name} pos={r.label} name={r.name} show={show} />
      ))}
    </>
  )
}
