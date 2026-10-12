import { DURATION } from './brands.js'

// Single shared timeline. The R3F Director advances it; the DOM overlay reads it.
export const clock = { t: 0, playing: true }

export const clamp01 = (x) => Math.min(1, Math.max(0, x))
export const range = (t, a, b) => clamp01((t - a) / (b - a))
export const smooth = (x) => x * x * (3 - 2 * x)
export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
export const easeOutBack = (x) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

// Point-cloud morph stage: 0 scatter, 1 eye, 2 map, 3 service rings, 4 billboard.
const MORPHS = [
  [0.6, 1.6, 0],
  [3.2, 4.2, 1],
  [6.2, 7.2, 2],
  [8.8, 10.0, 3],
]
export function stageAt(t) {
  let s = 0
  for (const [a, b, i] of MORPHS) if (t >= a) s = i + range(t, a, b)
  return s
}

// Clamp to duration, don't loop
export const clampT = (t) => Math.min(DURATION, Math.max(0, t))
