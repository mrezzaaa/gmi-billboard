import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { clock, range, smooth, easeOutBack } from './clock.js'
import { makeAdTexture, makeLogoTexture, makePlateTexture } from './textures.js'
import { BB } from './shapes.js'

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D tLogo, tAd;
  uniform float uMorph; // 0 sphere logo, 1 flat ad
  varying vec2 vUv;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    vec2 c = vUv - 0.5;
    // sphere UVs → repeat wordmark around the globe
    vec2 logoUV = vec2(fract(vUv.x * 2.0), vUv.y);
    vec4 logo = texture2D(tLogo, logoUV);
    // rectangular ad UVs
    vec4 ad = texture2D(tAd, vUv);

    // morph mask: disc → roundrect
    float rDisc = 0.48;
    float dDisc = length(c) - rDisc;
    vec2 boxB = vec2(0.48, 0.48);
    float dBox = sdRoundBox(c, boxB, 0.04);
    float d = mix(dDisc, dBox, uMorph);
    float mask = smoothstep(0.006, -0.006, d);

    // wipe from left: reveal ad progressively
    float wipe = smoothstep(-0.05, 0.05, vUv.x - (0.5 - uMorph * 0.5));
    float reveal = mix(1.0, wipe, uMorph);

    vec3 col = mix(logo.rgb, ad.rgb, uMorph);
    // edge glow on the mask border
    float edgeGlow = smoothstep(0.03, 0.0, abs(d)) * (1.0 - mask) * 2.0;
    col += edgeGlow * vec3(0.4, 1.0, 0.8);

    // LED pixel grid (subtle)
    float px = 0.002;
    float grid = step(0.5, fract(vUv.x / px)) * step(0.5, fract(vUv.y / px));
    col *= 0.92 + grid * 0.08;

    gl_FragColor = vec4(col, mask * reveal);
  }
`

export default function Billboard({ brand }) {
  const grp = useRef()
  const screen = useRef()
  const pole = useRef()
  const frame = useRef()
  const lamps = useRef()

  const texAd = useMemo(() => makeAdTexture(brand), [brand])
  const texLogo = useMemo(() => makeLogoTexture(brand), [brand])
  const texPlate = useMemo(() => makePlateTexture(), [])

  const uniforms = useMemo(
    () => ({
      tLogo: { value: texLogo },
      tAd: { value: texAd },
      uMorph: { value: 0 },
    }),
    [texLogo, texAd],
  )

  useFrame(() => {
    // billboard builds 11.2 → 13.5s
    const build = range(clock.t, 11.2, 13.5)
    const ease = easeOutBack(build)

    if (pole.current) pole.current.scale.y = ease
    if (frame.current) frame.current.scale.setScalar(ease)
    if (lamps.current) lamps.current.visible = ease > 0.6

    // orb → flat ad morph 11.8 → 14.2s
    const morph = smooth(range(clock.t, 11.8, 14.2))
    if (screen.current) {
      screen.current.material.uniforms.uMorph.value = morph
      screen.current.material.uniforms.tLogo.value = texLogo
      screen.current.material.uniforms.tAd.value = texAd
    }

    if (grp.current) grp.current.visible = clock.t > 10.8
  })

  const { w, h, cy, groundY } = BB
  const poleH = cy - h / 2 - groundY

  return (
    <group ref={grp}>
      {/* pole */}
      <mesh
        ref={pole}
        position={[0, groundY + poleH / 2, -0.1]}
        scale-y={0}
        castShadow
      >
        <cylinderGeometry args={[0.22, 0.22, poleH, 12]} />
        <meshStandardMaterial color="#1a1d24" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* frame group */}
      <group ref={frame} position={[0, cy, 0]} scale={0}>
        {/* backing box - hidden untuk menghilangkan box putih */}
        <mesh position={[0, 0, -0.28]} visible={false}>
          <boxGeometry args={[w + 0.3, h + 0.3, 0.4]} />
          <meshStandardMaterial color="#0d1015" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* screen plane with shader */}
        <mesh ref={screen}>
          <planeGeometry args={[w, h, 1, 1]} />
          <shaderMaterial
            vertexShader={vertex}
            fragmentShader={fragment}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* border glow strips */}
        {[
          [0, h / 2 + 0.08, w + 0.24, 0.06],
          [0, -h / 2 - 0.08, w + 0.24, 0.06],
          [-w / 2 - 0.08, 0, 0.06, h + 0.24],
          [w / 2 + 0.08, 0, 0.06, h + 0.24],
        ].map(([x, y, bw, bh], i) => (
          <mesh key={i} position={[x, y, -0.05]}>
            <planeGeometry args={[bw, bh]} />
            <meshBasicMaterial color={brand.color} toneMapped={false} />
          </mesh>
        ))}

        {/* catwalk */}
        <mesh position={[0, -h / 2 - 0.38, 0.35]}>
          <boxGeometry args={[w + 0.6, 0.12, 0.6]} />
          <meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.6} />
        </mesh>

        {/* plate on catwalk front */}
        <mesh position={[0, -h / 2 - 0.38, 0.66]}>
          <planeGeometry args={[5.6, 0.35]} />
          <meshBasicMaterial map={texPlate} toneMapped={false} />
        </mesh>

        {/* lamp heads */}
        <group ref={lamps} position={[0, h / 2 + 0.6, 0.4]}>
          {[-2, 0, 2].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshBasicMaterial color="#ffe8c2" toneMapped={false} />
            </mesh>
          ))}
          <spotLight
            position={[0, 0.2, 0.5]}
            angle={1.1}
            penumbra={0.5}
            intensity={120}
            color={brand.color}
            distance={5}
            target-position={[0, -1, 0]}
          />
        </group>

        <pointLight position={[0, 0, 1.8]} color={brand.glow} intensity={40} distance={8} />
      </group>
    </group>
  )
}
