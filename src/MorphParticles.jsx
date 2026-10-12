import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { N, SHAPES, RAND } from './shapes.js'
import { clock, stageAt, range } from './clock.js'

const vertex = /* glsl */ `
  attribute vec3 p0; attribute vec3 p1; attribute vec3 p2; attribute vec3 p3; attribute vec3 p4;
  attribute float aRand;
  uniform float uStage, uTime, uPixel, uFade;
  uniform vec3 uCols[5];
  varying vec3 vColor;
  varying float vAlpha;

  vec3 shape(int k) {
    if (k <= 0) return p0;
    if (k == 1) return p1;
    if (k == 2) return p2;
    if (k == 3) return p3;
    return p4;
  }

  void main() {
    int k = int(floor(uStage));
    float f = uStage - float(k);
    // per-particle stagger so the morph ripples instead of snapping
    float d = aRand * 0.45;
    float e = smoothstep(d, d + 0.55, f);
    vec3 a = shape(k);
    vec3 b = shape(k + 1);
    vec3 pos = mix(a, b, e);

    // swirl outward mid-flight
    float mid = sin(e * 3.14159);
    float ang = aRand * 6.2831 + uTime * 0.6;
    pos += vec3(cos(ang), sin(ang * 1.3), sin(ang)) * mid * (0.8 + aRand * 1.6);
    // idle shimmer
    pos += 0.025 * vec3(sin(uTime * 2.0 + aRand * 40.0), cos(uTime * 1.7 + aRand * 31.0), 0.0);

    vColor = mix(uCols[k], uCols[min(k + 1, 4)], e);
    vAlpha = (0.55 + 0.45 * aRand) * (1.0 - uFade * (0.4 + aRand));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPixel * (0.6 + aRand * 0.9 + mid * 1.2) / -mv.z;
  }
`

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float s = smoothstep(0.5, 0.0, r);
    gl_FragColor = vec4(vColor * (0.6 + s * 1.6), s * clamp(vAlpha, 0.0, 1.0));
  }
`

export default function MorphParticles({ brand }) {
  const mat = useRef()
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(SHAPES[0], 3))
    SHAPES.forEach((s, i) => g.setAttribute(`p${i}`, new THREE.BufferAttribute(s, 3)))
    g.setAttribute('aRand', new THREE.BufferAttribute(RAND, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40)
    return g
  }, [])

  const uniforms = useMemo(
    () => ({
      uStage: { value: 0 },
      uTime: { value: 0 },
      uFade: { value: 0 },
      uPixel: { value: 60 },
      uCols: { value: [0, 1, 2, 3, 4].map(() => new THREE.Color()) },
    }),
    [],
  )

  // palette per shape: chaos → amber eye → cyan map → gold rings → brand green billboard
  useMemo(() => {
    const c = uniforms.uCols.value
    c[0].set('#6d7cff')
    c[1].set('#ffb347')
    c[2].set('#38e1ff')
    c[3].set('#ffd166')
    c[4].set(brand.glow)
  }, [brand, uniforms])

  useFrame((state) => {
    const u = mat.current.uniforms
    u.uStage.value = stageAt(clock.t)
    u.uTime.value = state.clock.elapsedTime
    // Particles fade out but stay visible at low opacity
    u.uFade.value = Math.min(range(clock.t, 10.4, 11.6), 0.7)
    u.uPixel.value = 34 * state.gl.getPixelRatio() * (state.size.height / 800)
  })

  return (
    <points geometry={geo} frustumCulled={false} count={N}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
