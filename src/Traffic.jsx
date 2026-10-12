import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clock } from './clock.js'

export default function Traffic({ brand }) {
  const inst = useRef()

  const data = useMemo(() => {
    const arr = []
    const R = Math.random
    const lanes = [
      { x: -2.4, dir: 1, col: '#ffffff' }, // headlights left
      { x: -0.8, dir: 1, col: brand.glow },
      { x: 0.8, dir: -1, col: '#ff3838' }, // taillights right
      { x: 2.4, dir: -1, col: '#ff5555' },
    ]
    lanes.forEach(({ x, dir, col }) => {
      for (let i = 0; i < 40; i++) {
        arr.push({
          x,
          z: -15 + R() * 30,
          dir,
          speed: 0.08 + R() * 0.14,
          col: new THREE.Color(col).multiplyScalar(2.6 + R() * 1.4),
          len: 0.6 + R() * 1.2,
        })
      }
    })
    return arr
  }, [brand])

  useFrame((state, delta) => {
    if (!inst.current || clock.t < 9.0) return
    const mat = new THREE.Matrix4()
    const dummy = new THREE.Object3D()
    data.forEach(({ x, z, dir, speed, col, len }, i) => {
      data[i].z += dir * speed * delta * 60
      if (data[i].z > 18) data[i].z = -18
      if (data[i].z < -18) data[i].z = 18
      dummy.position.set(x, -1.5, data[i].z)
      dummy.scale.set(0.16, 0.2, len)
      dummy.updateMatrix()
      inst.current.setMatrixAt(i, dummy.matrix)
      inst.current.setColorAt(i, col)
    })
    inst.current.instanceMatrix.needsUpdate = true
    if (inst.current.instanceColor) inst.current.instanceColor.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={inst} args={[null, null, data.length]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {/* road surface */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.61, 0]}>
        <planeGeometry args={[12, 36]} />
        <meshStandardMaterial color="#0d1015" roughness={0.9} />
      </mesh>
    </>
  )
}
