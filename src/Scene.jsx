import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment, Stars, Sparkles, MeshReflectorMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { clock, clampT } from './clock.js'
import { DURATION } from './brands.js'
import MorphParticles from './MorphParticles.jsx'
import Billboard from './Billboard.jsx'
import City from './City.jsx'
import Traffic from './Traffic.jsx'
import { ZoneLabels, ServiceLabels } from './Labels.jsx'

function Director() {
  const { camera, pointer } = useThree()
  const init = useRef(false)

  // camera path keyframes [time, [x,y,z], [lookX,lookY,lookZ]]
  const keys = useMemo(
    () => [
      [0, [0, 1.2, 11], [0, 0.6, 0]],
      [3.5, [-2, 1.8, 9], [0, 0.6, 0]],
      [6.0, [3, 2.4, 8], [-1, 0, 0]],
      [8.5, [-1, 0.8, 10], [0, 1.5, 0]],
      [11.0, [5, 3.5, 7], [0, 2, 0]],
      [13.5, [0, 2.8, 10], [0, 2.2, 0]],
      [DURATION, [0, 3.2, 11], [0, 2.2, 0]],
    ],
    [],
  )

  useFrame((state, delta) => {
    if (!clock.playing) return
    clock.t = clampT(clock.t + delta)

    // find segment
    let i = 0
    while (i < keys.length - 1 && clock.t >= keys[i + 1][0]) i++
    const [t0, p0, l0] = keys[i]
    const [t1, p1, l1] = keys[i + 1]
    const f = THREE.MathUtils.smoothstep((clock.t - t0) / (t1 - t0), 0, 1)

    const pos = new THREE.Vector3().fromArray(p0).lerp(new THREE.Vector3().fromArray(p1), f)
    const look = new THREE.Vector3().fromArray(l0).lerp(new THREE.Vector3().fromArray(l1), f)

    // aspect fit for portrait
    const aspect = state.size.width / state.size.height
    if (aspect < 1) {
      const scale = THREE.MathUtils.lerp(1, 1.6, THREE.MathUtils.clamp(1 - aspect, 0, 0.6))
      pos.multiplyScalar(scale)
    }

    // pointer parallax
    pos.x += pointer.x * 0.3
    pos.y += pointer.y * 0.2

    // continuous idle drift (always active, not just at end)
    const idle = state.clock.elapsedTime * 0.2
    pos.x += Math.sin(idle * 0.6) * 0.3
    pos.y += Math.cos(idle * 0.8) * 0.25

    if (!init.current) {
      camera.position.copy(pos)
      camera.lookAt(look)
      init.current = true
    } else {
      camera.position.lerp(pos, 1 - Math.exp(-8 * delta))
      const currLook = new THREE.Vector3()
      camera.getWorldDirection(currLook).multiplyScalar(10).add(camera.position)
      currLook.lerp(look, 1 - Math.exp(-6 * delta))
      camera.lookAt(currLook)
    }
  })

  return null
}

export default function Scene({ brand, lowPerf = false }) {
  return (
    <>
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 14, 40]} />

      <Director />

      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={0.4} color="#b8d4ff" />
      <hemisphereLight args={['#1a2a4a', '#0a0e14', 0.3]} />
      <pointLight position={[0, 4, 6]} intensity={60} distance={16} color="#fff" />

      <Environment resolution={lowPerf ? 128 : 256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <mesh>
            <sphereGeometry args={[50, 16, 16]} />
            <meshBasicMaterial color="#0d1520" side={THREE.BackSide} />
          </mesh>
          {[-1, 1].map((x) =>
            [-1, 1].map((y) => (
              <mesh key={`${x}${y}`} position={[x * 20, y * 20, -30]}>
                <planeGeometry args={[30, 30]} />
                <meshBasicMaterial color="#1a2535" />
              </mesh>
            )),
          )}
        </group>
      </Environment>

      <Stars radius={80} depth={60} count={lowPerf ? 1000 : 2000} factor={3} fade speed={0.4} />
      {!lowPerf && (
        <Sparkles
          position={[0, 2, 0]}
          count={40}
          scale={[12, 6, 8]}
          size={2}
          speed={0.2}
          color={brand.glow}
          opacity={0.4}
        />
      )}

      <mesh rotation-x={-Math.PI / 2} position={[0, -1.62, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        {lowPerf ? (
          <meshStandardMaterial color="#080b10" metalness={0.2} roughness={1} />
        ) : (
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={512}
            mixBlur={0.8}
            mixStrength={0.4}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.2}
            color="#080b10"
            metalness={0.2}
          />
        )}
      </mesh>

      <MorphParticles brand={brand} />
      <Billboard brand={brand} />
      <City lowPerf={lowPerf} />
      <Traffic brand={brand} />
      <ZoneLabels />
      <ServiceLabels />

      <EffectComposer>
        <Bloom 
          luminanceThreshold={lowPerf ? 0.6 : 0.4} 
          luminanceSmoothing={0.6} 
          intensity={lowPerf ? 1.0 : 1.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
        {!lowPerf && <Noise opacity={0.035} />}
      </EffectComposer>
    </>
  )
}
