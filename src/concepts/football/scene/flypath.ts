/* Camera path for the scroll fly-through. Pure maths, no three.js import, so the
   page chunk can read it for the HUD without pulling three in early. */
export type V3 = [number, number, number]

export const GOAL_X = 52.5

const POS: V3[] = [
  [-98, 96, 112],
  [-70, 70, 80],
  [-54, 34, 40],
  [-40, 11, 25],
  [-12, 5, 30],
  [20, 2.6, 15],
  [31.5, 1.7, 4.5],
  [35.4, 1.15, 0],
]
const LOOK: V3[] = [
  [-10, -8, 24],
  [-6, 0, 0],
  [0, 2, 0],
  [4, 1, 2],
  [30, 1.4, 4],
  [46, 1.1, 2],
  [52.5, 1.3, 0],
  [52.5, 1.5, 0],
]

function cr(a: number, b: number, c: number, d: number, t: number) {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
}

function sample(pts: V3[], u: number): V3 {
  const n = pts.length - 1
  const x = Math.min(Math.max(u, 0), 1) * n
  const i = Math.min(Math.floor(x), n - 1)
  const t = x - i
  const p0 = pts[Math.max(i - 1, 0)]
  const p1 = pts[i]
  const p2 = pts[i + 1]
  const p3 = pts[Math.min(i + 2, n)]
  return [cr(p0[0], p1[0], p2[0], p3[0], t), cr(p0[1], p1[1], p2[1], p3[1], t), cr(p0[2], p1[2], p2[2], p3[2], t)]
}

export function flyPath(p: number): { pos: V3; look: V3 } {
  return { pos: sample(POS, p), look: sample(LOOK, p) }
}

export function telemetry(p: number) {
  const a = flyPath(p).pos
  const b = flyPath(Math.min(1, p + 0.004)).pos
  const step = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  return {
    altitude: Math.max(0.5, a[1]),
    toGoal: Math.hypot(GOAL_X - a[0], a[1], a[2]),
    speed: Math.min(240, (step / 0.004) * 0.9),
  }
}
