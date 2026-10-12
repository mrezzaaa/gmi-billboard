import * as THREE from 'three'

export const N = 14000
// Billboard dimensions in world units (screen w × h, panel centre height, ground level).
export const BB = { w: 6, h: 2.58, cy: 2.2, groundY: -1.6 }

export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const R = mulberry32(2014)
const TAU = Math.PI * 2
const gauss = () => {
  let u = 0
  while (u === 0) u = R()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * R())
}
const pick = (arr) => arr[(R() * arr.length) | 0]

function build(fn) {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const p = fn()
    a[i * 3] = p[0]
    a[i * 3 + 1] = p[1]
    a[i * 3 + 2] = p[2]
  }
  return a
}

/* 0 — chaos: particles scattered through space */
const scatter = build(() => {
  const r = 7 + R() * 12
  const th = R() * TAU
  const ph = Math.acos(2 * R() - 1)
  return [r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.7, r * Math.sin(ph) * Math.sin(th) - 6]
})

/* 1 — the eye: attention */
const EY = 0.6
const eye = build(() => {
  const p = R()
  if (p < 0.28) {
    const x = R() * 2 - 1
    const up = R() < 0.5
    const y = (up ? 1.45 : -1.2) * (1 - x * x)
    return [x * 3.6 + gauss() * 0.02, EY + y + gauss() * 0.02, gauss() * 0.04]
  }
  if (p < 0.7) {
    // iris with radial striations
    const a = R() < 0.6 ? (Math.floor(R() * 96) / 96) * TAU + gauss() * 0.004 : R() * TAU
    const r = 0.45 + Math.pow(R(), 0.7) * 0.62
    return [Math.cos(a) * r, EY + Math.sin(a) * r, 0.05]
  }
  if (p < 0.82) {
    const a = R() * TAU
    const r = Math.sqrt(R()) * 0.36
    return [Math.cos(a) * r, EY + Math.sin(a) * r, 0.1]
  }
  const a = R() * TAU
  const r = 2.1 + R() * R() * 2.6
  return [Math.cos(a) * r * 1.9, EY + Math.sin(a) * r * 0.9, -0.4]
})

/* 2 — schematic coverage map (zones from gmibillboard.co.id) */
export const ZONES = [
  { name: 'Jakarta Utara', x: -1.2, z: -3.0 },
  { name: 'Jakarta Barat', x: -3.4, z: -1.6 },
  { name: 'Jakarta Pusat', x: -1.3, z: -1.2 },
  { name: 'Jakarta Timur', x: 0.6, z: -0.9, tag: 'LED' },
  { name: 'Jakarta Selatan', x: -1.8, z: 0.6, tag: 'LED' },
  { name: 'Depok', x: -1.6, z: 2.6 },
  { name: 'Bekasi', x: 2.4, z: -1.2 },
  { name: 'Bandung', x: 4.2, z: 2.6 },
].map((z, i) => {
  const height = 0.9 + ((i * 37) % 5) * 0.25
  return { ...z, height, label: [z.x, height + 0.3, z.z] }
})
export const TOLL_LABEL = { name: 'View Toll', tag: 'TOLL', label: [3.75, 0.35, 0.9] }

const TOLL = [[0.6, -0.9], [2.4, -1.2], [3.4, 0.2], [3.9, 1.5], [4.2, 2.6]]
const tollCum = [0]
for (let i = 1; i < TOLL.length; i++) {
  tollCum.push(tollCum[i - 1] + Math.hypot(TOLL[i][0] - TOLL[i - 1][0], TOLL[i][1] - TOLL[i - 1][1]))
}
function alongToll() {
  const d = R() * tollCum[tollCum.length - 1]
  let i = 1
  while (tollCum[i] < d) i++
  const f = (d - tollCum[i - 1]) / (tollCum[i] - tollCum[i - 1])
  return [TOLL[i - 1][0] + (TOLL[i][0] - TOLL[i - 1][0]) * f, TOLL[i - 1][1] + (TOLL[i][1] - TOLL[i - 1][1]) * f]
}

const map = build(() => {
  const p = R()
  if (p < 0.42) {
    const z = pick(ZONES)
    const r = 0.14 + ((R() * 3) | 0) * 0.16 + gauss() * 0.01
    const a = R() * TAU
    return [z.x + Math.cos(a) * r, 0, z.z + Math.sin(a) * r]
  }
  if (p < 0.6) {
    const z = pick(ZONES)
    const y = R() * z.height
    const a = R() * TAU
    const r = 0.035 * (1 - y / z.height) + 0.01
    return [z.x + Math.cos(a) * r, y, z.z + Math.sin(a) * r]
  }
  if (p < 0.75) {
    const [x, z] = alongToll()
    return [x + gauss() * 0.03, 0, z + gauss() * 0.03]
  }
  if (p < 0.85) {
    const a = R() * TAU
    return [-1.3 + Math.cos(a) * 1.7 + gauss() * 0.02, 0, -1.0 + Math.sin(a) * 1.5 + gauss() * 0.02]
  }
  return [-1.2 + gauss() * 1.2, 0, -0.8 + gauss() * 1.0]
})

/* 3 — orbit rings: the five in-house services */
export const SERVICES = ['Graphic Design', 'Production & Install', 'Permit & Tax', 'Annual Maintenance', 'Consulting']
const RC = new THREE.Vector3(0, 1.2, 0)
const ringEuler = SERVICES.map((_, k) => new THREE.Euler(0.35 + k * 0.42, k * 0.9, (k - 2) * 0.3))
const ringR = (k) => 1.15 + k * 0.38
export const RING_LABELS = SERVICES.map((name, k) => {
  const a = 0.6 + k * 1.25
  const v = new THREE.Vector3(Math.cos(a) * ringR(k), 0, Math.sin(a) * ringR(k)).applyEuler(ringEuler[k]).add(RC)
  return { name, label: [v.x, v.y, v.z] }
})
const tmp = new THREE.Vector3()
const rings = build(() => {
  if (R() < 0.14) {
    tmp.set(gauss(), gauss(), gauss()).normalize().multiplyScalar(Math.cbrt(R()) * 0.5).add(RC)
    return [tmp.x, tmp.y, tmp.z]
  }
  const k = (R() * SERVICES.length) | 0
  const a = R() * TAU
  const r = ringR(k)
  tmp.set(Math.cos(a) * r, gauss() * 0.015, Math.sin(a) * r).applyEuler(ringEuler[k]).add(RC)
  return [tmp.x, tmp.y, tmp.z]
})

/* 4 — the billboard */
const { w, h, cy, groundY } = BB
const poleTop = cy - h / 2
const billboard = build(() => {
  const p = R()
  if (p < 0.55) return [(R() - 0.5) * w, cy + (R() - 0.5) * h, 0.12]
  if (p < 0.7) {
    const s = R()
    const t = R() - 0.5
    const j = gauss() * 0.03
    if (s < 0.35) return [t * (w + 0.3), cy + h / 2 + 0.12 + j, 0.1]
    if (s < 0.7) return [t * (w + 0.3), cy - h / 2 - 0.12 + j, 0.1]
    if (s < 0.85) return [-w / 2 - 0.12 + j, cy + t * (h + 0.3), 0.1]
    return [w / 2 + 0.12 + j, cy + t * (h + 0.3), 0.1]
  }
  if (p < 0.88) {
    const a = R() * TAU
    return [Math.cos(a) * 0.22, groundY + R() * (poleTop - groundY), Math.sin(a) * 0.22]
  }
  if (p < 0.95) return [(R() - 0.5) * (w + 0.2), poleTop - 0.15, 0.05 + R() * 0.55]
  const lx = pick([-2, 0, 2])
  const s = R()
  return [lx + gauss() * 0.3 * s, cy + h / 2 + 0.35 - s * 1.6, 0.75 - s * 0.6]
})

export const SHAPES = [scatter, eye, map, rings, billboard]
export const RAND = Float32Array.from({ length: N }, () => R())
