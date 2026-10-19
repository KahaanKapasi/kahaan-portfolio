import { useId, useState } from 'react'

const X0 = 194 // inner face of the left wall
const X1 = 546 // inner face of the right wall
const FLOOR0 = 366
const FLOOR1 = 221
const PX_PER_M = 40

type Pt = [number, number]

function clipRight(poly: Pt[], x: number): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    const ai = a[0] <= x
    const bi = b[0] <= x
    if (ai) out.push(a)
    if (ai !== bi) {
      const t = (x - a[0]) / (b[0] - a[0])
      out.push([x, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const hexMix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(',')})`

function fmt(t: number) {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return `${h}:${String(m === 60 ? 0 : m).padStart(2, '0')}`
}

export default function SunStudy() {
  const [t, setT] = useState(10.5)
  const id = useId().replace(/:/g, '')
  const elev = 14 + 48 * Math.sin((Math.PI * (t - 7.5)) / 10)
  const rad = (elev * Math.PI) / 180
  const tan = Math.tan(rad)
  const warmth = Math.max(0, Math.min(1, (62 - elev) / 42))
  const sky = hexMix([205, 224, 232], [243, 200, 160], warmth)

  const openings = [
    { yt: 112, yb: 205, floor: FLOOR1 },
    { yt: 258, yb: 354, floor: FLOOR0 },
  ]
  let litPx = 0
  const beams = openings.map((o) => {
    const xTopHit = X0 + (o.floor - o.yt) / tan
    const xBotHit = X0 + (o.floor - o.yb) / tan
    const poly: Pt[] = [
      [X0, o.yt],
      [X0, o.yb],
      [xBotHit, o.floor],
      [xTopHit, o.floor],
    ]
    const clipped = clipRight(poly, X1)
    const a = Math.min(xBotHit, X1)
    const b = Math.min(xTopHit, X1)
    litPx += Math.max(0, b - a)
    return { poly: clipped, floor: o.floor, a, b }
  })
  const lit = litPx / PX_PER_M
  const sunX = X0 - 60 - 120 * Math.cos(rad)
  const sunY = 235 - 190 * Math.sin(rad)
  const path = (p: Pt[]) => p.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('') + 'Z'

  return (
    <figure className="ca-sun">
      <svg viewBox="0 0 720 440" role="img" aria-label={`Section drawing of a two-storey room with a tall window. At ${fmt(t)} the sun is ${Math.round(elev)} degrees above the horizon and about ${lit.toFixed(1)} metres of floor is lit.`}>
        <defs>
          <pattern id={`${id}h`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#141516" strokeWidth="1" />
          </pattern>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffd37a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffd37a" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect width="720" height="440" fill={sky} />
        <rect x="0" y="380" width="720" height="60" fill="#d8d4c8" />
        <line x1="0" y1="380" x2="720" y2="380" stroke="#141516" strokeWidth="1.6" />
        {/* interior */}
        <rect x={X0} y="96" width={X1 - X0} height={FLOOR0 - 96} fill="#ebe5d6" />
        <rect x={X0} y="96" width={X1 - X0} height={FLOOR0 - 96} fill="#141516" opacity={0.1 + 0.12 * warmth} />
        {/* beams of light */}
        {beams.map((b, i) => (
          <g key={i}>
            <path d={path(b.poly)} fill={`url(#${id}b)`} />
            <line x1={b.a} x2={b.b} y1={b.floor - 1.5} y2={b.floor - 1.5} stroke="#f2a51d" strokeWidth="5" strokeLinecap="butt" />
          </g>
        ))}
        {/* structure */}
        <g fill={`url(#${id}h)`} stroke="#141516" strokeWidth="1.4">
          <path d={`M${X0 - 14} 96H${X1 + 14}V${FLOOR0}H${X1}V110H${X0}V${FLOOR0}H${X0 - 14}Z`} fill="none" />
          {/* left wall segments between openings */}
          <rect x={X0 - 14} y="96" width="14" height="16" />
          <rect x={X0 - 14} y="205" width="14" height="53" />
          <rect x={X0 - 14} y="354" width="14" height={FLOOR0 + 14 - 354} />
          <rect x={X1} y="96" width="14" height={FLOOR0 + 14 - 96} />
          <rect x={X0 - 14} y="96" width={X1 - X0 + 28} height="14" />
          <rect x={X0} y={FLOOR1} width={X1 - X0} height="14" />
          <rect x={X0 - 14} y={FLOOR0} width={X1 - X0 + 28} height="14" />
        </g>
        {/* glazing lines */}
        <g stroke="#141516" strokeWidth="1" opacity="0.7">
          <line x1={X0 - 7} x2={X0 - 7} y1="112" y2="205" />
          <line x1={X0 - 7} x2={X0 - 7} y1="258" y2="354" />
        </g>
        {/* scale figure */}
        <g stroke="#141516" strokeWidth="1.4" fill="none" transform={`translate(430 ${FLOOR0})`}>
          <circle cx="0" cy="-66" r="5" />
          <path d="M0-60V-28M0-28L-7 0M0-28L7 0M-9-52L0-58L9-52" />
        </g>
        {/* sun and rays */}
        <g>
          <circle cx={sunX} cy={sunY} r="15" fill="#f6b73c" />
          <circle cx={sunX} cy={sunY} r="24" fill="none" stroke="#f6b73c" strokeWidth="1" opacity="0.6" />
          <line x1={sunX + 18 * Math.cos(rad)} y1={sunY + 18 * Math.sin(rad)} x2={X0 - 14} y2={sunY + 18 * Math.sin(rad) + (X0 - 14 - sunX - 18 * Math.cos(rad)) * tan} stroke="#c58612" strokeWidth="1" strokeDasharray="4 5" />
        </g>
        {/* dimension */}
        <g stroke="#b3321a" strokeWidth="1.2" fill="none">
          <path d={`M${beams[1].a} 408H${Math.max(beams[1].a + 1, beams[1].b)}`} />
          <path d={`M${beams[1].a} 402v12M${Math.max(beams[1].a + 1, beams[1].b)} 402v12`} />
        </g>
        <text x={Math.max(beams[1].a, 200)} y="430" fontSize="14" fill="#8e2812" fontFamily="var(--ca-sans)">
          {`Floor lit: ${lit.toFixed(1)} m`}
        </text>
        <text x="570" y="64" fontSize="13" fill="#141516" fontFamily="var(--ca-sans)">
          Section A-A
        </text>
        <text x="570" y="82" fontSize="13" fill="#3c3e3a" fontFamily="var(--ca-sans)">
          1 m = 40 px
        </text>
      </svg>
      <figcaption className="ca-sun__ctl">
        <label htmlFor={`${id}r`}>Time of day</label>
        <input
          id={`${id}r`}
          type="range"
          min="8"
          max="17"
          step="0.05"
          value={t}
          onChange={(e) => setT(parseFloat(e.target.value))}
          aria-valuetext={`${fmt(t)}, sun ${Math.round(elev)} degrees high`}
        />
        <output htmlFor={`${id}r`}>
          <b>{fmt(t)}</b> <span>sun {Math.round(elev)}&deg;</span>
        </output>
      </figcaption>
    </figure>
  )
}
