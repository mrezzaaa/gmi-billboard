import { Canvas } from '@react-three/fiber'
import { memo } from 'react'
import Scene from './Scene.jsx'

const HeroCanvas = memo(function HeroCanvas({ brand, lowPerf = false }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 11], fov: 50, near: 0.1, far: 200 }}
      dpr={lowPerf ? [0.8, 1.5] : [1, 2]}
      gl={{
        antialias: !lowPerf,
        toneMapping: 2,
        toneMappingExposure: 1.2,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      style={{ position: 'absolute', inset: 0 }}
      performance={{ min: 0.5 }}
    >
      <Scene brand={brand} lowPerf={lowPerf} />
    </Canvas>
  )
})

export default HeroCanvas
