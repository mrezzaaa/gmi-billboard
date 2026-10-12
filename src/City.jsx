import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clock, range, easeOutBack } from './clock.js'
import { makeWindowTexture } from './textures.js'

export default function City({ lowPerf = false }) {
  const inst = useRef()
  const winTex = useMemo(() => makeWindowTexture(), [])

  const data = useMemo(() => {
    const arr = []
    const R = Math.random
    const count = lowPerf ? 100 : 180
    // scatter buildings around billboard, keep front clear
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2
      const dist = 12 + R() * 14
      const x = Math.cos(ang) * dist
      const z = Math.sin(ang) * dist
      // skip front arc
      if (z > -4 && Math.abs(x) < 8) continue
      const h = 2 + R() * R() * 18
      arr.push({ x, z, h, delay: R() })
    }
    return arr
  }, [lowPerf])

  useFrame(() => {
    if (!inst.current) return
    const rise = range(clock.t, 8.6, 11.0)
    const mat = new THREE.Matrix4()
    const dummy = new THREE.Object3D()
    data.forEach(({ x, z, h, delay }, i) => {
      const t = Math.max(0, rise - delay * 0.5) / (1 - delay * 0.5)
      const s = easeOutBack(Math.min(1, t))
      dummy.position.set(x, -1.6 + (h / 2) * s, z)
      dummy.scale.set(1.4 + Math.random() * 0.6, h * s, 1.4 + Math.random() * 0.6)
      dummy.updateMatrix()
      inst.current.setMatrixAt(i, dummy.matrix)
    })
    inst.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={inst} args={[null, null, data.length]} castShadow>
      <boxGeometry />
      <meshStandardMaterial
        color="#0a0e14"
        emissive="#ff9d5c"
        emissiveIntensity={lowPerf ? 0.1 : 0.18}
        emissiveMap={lowPerf ? null : winTex}
        metalness={0.3}
        roughness={0.7}
      />
    </instancedMesh>
  )
}
