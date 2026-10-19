/**
 * A tiny painter's-algorithm 3D renderer on a 2D canvas. It exists to produce
 * soft-lit "architectural renders" procedurally (no photos, no assets).
 */
export type V3 = [number, number, number]
export type RGB = [number, number, number]

export const v = {
  sub: (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  add: (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  mul: (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a: V3) => Math.hypot(a[0], a[1], a[2]),
  norm: (a: V3): V3 => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1
    return [a[0] / l, a[1] / l, a[2] / l]
  },
  lerp: (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
}

export function hex(h: string): RGB {
  const n = parseInt(h.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const mixc = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const css = (c: RGB, a = 1) => `rgba(${Math.round(Math.max(0, Math.min(255, c[0])))},${Math.round(Math.max(0, Math.min(255, c[1])))},${Math.round(Math.max(0, Math.min(255, c[2])))},${a})`
export const rgbCss = css

export type Face = {
  p: V3[]
  holes?: V3[][]
  c: RGB
  layer?: number
  alpha?: number
  /** Override the computed brightness (0..1.6). */
  lit?: number
  emissive?: boolean
  /** Vertical gradient (screen space) for emissive faces. */
  grad?: [RGB, RGB]
  add?: boolean
  noFog?: boolean
  bloom?: number
  stroke?: boolean
  bias?: number
}

export type Scene = {
  eye: V3
  target: V3
  fov: number
  /** Direction the light travels (from sun toward the scene). */
  sun: V3
  amb: number
  diff: number
  fog: { c: RGB; d: number }
  sky: (ctx: CanvasRenderingContext2D, w: number, h: number, cam: Cam) => void
  faces: Face[]
  post?: (ctx: CanvasRenderingContext2D, w: number, h: number, cam: Cam) => void
  grain?: number
  vignette?: number
  seed?: number
}

export class Cam {
  r: V3
  u: V3
  f: V3
  F: number
  constructor(public eye: V3, target: V3, fov: number, public w: number, public h: number) {
    this.f = v.norm(v.sub(target, eye))
    this.r = v.norm(v.cross([0, 1, 0], this.f))
    this.u = v.cross(this.f, this.r)
    this.F = h / 2 / Math.tan((fov * Math.PI) / 360)
  }
  cam(p: V3): V3 {
    const d = v.sub(p, this.eye)
    return [v.dot(d, this.r), v.dot(d, this.u), v.dot(d, this.f)]
  }
  scr(c: V3): [number, number] {
    return [this.w / 2 + (c[0] / c[2]) * this.F, this.h / 2 - (c[1] / c[2]) * this.F]
  }
  project(p: V3): [number, number, number] {
    const c = this.cam(p)
    const s = this.scr(c)
    return [s[0], s[1], c[2]]
  }
}

const NEAR = 0.15
function clipNear(pts: V3[]): V3[] {
  const out: V3[] = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const ai = a[2] >= NEAR
    const bi = b[2] >= NEAR
    if (ai) out.push(a)
    if (ai !== bi) {
      const t = (NEAR - a[2]) / (b[2] - a[2])
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR])
    }
  }
  return out
}

export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}

// ---------- builders ----------
export const quad = (a: V3, b: V3, c: V3, d: V3, col: RGB, o: Partial<Face> = {}): Face => ({ p: [a, b, c, d], c: col, ...o })

/** Axis-aligned box, returns visible-ish faces (top and four sides). */
export function box(min: V3, max: V3, col: RGB | { top?: RGB; side?: RGB; front?: RGB }, o: Partial<Face> = {}): Face[] {
  const [x0, y0, z0] = min
  const [x1, y1, z1] = max
  const C = Array.isArray(col) ? { top: col, side: col, front: col } : { top: col.top ?? col.side!, side: col.side ?? col.top!, front: col.front ?? col.side ?? col.top! }
  return [
    quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], C.top!, o),
    quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], C.front!, o),
    quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], C.front!, o),
    quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], C.side!, o),
    quad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], C.side!, o),
  ]
}

/** Polygon for an arched opening in a plane: origin + u*(x) + v*(y). */
export function archPts(origin: V3, uDir: V3, vDir: V3, cx: number, w: number, y0: number, hStraight: number, seg = 14): V3[] {
  const P = (x: number, y: number): V3 => [origin[0] + uDir[0] * x + vDir[0] * y, origin[1] + uDir[1] * x + vDir[1] * y, origin[2] + uDir[2] * x + vDir[2] * y]
  const r = w / 2
  const pts: V3[] = [P(cx - r, y0), P(cx + r, y0), P(cx + r, y0 + hStraight)]
  for (let i = 1; i < seg; i++) {
    const a = (i / seg) * Math.PI
    pts.push(P(cx + r * Math.cos(a), y0 + hStraight + r * Math.sin(a)))
  }
  pts.push(P(cx - r, y0 + hStraight))
  return pts
}

export function rectPts(origin: V3, uDir: V3, vDir: V3, x0: number, y0: number, x1: number, y1: number): V3[] {
  const P = (x: number, y: number): V3 => [origin[0] + uDir[0] * x + vDir[0] * y, origin[1] + uDir[1] * x + vDir[1] * y, origin[2] + uDir[2] * x + vDir[2] * y]
  return [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]
}

/** Project a world polygon along the light direction onto a plane (point + normal). */
export function castOnPlane(poly: V3[], dir: V3, planePt: V3, n: V3): V3[] {
  const dn = v.dot(dir, n)
  return poly.map((p) => {
    const t = v.dot(v.sub(planePt, p), n) / dn
    return v.add(p, v.mul(dir, t))
  })
}

/** Clip a polygon to a half space: keep points where dot(p - pt, n) >= 0. */
export function clipHalf(poly: V3[], pt: V3, n: V3): V3[] {
  const out: V3[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    const da = v.dot(v.sub(a, pt), n)
    const db = v.dot(v.sub(b, pt), n)
    if (da >= 0) out.push(a)
    if (da >= 0 !== db >= 0) {
      const t = da / (da - db)
      out.push(v.lerp(a, b, t))
    }
  }
  return out
}

/** Soft patch of light: nested translucent copies shrink toward the centroid. */
export function softPatch(poly: V3[], col: RGB, alpha: number, layer: number, steps = 6, add = true): Face[] {
  if (poly.length < 3) return []
  const cen = poly.reduce((s, p) => v.add(s, p), [0, 0, 0] as V3).map((x) => x / poly.length) as V3
  const faces: Face[] = []
  for (let i = 0; i < steps; i++) {
    const k = 1.06 - (i / steps) * 0.3
    faces.push({ p: poly.map((p) => v.add(cen, v.mul(v.sub(p, cen), k))), c: col, emissive: true, alpha: alpha / steps * 1.6, add, layer, noFog: true })
  }
  return faces
}

export function mirrorY(faces: Face[], tint: RGB, alpha: number, layer: number): Face[] {
  return faces
    .filter((f) => !f.emissive || f.grad || f.bloom)
    .map((f) => ({ ...f, p: f.p.map(([x, y, z]) => [x, -y, z] as V3), c: mixc(f.c, tint, 0.35), alpha: (f.alpha ?? 1) * alpha, layer, holes: undefined, bloom: undefined }))
}

// ---------- renderer ----------
type Prep = { f: Face; s: [number, number][]; holes: [number, number][][]; depth: number; col: RGB }

export function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, sc: Scene) {
  const cam = new Cam(sc.eye, sc.target, sc.fov, w, h)
  ctx.save()
  ctx.clearRect(0, 0, w, h)
  sc.sky(ctx, w, h, cam)

  const L = v.norm(sc.sun)
  const prepped: Prep[] = []
  for (const f of sc.faces) {
    const cam3 = f.p.map((p) => cam.cam(p))
    const clipped = clipNear(cam3)
    if (clipped.length < 3) continue
    const s = clipped.map((c) => cam.scr(c))
    const depth = (cam3.reduce((a, c) => a + c[2], 0) / cam3.length) + (f.bias ?? 0)
    // shading
    let col = f.c
    if (!f.emissive) {
      let n = v.norm(v.cross(v.sub(f.p[1], f.p[0]), v.sub(f.p[2], f.p[0])))
      const cen = f.p.reduce((a, p) => v.add(a, p), [0, 0, 0] as V3).map((x) => x / f.p.length) as V3
      if (v.dot(n, v.sub(sc.eye, cen)) < 0) n = v.mul(n, -1)
      const b = f.lit ?? sc.amb + sc.diff * Math.max(0, v.dot(n, v.mul(L, -1)))
      col = [f.c[0] * b, f.c[1] * b, f.c[2] * b]
    }
    if (!f.noFog) col = mixc(col, sc.fog.c, 1 - Math.exp(-depth * sc.fog.d))
    const holes = (f.holes ?? []).map((hp) => hp.map((p) => cam.project(p)).map((q) => [q[0], q[1]] as [number, number]))
    prepped.push({ f, s, holes, depth, col })
  }
  prepped.sort((a, b) => (a.f.layer ?? 1) - (b.f.layer ?? 1) || b.depth - a.depth)

  const blooms: { x: number; y: number; r: number; c: RGB }[] = []
  for (const q of prepped) {
    const { f, s, holes, col } = q
    ctx.globalAlpha = f.alpha ?? 1
    ctx.globalCompositeOperation = f.add ? 'lighter' : 'source-over'
    ctx.beginPath()
    s.forEach((pt, i) => (i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])))
    ctx.closePath()
    for (const hp of holes) {
      hp.forEach((pt, i) => (i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])))
      ctx.closePath()
    }
    if (f.grad) {
      let y0 = Infinity
      let y1 = -Infinity
      for (const pt of s) {
        y0 = Math.min(y0, pt[1])
        y1 = Math.max(y1, pt[1])
      }
      const g = ctx.createLinearGradient(0, y0, 0, y1)
      g.addColorStop(0, css(f.grad[0]))
      g.addColorStop(1, css(f.grad[1]))
      ctx.fillStyle = g
    } else ctx.fillStyle = css(col)
    ctx.fill('evenodd')
    if (!f.add && (f.alpha ?? 1) >= 0.99 && f.stroke !== false) {
      ctx.strokeStyle = css(col)
      ctx.lineWidth = 0.8
      ctx.lineJoin = 'round'
      ctx.stroke()
    }
    if (f.bloom) {
      const cx = s.reduce((a, p) => a + p[0], 0) / s.length
      const cy = s.reduce((a, p) => a + p[1], 0) / s.length
      blooms.push({ x: cx, y: cy, r: f.bloom * w * 0.045 * Math.min(2.2, 16 / Math.max(3, q.depth)), c: f.grad ? f.grad[0] : f.c })
    }
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'lighter'
  for (const b of blooms) {
    const r = Math.min(b.r, w * 0.5)
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
    g.addColorStop(0, css(b.c, 0.2))
    g.addColorStop(1, css(b.c, 0))
    ctx.fillStyle = g
    ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2)
  }
  ctx.globalCompositeOperation = 'source-over'
  sc.post?.(ctx, w, h, cam)

  // film grain
  const rnd = rng(sc.seed ?? 7)
  const grainAmt = sc.grain ?? 0.07
  if (grainAmt > 0) {
    const n = document.createElement('canvas')
    n.width = 200
    n.height = 200
    const nctx = n.getContext('2d')!
    const id = nctx.createImageData(200, 200)
    for (let i = 0; i < id.data.length; i += 4) {
      const g = rnd() * 255
      id.data[i] = id.data[i + 1] = id.data[i + 2] = g
      id.data[i + 3] = 255
    }
    nctx.putImageData(id, 0, 0)
    ctx.globalAlpha = grainAmt
    ctx.globalCompositeOperation = 'soft-light'
    ctx.fillStyle = ctx.createPattern(n, 'repeat')!
    ctx.fillRect(0, 0, w, h)
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  const vg = sc.vignette ?? 0.35
  if (vg > 0) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, `rgba(8,8,10,${vg})`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }
  ctx.restore()
}
