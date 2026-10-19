import type { ConceptKey } from '../data'

/**
 * Card art for the concept showpiece, drawn in code (no image files, no club or maker marks).
 * The same painter feeds the WebGL card textures and the 2D canvases on phones.
 */
export const ART_W = 720
export const ART_H = 960

const DISPLAY = '"Saira Variable", "Saira", "Arial Narrow", sans-serif'
const SANS = '"Onest Variable", "Onest", system-ui, sans-serif'

type Spec = {
  name: string
  line: string
  ink: string
  mute: string
  pill: string
  pillInk: string
  paint: (c: CanvasRenderingContext2D, w: number, h: number) => void
}

function lin(c: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, stops: [number, string][]) {
  const g = c.createLinearGradient(x0, y0, x1, y1)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  return g
}

const SPECS: Record<ConceptKey, Spec> = {
  footonomy: {
    name: 'Footonomy',
    line: 'Matchday, in 3D',
    ink: '#f2fff6',
    mute: '#a9d4b8',
    pill: '#ffd21f',
    pillInk: '#1a1500',
    paint(c, w, h) {
      c.fillStyle = lin(c, 0, 0, 0, h, [[0, '#0f4a32'], [1, '#08241a']])
      c.fillRect(0, 0, w, h)
      // mown stripes
      for (let i = 0; i < 12; i++) {
        c.fillStyle = i % 2 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.05)'
        c.fillRect(0, (h / 12) * i, w, h / 12)
      }
      c.strokeStyle = 'rgba(236,255,242,0.55)'
      c.lineWidth = 3
      const m = 52
      c.strokeRect(m, m + 70, w - m * 2, h - m * 2 - 190)
      const cy = m + 70 + (h - m * 2 - 190) / 2
      c.beginPath()
      c.moveTo(m, cy)
      c.lineTo(w - m, cy)
      c.stroke()
      c.beginPath()
      c.arc(w / 2, cy, 112, 0, Math.PI * 2)
      c.stroke()
      c.beginPath()
      c.arc(w / 2, cy, 6, 0, Math.PI * 2)
      c.fillStyle = 'rgba(236,255,242,0.7)'
      c.fill()
      const bw = 330
      const bh = 150
      const bottom = m + 70 + (h - m * 2 - 190)
      c.strokeRect((w - bw) / 2, m + 70, bw, bh)
      c.strokeRect((w - bw) / 2, bottom - bh, bw, bh)
      c.strokeRect((w - 160) / 2, m + 70, 160, 62)
      c.strokeRect((w - 160) / 2, bottom - 62, 160, 62)
      // a passing line and a ball
      c.strokeStyle = '#ffd21f'
      c.lineWidth = 4
      c.setLineDash([2, 14])
      c.lineCap = 'round'
      c.beginPath()
      c.moveTo(190, cy + 230)
      c.quadraticCurveTo(300, cy - 40, 520, cy - 210)
      c.stroke()
      c.setLineDash([])
      c.fillStyle = '#ffd21f'
      c.beginPath()
      c.arc(520, cy - 210, 15, 0, Math.PI * 2)
      c.fill()
    },
  },
  autos: {
    name: 'Strada Motors',
    line: 'Configure it in 3D',
    ink: '#f3f5f8',
    mute: '#9aa3af',
    pill: '#e8ecf2',
    pillInk: '#0c0e12',
    paint(c, w, h) {
      c.fillStyle = lin(c, 0, 0, w, h, [[0, '#0b0d11'], [1, '#1c222b']])
      c.fillRect(0, 0, w, h)
      // horizon glow
      const g = c.createRadialGradient(w * 0.62, h * 0.5, 10, w * 0.62, h * 0.5, w * 0.8)
      g.addColorStop(0, 'rgba(160,190,230,0.22)')
      g.addColorStop(1, 'rgba(160,190,230,0)')
      c.fillStyle = g
      c.fillRect(0, 0, w, h)
      // car side profile, one continuous line
      const y = h * 0.5
      c.lineWidth = 5
      c.lineCap = 'round'
      c.lineJoin = 'round'
      c.strokeStyle = lin(c, 40, 0, w - 40, 0, [[0, 'rgba(230,236,245,0.2)'], [0.5, 'rgba(240,246,255,0.95)'], [1, 'rgba(230,236,245,0.35)']])
      c.beginPath()
      c.moveTo(48, y + 56)
      c.lineTo(60, y + 12)
      c.bezierCurveTo(110, y - 6, 190, y - 20, 262, y - 74)
      c.bezierCurveTo(330, y - 118, 438, y - 120, 512, y - 70)
      c.bezierCurveTo(566, y - 34, 622, y - 10, 672, y + 14)
      c.lineTo(684, y + 56)
      c.stroke()
      c.beginPath()
      c.moveTo(262, y - 74)
      c.lineTo(316, y - 22)
      c.lineTo(560, y - 20)
      c.stroke()
      c.lineWidth = 3
      c.strokeStyle = 'rgba(240,246,255,0.5)'
      c.beginPath()
      c.moveTo(120, y + 56)
      c.lineTo(212, y + 56)
      c.moveTo(396, y + 56)
      c.lineTo(540, y + 56)
      c.stroke()
      for (const wx of [166, 466]) {
        c.lineWidth = 5
        c.strokeStyle = 'rgba(240,246,255,0.95)'
        c.beginPath()
        c.arc(wx, y + 56, 52, 0, Math.PI * 2)
        c.stroke()
        c.lineWidth = 2.5
        c.beginPath()
        c.arc(wx, y + 56, 22, 0, Math.PI * 2)
        c.stroke()
      }
      // road reflection lines
      for (let i = 0; i < 6; i++) {
        c.strokeStyle = `rgba(200,215,235,${0.22 - i * 0.03})`
        c.lineWidth = 2
        c.beginPath()
        c.moveTo(90 + i * 22, y + 140 + i * 22)
        c.lineTo(w - 90 - i * 22, y + 140 + i * 22)
        c.stroke()
      }
    },
  },
  architecture: {
    name: 'Aldermoor Studio',
    line: 'Built around daylight',
    ink: '#1f1b16',
    mute: '#6a6154',
    pill: '#1f1b16',
    pillInk: '#f2ebdc',
    paint(c, w, h) {
      c.fillStyle = lin(c, 0, 0, 0, h, [[0, '#efe8d8'], [1, '#d9cfba']])
      c.fillRect(0, 0, w, h)
      // sun path arcs
      const sx = w * 0.72
      const sy = h * 0.3
      for (let r = 80; r <= 360; r += 70) {
        c.strokeStyle = `rgba(160,110,30,${0.34 - r / 1400})`
        c.lineWidth = 2
        c.beginPath()
        c.arc(sx, sy, r, Math.PI, Math.PI * 2)
        c.stroke()
      }
      c.fillStyle = '#d99a2b'
      c.beginPath()
      c.arc(sx, sy - 60, 44, 0, Math.PI * 2)
      c.fill()
      // elevation: stacked volumes with shadow wedges
      const base = h * 0.78
      const blocks: [number, number, number, number][] = [
        [70, base - 250, 200, 250],
        [270, base - 160, 190, 160],
        [460, base - 320, 190, 320],
      ]
      c.fillStyle = '#2a251e'
      blocks.forEach(([x, y, bw, bh]) => c.fillRect(x, y, bw, bh))
      c.strokeStyle = 'rgba(239,232,216,0.55)'
      c.lineWidth = 2
      blocks.forEach(([x, y, bw, bh]) => {
        for (let gx = x + 36; gx < x + bw - 10; gx += 40) {
          c.beginPath()
          c.moveTo(gx, y + 18)
          c.lineTo(gx, y + bh - 18)
          c.stroke()
        }
        for (let gy = y + 50; gy < y + bh - 10; gy += 60) {
          c.beginPath()
          c.moveTo(x + 14, gy)
          c.lineTo(x + bw - 14, gy)
          c.stroke()
        }
      })
      c.fillStyle = 'rgba(31,27,22,0.16)'
      c.beginPath()
      c.moveTo(70, base)
      c.lineTo(650, base)
      c.lineTo(740, base + 90)
      c.lineTo(0, base + 90)
      c.closePath()
      c.fill()
      c.fillStyle = '#1f1b16'
      c.fillRect(40, base, w - 80, 4)
    },
  },
  fintech: {
    name: 'Pollen',
    line: 'Money for freelancers and creators',
    ink: '#eafcf8',
    mute: '#8fb8b4',
    pill: '#37e0bf',
    pillInk: '#04201b',
    paint(c, w, h) {
      c.fillStyle = lin(c, 0, 0, w, h, [[0, '#07141f'], [1, '#0c3140']])
      c.fillRect(0, 0, w, h)
      c.strokeStyle = 'rgba(160,220,215,0.12)'
      c.lineWidth = 1
      for (let i = 0; i < 9; i++) {
        c.beginPath()
        c.moveTo(48, 200 + i * 56)
        c.lineTo(w - 48, 200 + i * 56)
        c.stroke()
      }
      // bars
      const n = 9
      const bw = (w - 96) / n
      const vals = [0.22, 0.3, 0.26, 0.42, 0.38, 0.55, 0.5, 0.72, 0.86]
      vals.forEach((v, i) => {
        const bh = v * 420
        c.fillStyle = i === n - 1 ? '#37e0bf' : 'rgba(55,224,191,0.28)'
        c.fillRect(48 + i * bw + bw * 0.16, 656 - bh, bw * 0.68, bh)
      })
      // line
      c.strokeStyle = '#eafcf8'
      c.lineWidth = 4
      c.lineJoin = 'round'
      c.beginPath()
      const pts = [0.4, 0.34, 0.5, 0.46, 0.62, 0.58, 0.74, 0.8, 0.95]
      pts.forEach((v, i) => {
        const x = 48 + i * bw + bw / 2
        const y = 656 - v * 470
        if (i === 0) c.moveTo(x, y)
        else c.lineTo(x, y)
      })
      c.stroke()
      const lx = 48 + (n - 1) * bw + bw / 2
      const ly = 656 - 0.95 * 470
      c.fillStyle = '#eafcf8'
      c.beginPath()
      c.arc(lx, ly, 10, 0, Math.PI * 2)
      c.fill()
    },
  },
}

function pill(c: CanvasRenderingContext2D, x: number, y: number, text: string, bg: string, fg: string) {
  c.font = `600 24px ${SANS}`
  const tw = c.measureText(text).width
  const pw = tw + 36
  c.fillStyle = bg
  c.beginPath()
  c.roundRect(x, y, pw, 46, 23)
  c.fill()
  c.fillStyle = fg
  c.textBaseline = 'middle'
  c.fillText(text, x + 18, y + 24)
}

export function paintConcept(c: CanvasRenderingContext2D, key: ConceptKey, w = ART_W, h = ART_H) {
  const spec = SPECS[key]
  c.clearRect(0, 0, w, h)
  spec.paint(c, w, h)
  if (key !== 'architecture') {
    c.fillStyle = lin(c, 0, h * 0.62, 0, h, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.55)']])
    c.fillRect(0, h * 0.62, w, h * 0.38)
  }
  pill(c, 40, 40, 'Concept build', spec.pill, spec.pillInk)
  c.textBaseline = 'alphabetic'
  c.fillStyle = spec.ink
  c.font = `650 ${spec.name.length > 12 ? 78 : 92}px ${DISPLAY}`
  c.fillText(spec.name, 40, h - 92)
  c.fillStyle = spec.mute
  c.font = `500 30px ${SANS}`
  c.fillText(spec.line, 42, h - 44)
}

/** Resolves once the two display fonts are available to canvas. */
export function artFontsReady(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve()
  return Promise.all([
    document.fonts.load(`650 80px "Saira Variable"`),
    document.fonts.load(`500 30px "Onest Variable"`),
    document.fonts.load(`600 24px "Onest Variable"`),
  ]).then(() => undefined)
}
