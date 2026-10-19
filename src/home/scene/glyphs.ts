/** Constructed-bar letterforms for the home WebGL wordmark. Local units: 1 tall. */

export type Bar = {
  x: number
  y: number
  z: number
  w: number
  h: number
  d: number
  rz: number
}

const ST = 0.13
const D = 0.38
const H = 1

function bar(x: number, y: number, w: number, h: number, rz = 0, d = D): Bar {
  return { x, y, z: 0, w, h, d, rz }
}

const GLYPHS: Record<string, Bar[]> = {
  K: [
    bar(-0.34, 0, ST, H),
    bar(0.1, 0.28, 0.72, ST, 0.62),
    bar(0.1, -0.28, 0.72, ST, -0.62),
  ],
  A: [
    bar(-0.22, 0, ST, H, -0.2),
    bar(0.22, 0, ST, H, 0.2),
    bar(0, -0.08, 0.5, ST),
  ],
  H: [bar(-0.32, 0, ST, H), bar(0.32, 0, ST, H), bar(0, 0, 0.64, ST)],
  N: [bar(-0.34, 0, ST, H), bar(0.34, 0, ST, H), bar(0, 0, 1.2, ST, -0.97)],
  P: [bar(-0.32, 0, ST, H), bar(0.02, 0.32, 0.5, ST), bar(0.02, 0.04, 0.5, ST), bar(0.28, 0.18, ST, 0.4)],
  S: [
    bar(0.04, 0.4, 0.62, ST),
    bar(0, 0, 0.58, ST),
    bar(-0.04, -0.4, 0.62, ST),
    bar(-0.28, 0.22, ST, 0.32),
    bar(0.28, -0.22, ST, 0.32),
  ],
  I: [bar(0, 0, ST, H)],
}

const ADVANCE = 0.96

/**
 * Lay a word out in bars. `advance` is the centre-to-centre letter step (before scale),
 * so a small word can be tracked out to match the width of a big one.
 */
export function layoutWord(word: string, originY = 0, scale = 1, advance = ADVANCE): Bar[] {
  const chars = word.split('')
  const step = advance * scale
  const width = (chars.length - 1) * step
  const left = -width / 2
  const out: Bar[] = []
  chars.forEach((ch, i) => {
    const glyph = GLYPHS[ch]
    if (!glyph) return
    const ox = left + i * step
    for (const g of glyph) {
      out.push({
        x: ox + g.x * scale,
        y: originY + g.y * scale,
        z: g.z * scale,
        w: g.w * scale,
        h: g.h * scale,
        d: g.d * scale,
        rz: g.rz,
      })
    }
  })
  return out
}

export type Lockup = {
  bars: Bar[]
  /** Bounding box of the whole lockup in local units. */
  width: number
  height: number
  /** Vertical centre of the lockup. */
  cy: number
}

function measure(bars: Bar[]): Lockup {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const b of bars) {
    const hw = (Math.abs(Math.cos(b.rz)) * b.w + Math.abs(Math.sin(b.rz)) * b.h) / 2
    const hh = (Math.abs(Math.sin(b.rz)) * b.w + Math.abs(Math.cos(b.rz)) * b.h) / 2
    minX = Math.min(minX, b.x - hw)
    maxX = Math.max(maxX, b.x + hw)
    minY = Math.min(minY, b.y - hh)
    maxY = Math.max(maxY, b.y + hh)
  }
  return { bars, width: maxX - minX, height: maxY - minY, cy: (minY + maxY) / 2 }
}

/** Landscape lockup: KAHAAN on one line, KAPASI tracked out beneath it to the same width. */
function wide(): Lockup {
  const big = layoutWord('KAHAAN', 0.2, 1.1)
  const span = 5 * ADVANCE * 1.1
  const small = layoutWord('KAPASI', -0.86, 0.34, span / (5 * 0.34))
  return measure([...big, ...small])
}

/** Portrait lockup for phones: KAH / AAN stacked, KAPASI tracked beneath. */
function stacked(): Lockup {
  const top = layoutWord('KAH', 0.92, 1.0)
  const mid = layoutWord('AAN', -0.36, 1.0)
  const span = 2 * ADVANCE
  const small = layoutWord('KAPASI', -1.42, 0.3, span / (5 * 0.3))
  return measure([...top, ...mid, ...small])
}

export const LOCKUP_WIDE = wide()
export const LOCKUP_STACKED = stacked()
