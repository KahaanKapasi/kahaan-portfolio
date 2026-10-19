/**
 * The hero "world chart": one height field shared by the WebGL relief and the
 * 2D fallback, plus the payment routes that arc between its cities.
 */
export type Port = { x: number; y: number }

export const PORTS: Port[] = [
  { x: -0.7, y: 0.22 },
  { x: -0.18, y: -0.4 },
  { x: 0.34, y: 0.3 },
  { x: 0.78, y: -0.2 },
  { x: -0.05, y: 0.62 },
]

/** Pairs of city indices that pay each other. */
export const ROUTES: [number, number, number][] = [
  [0, 1, 0.18],
  [1, 3, -0.16],
  [0, 2, 0.24],
  [2, 3, 0.14],
  [4, 2, -0.12],
  [1, 2, -0.1],
]

export function height(x: number, y: number): number {
  let h =
    0.46 * Math.sin(x * 2.1 + 0.7) * Math.cos(y * 1.7 - 0.4) +
    0.26 * Math.sin(x * 4.3 - y * 3.1 + 1.2) +
    0.13 * Math.cos(x * 7.7 + y * 6.3 + 0.3) +
    0.06 * Math.sin(x * 13.1 - y * 11.7)
  for (const p of PORTS) {
    const d2 = (x - p.x) * (x - p.x) + (y - p.y) * (y - p.y)
    h += 0.95 * Math.exp(-d2 / 0.014)
  }
  return h
}

export type RoutePt = { x: number; y: number; lift: number; t: number }

/** Sample a route as an arc: lateral bend in the plane plus a lift above the surface. */
export function sampleRoute(a: Port, b: Port, bend: number, n: number): RoutePt[] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const out: RoutePt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const s = Math.sin(Math.PI * t)
    out.push({ x: a.x + dx * t + nx * bend * s, y: a.y + dy * t + ny * bend * s, lift: 0.1 + 0.34 * s, t })
  }
  return out
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ramp: [number, number[]][] = [
  [-0.9, [8, 16, 108]],
  [0, [22, 51, 220]],
  [0.7, [74, 104, 255]],
  [1.5, [170, 188, 255]],
]
function color(h: number): number[] {
  if (h <= ramp[0][0]) return ramp[0][1]
  for (let i = 1; i < ramp.length; i++) {
    if (h <= ramp[i][0]) {
      const [h0, c0] = ramp[i - 1]
      const [h1, c1] = ramp[i]
      const t = (h - h0) / (h1 - h0)
      return [lerp(c0[0], c1[0], t), lerp(c0[1], c1[1], t), lerp(c0[2], c1[2], t)]
    }
  }
  return ramp[ramp.length - 1][1]
}

/** Flat 2D render of the same chart, used when WebGL or motion is unavailable. */
export function drawChart(canvas: HTMLCanvasElement, w: number, h: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const sw = 360
  const sh = Math.max(120, Math.round((sw * h) / w))
  const off = document.createElement('canvas')
  off.width = sw
  off.height = sh
  const octx = off.getContext('2d')!
  const img = octx.createImageData(sw, sh)
  const span = 1.5
  const aspect = w / h
  const levels = 14
  for (let j = 0; j < sh; j++) {
    for (let i = 0; i < sw; i++) {
      const x = ((i / sw) * 2 - 1) * span * Math.max(1, aspect * 0.7)
      const y = ((j / sh) * 2 - 1) * span
      const v = height(x, y)
      const c = color(v)
      const f = v * levels
      const d = Math.abs(f - Math.round(f))
      const line = Math.max(0, 1 - d / 0.07)
      const major = Math.abs(v * levels / 5 - Math.round((v * levels) / 5)) < 0.012 ? 0.5 : 0
      const k = Math.min(1, line * 0.32 + major)
      const o = (j * sw + i) * 4
      img.data[o] = lerp(c[0], 215, k)
      img.data[o + 1] = lerp(c[1], 224, k)
      img.data[o + 2] = lerp(c[2], 255, k)
      img.data[o + 3] = 255
    }
  }
  octx.putImageData(img, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(off, 0, 0, canvas.width, canvas.height)
  // routes + ports
  const X = (x: number) => ((x / (span * Math.max(1, aspect * 0.7)) + 1) / 2) * canvas.width
  const Y = (y: number) => ((y / span + 1) / 2) * canvas.height
  ctx.lineWidth = Math.max(1.5, canvas.width / 700)
  ctx.strokeStyle = 'rgba(255,106,43,0.95)'
  ctx.shadowColor = 'rgba(255,106,43,0.6)'
  ctx.shadowBlur = 8
  ROUTES.forEach(([a, b, bend]) => {
    const pts = sampleRoute(PORTS[a], PORTS[b], bend, 40)
    ctx.beginPath()
    pts.forEach((p, i) => (i ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))))
    ctx.stroke()
  })
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#fff'
  PORTS.forEach((p) => {
    ctx.beginPath()
    ctx.arc(X(p.x), Y(p.y), Math.max(5, canvas.width / 110), 0, Math.PI * 2)
    ctx.stroke()
  })
}
