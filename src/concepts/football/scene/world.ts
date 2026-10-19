import * as THREE from 'three'

/* World units are metres. Pitch 105 x 68, centred on the origin, long axis = x. */
export const HL = 52.5
export const HW = 34

/* ------------------------------------------------------------------ */
/* Rounded-rectangle loops (stands, boards, roof all sweep these)      */
/* ------------------------------------------------------------------ */

export interface LoopPt {
  x: number
  z: number
  nx: number
  nz: number
}

export function makeLoop(hx: number, hz: number, r: number, arcSeg = 8): LoopPt[] {
  const corners = [
    { cx: hx - r, cz: hz - r, a0: Math.PI / 2, a1: 0 },
    { cx: hx - r, cz: -(hz - r), a0: 0, a1: -Math.PI / 2 },
    { cx: -(hx - r), cz: -(hz - r), a0: -Math.PI / 2, a1: -Math.PI },
    { cx: -(hx - r), cz: hz - r, a0: Math.PI, a1: Math.PI / 2 },
  ]
  const pts: LoopPt[] = []
  for (const c of corners) {
    for (let i = 0; i <= arcSeg; i++) {
      const a = c.a0 + ((c.a1 - c.a0) * i) / arcSeg
      const nx = Math.cos(a)
      const nz = Math.sin(a)
      pts.push({ x: c.cx + r * nx, z: c.cz + r * nz, nx, nz })
    }
  }
  return pts
}

/** Evenly spaced points along the loop pushed out by distance d. */
export function sampleLoop(loop: LoopPt[], d: number, spacing: number): LoopPt[] {
  const out: LoopPt[] = []
  const n = loop.length
  let carry = 0
  for (let i = 0; i < n; i++) {
    const a = loop[i]
    const b = loop[(i + 1) % n]
    const ax = a.x + a.nx * d
    const az = a.z + a.nz * d
    const bx = b.x + b.nx * d
    const bz = b.z + b.nz * d
    const len = Math.hypot(bx - ax, bz - az)
    let s = carry
    while (s < len) {
      const t = s / len
      const nx = a.nx + (b.nx - a.nx) * t
      const nz = a.nz + (b.nz - a.nz) * t
      const nl = Math.hypot(nx, nz) || 1
      out.push({ x: ax + (bx - ax) * t, z: az + (bz - az) * t, nx: nx / nl, nz: nz / nl })
      s += spacing
    }
    carry = s - len
  }
  return out
}

/** Quad strip between (dA,yA) and (dB,yB) swept around the loop. u runs by arc length / tile. */
export function strip(loop: LoopPt[], dA: number, yA: number, dB: number, yB: number, tile = 1): THREE.BufferGeometry {
  const n = loop.length
  const pos: number[] = []
  const uv: number[] = []
  const idx: number[] = []
  let cum = 0
  for (let j = 0; j <= n; j++) {
    const p = loop[j % n]
    if (j > 0) {
      const q = loop[(j - 1) % n]
      cum += Math.hypot(p.x + p.nx * dA - (q.x + q.nx * dA), p.z + p.nz * dA - (q.z + q.nz * dA))
    }
    pos.push(p.x + p.nx * dA, yA, p.z + p.nz * dA, p.x + p.nx * dB, yB, p.z + p.nz * dB)
    uv.push(cum / tile, 0, cum / tile, 1)
    if (j > 0) {
      const a = (j - 1) * 2
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/* ------------------------------------------------------------------ */
/* Bowl                                                                */
/* ------------------------------------------------------------------ */

export interface SeatRow {
  d: number
  y: number
  upper: boolean
}

export const BOWL_START = 3.6
export const ROOF_Y = 25

export function buildBowl(loop: LoopPt[]) {
  const profile: [number, number][] = []
  const rows: SeatRow[] = []
  let d = BOWL_START
  let y = 0
  profile.push([d, y])
  const step = (rise: number, run: number, seat: boolean, upper: boolean) => {
    y += rise
    profile.push([d, y])
    if (seat) rows.push({ d: d + run * 0.5, y, upper })
    d += run
    profile.push([d, y])
  }
  for (let i = 0; i < 12; i++) step(0.4, 0.82, true, false)
  step(1.4, 3.2, false, false)
  for (let i = 0; i < 14; i++) step(0.58, 0.8, true, true)
  profile.push([d, ROOF_Y])
  const outerD = d

  const tread = new THREE.Color('#2b3b33')
  const riser = new THREE.Color('#16201b')
  const wall = new THREE.Color('#0f1612')
  const pos: number[] = []
  const col: number[] = []
  const n = loop.length
  for (let j = 0; j < n; j++) {
    const p = loop[j]
    const q = loop[(j + 1) % n]
    for (let k = 0; k < profile.length - 1; k++) {
      const [d0, y0] = profile[k]
      const [d1, y1] = profile[k + 1]
      const A = [p.x + p.nx * d0, y0, p.z + p.nz * d0]
      const B = [q.x + q.nx * d0, y0, q.z + q.nz * d0]
      const C = [q.x + q.nx * d1, y1, q.z + q.nz * d1]
      const D = [p.x + p.nx * d1, y1, p.z + p.nz * d1]
      pos.push(...A, ...B, ...C, ...A, ...C, ...D)
      const isTread = k % 2 === 1 && k < profile.length - 2
      const c = k === profile.length - 2 ? wall : isTread ? tread : riser
      for (let v = 0; v < 6; v++) col.push(c.r, c.g, c.b)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.computeVertexNormals()
  return { geometry: g, rows, outerD }
}

/* ------------------------------------------------------------------ */
/* Canvas textures                                                     */
/* ------------------------------------------------------------------ */

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return { c, g: c.getContext('2d')! }
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makePitchTexture(size = 2048): THREE.CanvasTexture {
  const W = size
  const H = Math.round((size * 68) / 105)
  const { c, g } = canvas(W, H)
  const mx = W / 105
  const my = H / 68
  const bands = 14
  for (let i = 0; i < bands; i++) {
    g.fillStyle = i % 2 ? '#1a6531' : '#217438'
    g.fillRect((i * W) / bands, 0, W / bands + 1, H)
  }
  const r = rng(7)
  for (let i = 0; i < 26000; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.05)'
    g.fillRect(r() * W, r() * H, 3, 1 + r() * 4)
  }
  // centre emblem, very faint: calm water under a low sun
  g.save()
  g.translate(W / 2, H / 2)
  g.strokeStyle = 'rgba(244,247,236,0.16)'
  g.fillStyle = 'rgba(244,247,236,0.14)'
  g.lineWidth = 7
  g.beginPath()
  g.arc(0, 0, 6.2 * mx, 0, Math.PI * 2)
  g.stroke()
  g.beginPath()
  g.arc(0, -0.8 * mx, 3.4 * mx, Math.PI, 0)
  g.closePath()
  g.fill()
  g.lineCap = 'round'
  for (const oy of [1.1, 2.5]) {
    g.beginPath()
    for (let k = -4; k <= 4; k++) g.lineTo(k * 0.6 * mx, oy * mx + Math.sin(k * 1.3) * 0.28 * mx)
    g.stroke()
  }
  g.restore()

  g.strokeStyle = 'rgba(244,247,236,0.94)'
  g.fillStyle = 'rgba(244,247,236,0.94)'
  g.lineWidth = 4.5
  g.strokeRect(3, 3, W - 6, H - 6)
  g.beginPath()
  g.moveTo(W / 2, 0)
  g.lineTo(W / 2, H)
  g.stroke()
  g.beginPath()
  g.arc(W / 2, H / 2, 9.15 * mx, 0, Math.PI * 2)
  g.stroke()
  g.beginPath()
  g.arc(W / 2, H / 2, 0.35 * mx, 0, Math.PI * 2)
  g.fill()
  for (const side of [0, 1]) {
    const flip = (x: number) => (side ? W - x : x)
    const rect = (x0: number, w: number, y0: number, h: number) => {
      const xa = flip(x0 * mx)
      const xb = flip((x0 + w) * mx)
      g.strokeRect(Math.min(xa, xb), y0 * my, Math.abs(xb - xa), h * my)
    }
    rect(0, 16.5, (68 - 40.32) / 2, 40.32)
    rect(0, 5.5, (68 - 18.32) / 2, 18.32)
    g.beginPath()
    g.arc(flip(11 * mx), H / 2, 0.35 * mx, 0, Math.PI * 2)
    g.fill()
    g.beginPath()
    const a = Math.acos(5.5 / 9.15)
    if (side) g.arc(flip(11 * mx), H / 2, 9.15 * mx, Math.PI - a, Math.PI + a)
    else g.arc(flip(11 * mx), H / 2, 9.15 * mx, -a, a)
    g.stroke()
  }
  for (const [cx, cy, a0] of [
    [0, 0, 0],
    [W, 0, Math.PI / 2],
    [W, H, Math.PI],
    [0, H, -Math.PI / 2],
  ] as const) {
    g.beginPath()
    g.arc(cx, cy, 1 * mx, a0, a0 + Math.PI / 2)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

export function makeNetTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(128, 128)
  g.strokeStyle = 'rgba(255,255,255,0.8)'
  g.lineWidth = 3
  for (let i = 0; i <= 8; i++) {
    const p = (i * 128) / 8
    g.beginPath()
    g.moveTo(p, 0)
    g.lineTo(p, 128)
    g.moveTo(0, p)
    g.lineTo(128, p)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const PHI = (1 + Math.sqrt(5)) / 2

function ballCenters() {
  const pent: THREE.Vector3[] = []
  for (const a of [-1, 1]) {
    for (const b of [-PHI, PHI]) {
      pent.push(new THREE.Vector3(0, a, b), new THREE.Vector3(a, b, 0), new THREE.Vector3(b, 0, a))
    }
  }
  const hex: THREE.Vector3[] = []
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) hex.push(new THREE.Vector3(x, y, z))
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      hex.push(new THREE.Vector3(0, a / PHI, b * PHI), new THREE.Vector3(a / PHI, b * PHI, 0), new THREE.Vector3(a * PHI, 0, b / PHI))
    }
  }
  pent.forEach((v) => v.normalize())
  hex.forEach((v) => v.normalize())
  return { pent, hex }
}

/** Truncated-icosahedron style panels painted per pixel (Voronoi of 12 + 20 cell centres). */
export function makeBallTexture(): THREE.CanvasTexture {
  const W = 768
  const H = 384
  const { c, g } = canvas(W, H)
  const img = g.createImageData(W, H)
  const { pent, hex } = ballCenters()
  const all = [...pent, ...hex]
  const dark = [18, 22, 20]
  const light = [244, 246, 238]
  const seam = [70, 78, 72]
  for (let y = 0; y < H; y++) {
    const phi = ((y + 0.5) / H) * Math.PI
    const sy = Math.cos(phi)
    const sr = Math.sin(phi)
    for (let x = 0; x < W; x++) {
      const th = ((x + 0.5) / W) * Math.PI * 2
      const dx = -Math.cos(th) * sr
      const dz = Math.sin(th) * sr
      let b1 = -2
      let b2 = -2
      let bi = 0
      for (let i = 0; i < all.length; i++) {
        const v = all[i]
        const d = v.x * dx + v.y * sy + v.z * dz
        if (d > b1) {
          b2 = b1
          b1 = d
          bi = i
        } else if (d > b2) b2 = d
      }
      const edge = Math.min(1, Math.max(0, (b1 - b2) / 0.028))
      const base = bi < 12 ? dark : light
      const o = (y * W + x) * 4
      for (let k = 0; k < 3; k++) img.data[o + k] = seam[k] + (base[k] - seam[k]) * edge
      img.data[o + 3] = 255
    }
  }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** LED perimeter board. Redraws once webfonts have landed. */
export function makeBoardTexture(): THREE.CanvasTexture {
  const W = 2048
  const H = 64
  const { c, g } = canvas(W, H)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = THREE.RepeatWrapping
  const draw = () => {
    g.fillStyle = '#04100a'
    g.fillRect(0, 0, W, H)
    g.font = '900 40px "Anybody Variable", "Arial Black", sans-serif'
    g.textBaseline = 'middle'
    const words = [
      'FOOTONOMY SHOWCASE',
      'REAL MADRID CF',
      'FC BARCELONA',
      'MANCHESTER CITY',
      'SANTIAGO BERNABÉU',
      'LIVERPOOL FC',
      'BAYERN MÜNCHEN',
      'ARSENAL FC',
      'PARIS SAINT-GERMAIN',
    ]
    let x = 24
    let i = 0
    while (x < W) {
      const w = words[i % words.length]
      g.fillStyle = i % 2 ? '#f2f6ea' : '#d4ff3c'
      g.fillText(w, x, H / 2 + 2)
      x += g.measureText(w).width + 56
      g.fillStyle = i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#a50044' : '#6cabdd'
      g.fillRect(x - 36, H / 2 - 6, 12, 12)
      i++
    }
    t.needsUpdate = true
  }
  draw()
  if (typeof document !== 'undefined' && document.fonts?.load) {
    document.fonts.load('900 40px "Anybody Variable"').then(draw).catch(() => {})
  }
  return t
}

export function makeLampTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(128, 64)
  g.fillStyle = '#20262a'
  g.fillRect(0, 0, 128, 64)
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.arc(8 + i * 16, 8 + j * 16, 5.500, 0, Math.PI * 2)
      g.fill()
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
