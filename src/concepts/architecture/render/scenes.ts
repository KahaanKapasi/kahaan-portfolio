import { Cam, box, castOnPlane, clipHalf, drawScene, hex, mirrorY, quad, archPts, rectPts, rng, softPatch, v, rgbCss, type Face, type RGB, type Scene, type V3 } from './engine'

const warm: RGB = [255, 222, 160]

function flat(ctx: CanvasRenderingContext2D, w: number, h: number, c: string) {
  ctx.fillStyle = c
  ctx.fillRect(0, 0, w, h)
}

/** A shell for an interior hall. Wall planes are x = +-W, z from 0 to D. */
function hall(W: number, H: number, D: number, cols: { floor: RGB; wallL: RGB; wallR: RGB; ceil: RGB; back: RGB }, lHoles: V3[][], rHoles: V3[][], backHoles: V3[][] = []): Face[] {
  return [
    quad([-W, 0, 0], [W, 0, 0], [W, 0, D], [-W, 0, D], cols.floor, { lit: 0.82 }),
    quad([-W, H, 0], [W, H, 0], [W, H, D], [-W, H, D], cols.ceil, { lit: 0.55 }),
    { p: [[-W, 0, 0], [-W, 0, D], [-W, H, D], [-W, H, 0]], c: cols.wallL, holes: lHoles, lit: 0.6 },
    { p: [[W, 0, 0], [W, 0, D], [W, H, D], [W, H, 0]], c: cols.wallR, holes: rHoles, lit: 0.58 },
    { p: [[-W, 0, D], [W, 0, D], [W, H, D], [-W, H, D]], c: cols.back, holes: backHoles, lit: 0.75 },
  ]
}

/* ---------------------------------------------------------------- 1 */
function quarryHouse(): Scene {
  const W = 3.2
  const H = 5.2
  const D = 36
  const sun = v.norm([0.62, -0.5, 0.4])
  const lHoles: V3[][] = []
  const glass: Face[] = []
  const patches: Face[] = []
  const origin: V3 = [-W, 0, 0]
  for (let i = 0; i < 6; i++) {
    const z = 5.5 + i * 5.2
    const hole = rectPts(origin, [0, 0, 1], [0, 1, 0], z, 0.55, z + 0.95, 4.5)
    lHoles.push(hole)
    glass.push(quad(...(rectPts([-W - 0.5, 0, 0], [0, 0, 1], [0, 1, 0], z - 0.4, 0.2, z + 1.4, 5.2) as [V3, V3, V3, V3]), [255, 244, 222], { emissive: true, layer: 0, grad: [[255, 252, 240], [240, 220, 180]] as [RGB, RGB], bloom: 0.5 }))
    const fp = clipHalf(castOnPlane(hole, sun, [0, 0, 0], [0, 1, 0]), [W, 0, 0], [-1, 0, 0])
    patches.push(...softPatch(fp, warm, 0.95, 2))
    const wp = clipHalf(castOnPlane(hole, sun, [W, 0, 0], [1, 0, 0]), [0, 0, 0], [0, 1, 0])
    patches.push(...softPatch(wp, warm, 0.8, 2))
  }
  const door = rectPts([0, 0, D], [1, 0, 0], [0, 1, 0], -1.3, 0, 1.3, 3.9)
  const backGlass = quad(...(rectPts([0, 0, D + 0.6], [1, 0, 0], [0, 1, 0], -2, -0.2, 2, 4.4) as [V3, V3, V3, V3]), [255, 255, 255], { emissive: true, layer: 0, grad: [[236, 240, 232], [196, 206, 170]] as [RGB, RGB], bloom: 0.8 })
  const faces: Face[] = [
    ...glass,
    backGlass,
    ...hall(W, H, D, { floor: hex('#9a8670'), wallL: hex('#bba790'), wallR: hex('#ae9b85'), ceil: hex('#b8a891'), back: hex('#97877a') }, lHoles, [], [door]),
    ...patches,
    ...box([W - 1.1, 0, 10], [W - 0.15, 0.46, 19], { top: hex('#d4cdc0'), side: hex('#aaa296') }),
    ...box([-1.4, 0, 14.5], [-0.7, 0.42, 15.2], hex('#3f3a34')),
    ...box([-1.4, 0.42, 14.5], [-1.34, 0.95, 15.2], hex('#3f3a34')),
  ]
  return {
    eye: [0.5, 1.65, -0.8], target: [-0.1, 2.0, 20], fov: 62, sun, amb: 0.9, diff: 0.2,
    fog: { c: hex('#a8927a'), d: 0.02 },
    sky: (ctx, w, h) => flat(ctx, w, h, '#a8927a'),
    faces, grain: 0.1, vignette: 0.32, seed: 11,
  }
}

/* ---------------------------------------------------------------- 2 */
function cloisterLibrary(): Scene {
  const W = 4.2
  const H = 8
  const D = 38
  const sun = v.norm([-0.55, -0.55, 0.42])
  const rHoles: V3[][] = []
  const glass: Face[] = []
  const patches: Face[] = []
  for (let i = 0; i < 7; i++) {
    const z = 4.2 + i * 5
    const hole = archPts([W, 0, 0], [0, 0, 1], [0, 1, 0], z + 1.5, 3, 0, 3.6)
    rHoles.push(hole)
    glass.push(quad(...(rectPts([W + 0.5, 0, 0], [0, 0, 1], [0, 1, 0], z - 0.4, 0, z + 3.4, 6.2) as [V3, V3, V3, V3]), [255, 241, 207], { emissive: true, layer: 0, grad: [[255, 250, 232], [244, 214, 160]] as [RGB, RGB], bloom: 0.6 }))
    const fp = clipHalf(castOnPlane(hole, sun, [0, 0, 0], [0, 1, 0]), [-W, 0, 0], [1, 0, 0])
    patches.push(...softPatch(fp, [255, 214, 150], 0.75, 2))
    const wp = clipHalf(castOnPlane(hole, sun, [-W, 0, 0], [-1, 0, 0]), [0, 0, 0], [0, 1, 0])
    patches.push(...softPatch(wp, [255, 214, 150], 0.5, 2))
  }
  const rnd = rng(5)
  const shelf: Face[] = []
  const bookCols = ['#5b2f2a', '#3a4a3c', '#7a5a34', '#2f3b4a', '#8a6b4a', '#4c3a2e', '#6b3a3a', '#a0865a', '#33424a']
  for (let row = 0; row < 11; row++) {
    const y0 = 0.35 + row * 0.62
    let z = 0.4
    while (z < D - 0.5) {
      const run = 0.5 + rnd() * 1.2
      const bh = 0.38 + rnd() * 0.18
      const c = hex(bookCols[Math.floor(rnd() * bookCols.length)])
      shelf.push(quad([-W + 0.03, y0, z], [-W + 0.03, y0, z + run], [-W + 0.03, y0 + bh, z + run], [-W + 0.03, y0 + bh, z], c, { lit: 0.68 + rnd() * 0.12 }))
      z += run + 0.05
    }
    shelf.push(quad([-W + 0.03, y0 - 0.06, 0.3], [-W + 0.03, y0 - 0.06, D], [-W + 0.03, y0 - 0.01, D], [-W + 0.03, y0 - 0.01, 0.3], hex('#2a1d15'), { lit: 0.7 }))
  }
  const tiles: Face[] = []
  for (let zi = 0; zi < D / 2; zi++) for (let xi = 0; xi < 4; xi++) {
    const x0 = -W + xi * 2.1
    tiles.push(quad([x0, 0, zi * 2], [x0 + 2.1, 0, zi * 2], [x0 + 2.1, 0, zi * 2 + 2], [x0, 0, zi * 2 + 2], (xi + zi) % 2 ? hex('#a8a193') : hex('#938c7f'), { lit: 0.95, layer: 1, bias: 100 }))
  }
  const furniture: Face[] = []
  for (let k = 0; k < 3; k++) {
    const z0 = 14 + k * 7.5
    furniture.push(...box([-1.0, 0, z0], [1.0, 0.78, z0 + 5.5], { top: hex('#6a4a30'), side: hex('#3d2a1c') }, { layer: 3 }))
    furniture.push(quad([-0.15, 0.8, z0 + 1.5], [0.15, 0.8, z0 + 1.5], [0.15, 1.05, z0 + 1.5], [-0.15, 1.05, z0 + 1.5], [60, 130, 90], { emissive: true, layer: 3, bloom: 0.9 }))
    furniture.push(quad([-0.15, 0.8, z0 + 4], [0.15, 0.8, z0 + 4], [0.15, 1.05, z0 + 4], [-0.15, 1.05, z0 + 4], [60, 130, 90], { emissive: true, layer: 3, bloom: 0.9 }))
  }
  const faces: Face[] = [
    ...glass,
    ...hall(W, H, D, { floor: hex('#9d968a'), wallL: hex('#3b2c22'), wallR: hex('#cdbd9f'), ceil: hex('#d8caa9'), back: hex('#c8b793') }, [], rHoles, [archPts([0, 0, D], [1, 0, 0], [0, 1, 0], 0, 3.4, 0, 3.8)]),
    quad(...(rectPts([0, 0, D + 0.5], [1, 0, 0], [0, 1, 0], -3, 0, 3, 7) as [V3, V3, V3, V3]), [255, 240, 200], { emissive: true, layer: 0, grad: [[255, 250, 232], [250, 220, 170]] as [RGB, RGB], bloom: 0.9 }),
    ...tiles,
    ...shelf.map((f) => ({ ...f, layer: 1, bias: -0.05 })),
    ...patches,
    ...furniture,
  ]
  return {
    eye: [0.3, 1.75, -0.8], target: [-0.1, 2.9, 22], fov: 66, sun, amb: 0.95, diff: 0.2,
    fog: { c: hex('#d9c9a6'), d: 0.02 },
    sky: (ctx, w, h) => flat(ctx, w, h, '#d9c9a6'),
    faces, grain: 0.1, vignette: 0.38, seed: 3,
  }
}

/* ---------------------------------------------------------------- 3 */
function terraceHouses(): Scene {
  const sun = v.norm([0.6, -0.28, 0.72])
  const faces: Face[] = []
  const pal = ['#a15f40', '#c99b5c', '#8f9d86', '#d6cbb0', '#a86d4e']
  const heights = [10.6, 11.4, 10.6, 11.9, 10.8]
  let x = -10
  const bw = 5.6
  const rnd = rng(9)
  heights.forEach((H, i) => {
    const x0 = x
    const x1 = x + bw
    const base = hex(pal[i])
    faces.push(...box([x0, 0, 0], [x1, H, 9], { top: [120, 112, 100], side: base, front: base }))
    for (let col = 0; col < 2; col++) for (let row = 0; row < 3; row++) {
      const wx = x0 + 0.85 + col * 2.35
      const wy = 3.0 + row * 2.6
      const lit = rnd() > 0.7
      faces.push(quad([wx - 0.08, wy - 0.08, -0.03], [wx + 1.48, wy - 0.08, -0.03], [wx + 1.48, wy + 1.93, -0.03], [wx - 0.08, wy + 1.93, -0.03], [236, 228, 208], { lit: 0.95, layer: 2 }))
      faces.push(quad([wx, wy, -0.06], [wx + 1.4, wy, -0.06], [wx + 1.4, wy + 1.85, -0.06], [wx, wy + 1.85, -0.06], [255, 255, 255], { emissive: true, layer: 2, grad: lit ? ([[255, 226, 160], [255, 190, 110]] as [RGB, RGB]) : ([[150, 176, 190], [214, 204, 180]] as [RGB, RGB]), bloom: lit ? 0.5 : 0 }))
    }
    faces.push(quad([x0 + 1.9, 0, -0.04], [x0 + 3.4, 0, -0.04], [x0 + 3.4, 2.5, -0.04], [x0 + 1.9, 2.5, -0.04], hex('#2c2a27'), { lit: 0.9, layer: 2 }))
    faces.push(...box([x0 + 1.5, 0, -1.1], [x0 + 3.8, 0.3, 0], hex('#b4aca0'), { layer: 2 }))
    faces.push(...box([x0 - 0.05, H, -0.2], [x1 + 0.05, H + 0.5, 9.2], hex('#cfc7b8')))
    if (i % 2 === 0) faces.push(...box([x0 + 3.7, H + 0.5, 6.2], [x0 + 4.7, H + 2.4, 7.4], hex('#8f5a42')))
    x = x1
  })
  faces.push(quad([-90, 0, -60], [90, 0, -60], [90, 0, 90], [-90, 0, 90], hex('#6a645c'), { lit: 0.9, layer: 0 }))
  faces.push(quad([-40, 0.01, -5.6], [60, 0.01, -5.6], [60, 0.01, -2], [-40, 0.01, -2], hex('#9a9184'), { lit: 0.95, layer: 1 }))
  return {
    eye: [-9, 1.7, -17], target: [2.2, 6.2, 2], fov: 58, sun, amb: 0.5, diff: 0.62,
    fog: { c: hex('#e6c39c'), d: 0.008 },
    sky: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#6f93a8')
      g.addColorStop(0.55, '#d9b99b')
      g.addColorStop(1, '#f0c58f')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const s = ctx.createRadialGradient(w * 0.92, h * 0.72, 0, w * 0.92, h * 0.72, w * 0.7)
      s.addColorStop(0, 'rgba(255,230,170,0.85)')
      s.addColorStop(1, 'rgba(255,230,170,0)')
      ctx.fillStyle = s
      ctx.fillRect(0, 0, w, h)
    },
    faces, grain: 0.09, vignette: 0.3, seed: 21,
  }
}

/* ---------------------------------------------------------------- 4 */
function saltPavilion(): Scene {
  const sun = v.norm([0.08, -0.1, -1])
  const pav: Face[] = []
  const stone = hex('#c9c2b4')
  const dark = hex('#4b4943')
  pav.push(...box([-11, 0, 3], [11, 0.4, 16], { top: stone, side: dark }))
  pav.push(...box([-9.5, 5.3, 4], [9.5, 5.8, 15], { top: hex('#d8d1c2'), side: dark, front: hex('#6e6a60') }))
  for (const zc of [5, 14]) for (let i = 0; i < 6; i++) {
    const cx = -8.5 + i * 3.4
    pav.push(...box([cx - 0.18, 0.4, zc - 0.18], [cx + 0.18, 5.3, zc + 0.18], { top: dark, side: hex('#58554e'), front: hex('#3a3833') }))
  }
  pav.push(...box([-9.4, 0.4, 15.2], [9.4, 3.8, 15.6], { top: dark, side: dark, front: hex('#2f2d29') }))
  pav.push(quad([-2.2, 0.5, 15.1], [2.2, 0.5, 15.1], [2.2, 3.5, 15.1], [-2.2, 3.5, 15.1], [255, 214, 150], { emissive: true, layer: 3, grad: [[255, 236, 190], [244, 170, 100]] as [RGB, RGB], bloom: 2.5 }))
  const pans: Face[] = []
  for (let i = 0; i < 16; i++) {
    const z0 = 40 + i * i * 1.4
    pans.push(quad([-200, 0.02, z0], [200, 0.02, z0], [200, 0.02, z0 + 5 + i * 1.2], [-200, 0.02, z0 + 5 + i * 1.2], i % 2 ? [236, 190, 160] : [214, 150, 130], { emissive: true, alpha: 0.5, layer: 1, noFog: true }))
  }
  const water = quad([-300, 0, -40], [300, 0, -40], [300, 0, 500], [-300, 0, 500], hex('#2a4650'), { lit: 1, layer: 0, noFog: true })
  const sheen = quad([-300, 0, -40], [300, 0, -40], [300, 0, 500], [-300, 0, 500], [60, 100, 110], { emissive: true, alpha: 0.28, layer: 2, noFog: true })
  const faces: Face[] = [water, ...pans, ...mirrorY(pav, [40, 70, 80], 0.55, 1), sheen, ...pav.map((f) => ({ ...f, layer: f.layer ?? 3 }))]
  return {
    eye: [0, 1.5, -28], target: [0, 3.0, 0], fov: 42, sun, amb: 0.6, diff: 0.55,
    fog: { c: hex('#e6b995'), d: 0.004 },
    sky: (ctx, w, h, cam: Cam) => {
      const hz = cam.project([0, 1.5, 1000])[1]
      const g = ctx.createLinearGradient(0, 0, 0, hz)
      g.addColorStop(0, '#2f5560')
      g.addColorStop(0.6, '#c99a86')
      g.addColorStop(1, '#f6c391')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const sx = w * 0.5
      const sy = hz - h * 0.04
      const s = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.75)
      s.addColorStop(0, 'rgba(255,238,200,0.95)')
      s.addColorStop(0.25, 'rgba(255,200,140,0.5)')
      s.addColorStop(1, 'rgba(255,200,140,0)')
      ctx.fillStyle = s
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,248,230,0.95)'
      ctx.beginPath()
      ctx.arc(sx, sy, w * 0.022, 0, Math.PI * 2)
      ctx.fill()
    },
    post: (ctx, w, _h, cam) => {
      const hz = cam.project([0, 1.5, 1000])[1]
      const g = ctx.createLinearGradient(0, hz - 4, 0, hz + 40)
      g.addColorStop(0, 'rgba(255,230,190,0.5)')
      g.addColorStop(1, 'rgba(255,230,190,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, hz - 4, w, 44)
    },
    faces, grain: 0.09, vignette: 0.34, seed: 17,
  }
}

/* ---------------------------------------------------------------- 5 */
function tidelineTower(): Scene {
  const sun = v.norm([0.7, -0.22, 0.62])
  const faces: Face[] = []
  const rnd = rng(31)
  const concrete = hex('#cfc8ba')
  const T = { x0: -6, x1: 6, z0: 0, z1: 8, H: 44 }
  faces.push(...box([T.x0, 0, T.z0], [T.x1, T.H, T.z1], { top: [190, 182, 170], side: concrete, front: concrete }))
  const floors = 22
  for (let f = 0; f < floors; f++) {
    const y = 1.2 + f * 2
    for (let b = 0; b < 5; b++) {
      const x0 = T.x0 + 0.3 + b * 2.35
      const lit = rnd() > 0.45
      faces.push(quad([x0, y + 0.1, -0.03], [x0 + 1.75, y + 0.1, -0.03], [x0 + 1.75, y + 1.55, -0.03], [x0, y + 1.55, -0.03], [255, 255, 255], { emissive: true, layer: 2, grad: lit ? ([[255, 228, 164], [255, 184, 100]] as [RGB, RGB]) : ([[64, 92, 104], [38, 58, 68]] as [RGB, RGB]), bloom: lit ? 0.25 : 0 }))
    }
    for (let b = 0; b < 3; b++) {
      const z0 = 1.1 + b * 2.4
      const lit = rnd() > 0.5
      faces.push(quad([T.x1 + 0.03, y + 0.1, z0], [T.x1 + 0.03, y + 0.1, z0 + 1.7], [T.x1 + 0.03, y + 1.55, z0 + 1.7], [T.x1 + 0.03, y + 1.55, z0], [255, 255, 255], { emissive: true, layer: 2, grad: lit ? ([[255, 214, 150], [235, 160, 90]] as [RGB, RGB]) : ([[52, 76, 88], [30, 48, 58]] as [RGB, RGB]) }))
    }
    if (rnd() > 0.4) {
      const bx = T.x0 + Math.floor(rnd() * 3) * 2.35
      faces.push(...box([bx, y - 0.15, -1.3], [bx + 4.6, y + 0.0, 0], { top: hex('#e6dfd2'), side: hex('#a9a193'), front: hex('#bdb5a6') }, { layer: 3 }))
      faces.push(quad([bx, y, -1.3], [bx + 4.6, y, -1.3], [bx + 4.6, y + 1.0, -1.3], [bx, y + 1.0, -1.3], [50, 54, 56], { lit: 1, alpha: 0.35, layer: 3 }))
    }
  }
  faces.push(...box([-18, 0, -14], [-6, 7, -5], hex('#2b3a40')))
  faces.push(...box([8, 0, -10], [20, 4, -3], hex('#2a3338')))
  faces.push(...box([-4, 0, -9], [3, 2.2, -4], hex('#303d42')))
  faces.push(quad([-200, 0, -80], [200, 0, -80], [200, 0, 200], [-200, 0, 200], hex('#1d2a30'), { lit: 1, layer: 0 }))
  return {
    eye: [11, 1.6, -27], target: [1, 19, 0], fov: 66, sun, amb: 0.55, diff: 0.6,
    fog: { c: hex('#e0a778'), d: 0.006 },
    sky: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#1f3b4b')
      g.addColorStop(0.5, '#5e7c85')
      g.addColorStop(1, '#eba46d')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    },
    faces, grain: 0.1, vignette: 0.36, seed: 13,
  }
}

/* ---------------------------------------------------------------- 6 */
function longRoom(): Scene {
  const W = 3.8
  const H = 4.6
  const D = 32
  const sun = v.norm([-0.3, -0.5, 0.5])
  const rHoles: V3[][] = []
  const glass: Face[] = []
  for (let i = 0; i < 6; i++) {
    const z = 3.5 + i * 4.8
    rHoles.push(rectPts([W, 0, 0], [0, 0, 1], [0, 1, 0], z, 0.6, z + 3.2, 3.9))
    glass.push(quad(...(rectPts([W + 0.5, 0, 0], [0, 0, 1], [0, 1, 0], z - 0.5, 0.3, z + 3.7, 4.4) as [V3, V3, V3, V3]), [255, 255, 255], { emissive: true, layer: 0, grad: [[48, 84, 98], [226, 150, 96]] as [RGB, RGB], bloom: 0.2 }))
  }
  const slats: Face[] = []
  for (let i = 0; i < 90; i++) {
    const z0 = i * (D / 90)
    slats.push(quad([-W + 0.02, 0, z0], [-W + 0.02, 0, z0 + 0.22], [-W + 0.02, H, z0 + 0.22], [-W + 0.02, H, z0], i % 2 ? hex('#4a3a2c') : hex('#3b2e24'), { lit: 0.9, layer: 1, bias: -0.05 }))
  }
  const planks: Face[] = []
  for (let i = 0; i < 12; i++) {
    const x0 = -W + (i * 2 * W) / 12
    planks.push(quad([x0, 0, 0], [x0 + (2 * W) / 12, 0, 0], [x0 + (2 * W) / 12, 0, D], [x0, 0, D], i % 2 ? hex('#6a4630') : hex('#5d3d29'), { lit: 0.9, layer: 1, bias: 200 }))
  }
  const beams: Face[] = []
  for (let z = 2; z < D; z += 3) beams.push(...box([-W, H - 0.45, z], [W, H, z + 0.3], hex('#2d241d'), { layer: 3 }))
  const table: Face[] = box([-0.75, 0, 6], [0.75, 0.78, D - 3], { top: hex('#b8a68a'), side: hex('#5a4634') }, { layer: 3 })
  const chairs: Face[] = []
  for (let i = 0; i < 10; i++) {
    const z = 7 + i * 2.5
    for (const sx of [-1, 1]) {
      const x0 = sx > 0 ? 0.95 : -1.45
      chairs.push(...box([x0, 0, z], [x0 + 0.5, 0.48, z + 0.5], { top: hex('#7c5a3a'), side: hex('#3f2e21'), front: hex('#3f2e21') }, { layer: 3 }))
      const bx = sx > 0 ? x0 + 0.45 : x0
      chairs.push(...box([bx, 0.48, z], [bx + 0.05, 1.05, z + 0.5], hex('#3f2e21'), { layer: 3 }))
    }
  }
  const lamps: Face[] = []
  for (let i = 0; i < 7; i++) {
    const z = 6 + i * 3.8
    lamps.push(quad([-0.2, 3.1, z], [0.2, 3.1, z], [0.2, 3.3, z], [-0.2, 3.3, z], [255, 214, 140], { emissive: true, layer: 4, bloom: 0.9, grad: [[255, 236, 190], [255, 190, 110]] as [RGB, RGB] }))
    lamps.push(quad([-0.01, 3.28, z], [0.01, 3.28, z], [0.01, H - 0.4, z], [-0.01, H - 0.4, z], [20, 18, 16], { emissive: true, layer: 4 }))
    lamps.push(quad([-0.12, 0.8, z + 0.3], [0.12, 0.8, z + 0.3], [0.12, 0.98, z + 0.3], [-0.12, 0.98, z + 0.3], [255, 190, 110], { emissive: true, layer: 4, bloom: 0.25 }))
  }
  const faces: Face[] = [
    ...glass,
    ...hall(W, H, D, { floor: hex('#5d3d29'), wallL: hex('#3b2e24'), wallR: hex('#2d2a28'), ceil: hex('#2b231d'), back: hex('#2d2622') }, [], rHoles),
    ...planks, ...slats, ...beams, ...table, ...chairs, ...lamps,
  ]
  return {
    eye: [0, 1.55, -0.8], target: [0, 1.7, 20], fov: 62, sun, amb: 0.82, diff: 0.15,
    fog: { c: hex('#1b1411'), d: 0.04 },
    sky: (ctx, w, h) => flat(ctx, w, h, '#1b1411'),
    post: (ctx, w, h) => {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.7)
      g.addColorStop(0, 'rgba(255,190,110,0.16)')
      g.addColorStop(1, 'rgba(255,190,110,0)')
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
    },
    faces, grain: 0.12, vignette: 0.45, seed: 29,
  }
}

export type Project = {
  id: string
  name: string
  kind: string
  place: string
  year: string
  area: string
  note: string
  scene: () => Scene
  /** Colour used for text on the photo caption when needed. */
  tone: string
}

export const PROJECTS: Project[] = [
  { id: 'quarry', name: 'House at the Quarry Edge', kind: 'Private house', place: 'Marsh Hollow', year: '2024', area: '310 m2', note: 'A long concrete gallery with slot windows that let the sun walk across the floor.', scene: quarryHouse, tone: '#d9d0c0' },
  { id: 'cloister', name: 'Cloister Library', kind: 'Public library', place: 'Saltgrave', year: '2023', area: '2,150 m2', note: 'An arcade of arched openings wraps a reading hall, so every table gets a ribbon of daylight.', scene: cloisterLibrary, tone: '#dcc9a0' },
  { id: 'terrace', name: 'Lowmarket Terrace', kind: 'Housing', place: 'Lowmarket', year: '2022', area: '1,480 m2', note: 'Four narrow homes in brick and lime, each with a double-height room facing the street.', scene: terraceHouses, tone: '#e8c39b' },
  { id: 'pavilion', name: 'Salt Works Pavilion', kind: 'Public pavilion', place: 'Saltgrave Flats', year: '2024', area: '640 m2', note: 'A thin roof on slender columns, floating over a shallow pool at the edge of the old salt pans.', scene: saltPavilion, tone: '#f0bf93' },
  { id: 'tideline', name: 'Tideline Apartments', kind: 'Residential tower', place: 'Harbour Reach', year: '2025', area: '9,800 m2', note: 'Staggered balconies break a slender tower into a stack of small porches facing the water.', scene: tidelineTower, tone: '#e5a572' },
  { id: 'longroom', name: 'The Long Room', kind: 'Restaurant interior', place: 'Old Foundry Yard', year: '2023', area: '420 m2', note: 'One table, one timber ceiling, and lamps hung low enough to hold the conversation together.', scene: longRoom, tone: '#e7b57c' },
]

export function renderProject(index: number, canvas: HTMLCanvasElement, w: number, h: number) {
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  drawScene(ctx, w, h, PROJECTS[index].scene())
}

export { rgbCss }
