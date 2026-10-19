import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion, useInViewport } from '../../shared/webgl'
import { mulberry, num0, num1 } from './hooks'

/* ---------------------------------------------------------------- series */
const N = 90
const STEP_MS = 800
const MAX = 80

type Series = { id: string; label: string; color: string; base: number; amp: number; phase: number }
const SERIES: Series[] = [
  { id: 'pay', label: 'Client payments', color: '#4f6bff', base: 50, amp: 9, phase: 0.4 },
  { id: 'plat', label: 'Platform payouts', color: '#ff6a2b', base: 22, amp: 5, phase: 2.1 },
  { id: 'tips', label: 'Tips and memberships', color: '#0b1033', base: 33, amp: 7, phase: 4.2 },
]

function seedSeries(s: Series, seed: number): number[] {
  const r = mulberry(seed)
  const out: number[] = []
  let v = s.base
  for (let i = 0; i < N; i++) {
    v += (s.base - v) * 0.08 + (r() - 0.5) * s.amp * 0.5 + Math.sin(i * 0.19 + s.phase) * s.amp * 0.08
    out.push(Math.max(2, Math.min(MAX - 4, v)))
  }
  return out
}

function nextPoint(s: Series, prev: number, tick: number): number {
  const v = prev + (s.base - prev) * 0.08 + (Math.random() - 0.5) * s.amp * 0.55 + Math.sin(tick * 0.19 + s.phase) * s.amp * 0.08
  return Math.max(2, Math.min(MAX - 4, v))
}

/* ------------------------------------------------------------ transactions */
type Tx = { id: number; ref: string; kind: string; amount: string; route: string; status: string; hold: boolean; at: string }

const KINDS: { kind: string; routes: string[]; cur: string; lo: number; hi: number; ok: string }[] = [
  { kind: 'Client payment', routes: ['Design studio, Berlin', 'Startup, New York', 'Publisher, London', 'Agency, Sydney'], cur: '', lo: 300, hi: 9_000, ok: 'Landed' },
  { kind: 'Platform payout', routes: ['Video platform ad revenue', 'Streaming payout', 'Course marketplace'], cur: 'USD', lo: 150, hi: 6_500, ok: 'Paid in' },
  { kind: 'Fan tip', routes: ['Toronto', 'Seoul', 'Manchester', 'Sao Paulo'], cur: '', lo: 5, hi: 250, ok: 'Received' },
  { kind: 'Smart FX', routes: ['USD to INR', 'EUR to PHP', 'GBP to EUR', 'USD to KES'], cur: '', lo: 200, hi: 8_000, ok: 'Converted' },
  { kind: 'Instant payout', routes: ['To Lisbon', 'To Mumbai', 'To Manila'], cur: 'USD', lo: 100, hi: 5_000, ok: 'Sent' },
  { kind: 'Tax pot', routes: ['22% of a paid invoice', '25% of a payout', '18% of a tip jar'], cur: 'USD', lo: 20, hi: 1_800, ok: 'Set aside' },
]
const CUR = ['USD', 'EUR', 'GBP', 'AUD', 'CAD']

function clock(d = new Date()) {
  return d.toTimeString().slice(0, 8)
}

function makeTx(id: number, r: () => number, held = false): Tx {
  const k = KINDS[Math.floor(r() * KINDS.length)]
  const route = k.routes[Math.floor(r() * k.routes.length)]
  const cur = k.cur || (k.kind === 'Smart FX' ? route.slice(0, 3) : CUR[Math.floor(r() * CUR.length)])
  const v = Math.round((k.lo + Math.pow(r(), 2.2) * (k.hi - k.lo)) / 10) * 10
  const hold = held || r() < 0.09
  return {
    id,
    ref: `PL-${String(48000 + id).padStart(5, '0')}`,
    kind: k.kind,
    amount: `${CUR.includes(cur) ? cur : 'USD'} ${num0.format(v)}`,
    route,
    status: hold ? 'Quick check first' : k.ok,
    hold,
    at: clock(),
  }
}

function seedTx(): Tx[] {
  const r = mulberry(9)
  const base = Date.now()
  return Array.from({ length: 7 }, (_, i) => {
    const t = makeTx(213 - i, r)
    t.at = clock(new Date(base - (i + 1) * 4300))
    return t
  })
}

/* ----------------------------------------------------------------- chart */
function useChart(
  wrap: React.RefObject<HTMLDivElement | null>,
  canvas: React.RefObject<HTMLCanvasElement | null>,
  data: React.MutableRefObject<number[][]>,
  stamp: React.MutableRefObject<number>,
  on: Record<string, boolean>,
  live: boolean,
) {
  const hover = useRef<number | null>(null)
  const onRef = useRef(on)
  onRef.current = on

  const draw = useCallback(
    (now: number) => {
      const c = canvas.current
      const box = wrap.current
      if (!c || !box) return
      const w = box.clientWidth
      const h = box.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const padL = 38
      const padB = 24
      const padT = 12
      const plotW = w - padL - 8
      const plotH = h - padB - padT
      const dx = plotW / (N - 2)
      const frac = live ? Math.min(1, (now - stamp.current) / STEP_MS) : 0
      const X = (i: number) => padL + (i - frac) * dx
      const Y = (v: number) => padT + plotH - (v / MAX) * plotH

      ctx.font = '11px "Martian Mono Variable", ui-monospace, monospace'
      ctx.textBaseline = 'middle'
      ctx.lineWidth = 1
      for (let g = 0; g <= 4; g++) {
        const v = (MAX / 4) * g
        const y = Math.round(Y(v)) + 0.5
        ctx.strokeStyle = 'rgba(11,16,51,0.14)'
        ctx.beginPath()
        ctx.moveTo(padL, y)
        ctx.lineTo(w - 8, y)
        ctx.stroke()
        ctx.fillStyle = '#4a5075'
        ctx.textAlign = 'right'
        ctx.fillText(String(v), padL - 8, y)
      }
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ;[0, 30, 60, 90].forEach((m) => {
        const i = N - 1 - m
        const x = X(Math.max(1, i))
        ctx.fillStyle = '#4a5075'
        ctx.fillText(m === 0 ? 'now' : `-${m}m`, Math.min(Math.max(x, padL + 14), w - 22), h - 6)
      })

      ctx.save()
      ctx.beginPath()
      ctx.rect(padL, 0, plotW + 8, h)
      ctx.clip()
      SERIES.forEach((s, si) => {
        if (!onRef.current[s.id]) return
        const d = data.current[si]
        ctx.beginPath()
        d.forEach((v, i) => {
          const x = X(i)
          const y = Y(v)
          if (i === 0) ctx.moveTo(x, y)
          else {
            const px = X(i - 1)
            const py = Y(d[i - 1])
            ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2)
          }
        })
        ctx.lineJoin = 'round'
        ctx.lineWidth = si === 0 ? 2.6 : 2.2
        ctx.strokeStyle = s.color
        ctx.stroke()
        if (si === 0) {
          ctx.lineTo(X(N - 1), Y(0))
          ctx.lineTo(X(0), Y(0))
          ctx.closePath()
          const g = ctx.createLinearGradient(0, padT, 0, padT + plotH)
          g.addColorStop(0, 'rgba(79,107,255,0.28)')
          g.addColorStop(1, 'rgba(79,107,255,0)')
          ctx.fillStyle = g
          ctx.fill()
        }
      })
      ctx.restore()

      // pulse on the live edge
      SERIES.forEach((s, si) => {
        if (!onRef.current[s.id]) return
        const d = data.current[si]
        const x = X(N - 1)
        const y = Y(d[N - 1])
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
        if (live) {
          ctx.strokeStyle = s.color
          ctx.globalAlpha = 0.35 * (1 - frac)
          ctx.beginPath()
          ctx.arc(x, y, 4 + frac * 10, 0, Math.PI * 2)
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })

      // hover read-out
      const hv = hover.current
      if (hv !== null) {
        const i = Math.max(1, Math.min(N - 1, Math.round(hv / dx + frac)))
        const x = X(i)
        ctx.strokeStyle = 'rgba(11,16,51,0.55)'
        ctx.setLineDash([3, 4])
        ctx.beginPath()
        ctx.moveTo(x, padT)
        ctx.lineTo(x, padT + plotH)
        ctx.stroke()
        ctx.setLineDash([])
        const rows = SERIES.filter((s) => onRef.current[s.id]).map((s) => ({ s, v: data.current[SERIES.indexOf(s)][i] }))
        const bw = 150
        const bh = 20 + rows.length * 18
        let bx = x + 12
        if (bx + bw > w - 4) bx = x - bw - 12
        ctx.fillStyle = '#0b1033'
        ctx.beginPath()
        ctx.roundRect(bx, padT + 6, bw, bh, 8)
        ctx.fill()
        ctx.textAlign = 'left'
        ctx.font = '11px "Martian Mono Variable", ui-monospace, monospace'
        ctx.fillStyle = '#c9d2ff'
        ctx.fillText(`${N - 1 - i === 0 ? 'now' : `${N - 1 - i} min ago`}`, bx + 10, padT + 24)
        rows.forEach((r, k) => {
          ctx.fillStyle = r.s.id === 'tips' ? '#ffffff' : r.s.color
          ctx.fillText(`${r.s.label}`, bx + 10, padT + 42 + k * 18)
          ctx.fillStyle = '#ffffff'
          ctx.textAlign = 'right'
          ctx.fillText(num1.format(r.v), bx + bw - 10, padT + 42 + k * 18)
          ctx.textAlign = 'left'
        })
      }
    },
    [canvas, wrap, data, stamp, live],
  )

  return { draw, hover }
}

export default function LiveBoard() {
  const reduced = usePrefersReducedMotion()
  const root = useRef<HTMLElement>(null)
  const visible = useInViewport(root, '0px')
  const live = visible && !reduced
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const data = useRef<number[][]>(SERIES.map((s, i) => seedSeries(s, 11 + i * 7)))
  const stamp = useRef(0)
  const tick = useRef(N)
  const [on, setOn] = useState<Record<string, boolean>>({ pay: true, plat: true, tips: true })
  const [latest, setLatest] = useState(() => data.current.map((d) => d[N - 1]))
  const [txs, setTxs] = useState<Tx[]>(seedTx)
  const txId = useRef(214)
  const { draw, hover } = useChart(wrap, canvas, data, stamp, on, live)

  // paint loop (only while visible)
  useEffect(() => {
    let raf = 0
    stamp.current = performance.now()
    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    if (live) raf = requestAnimationFrame(loop)
    else draw(performance.now())
    const ro = new ResizeObserver(() => draw(performance.now()))
    if (wrap.current) ro.observe(wrap.current)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [draw, live, on])

  // data tick
  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => {
      tick.current++
      data.current = data.current.map((d, i) => {
        const nd = d.slice(1)
        nd.push(nextPoint(SERIES[i], d[d.length - 1], tick.current))
        return nd
      })
      stamp.current = performance.now()
      setLatest(data.current.map((d) => d[N - 1]))
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [live])

  // transaction stream
  useEffect(() => {
    if (!live) return
    let id = 0
    const r = Math.random
    const add = () => {
      txId.current++
      setTxs((cur) => [makeTx(txId.current, r), ...cur].slice(0, 7))
      id = window.setTimeout(add, 1100 + Math.random() * 1500)
    }
    id = window.setTimeout(add, 900)
    return () => window.clearTimeout(id)
  }, [live])

  const onMove = (e: React.PointerEvent) => {
    const box = wrap.current
    if (!box) return
    const rect = box.getBoundingClientRect()
    hover.current = Math.max(0, Math.min(rect.width - 46, e.clientX - rect.left - 38))
    if (!live) draw(performance.now())
  }
  const onLeave = () => {
    hover.current = null
    if (!live) draw(performance.now())
  }

  return (
    <section className="fq-live" id="live" ref={root} aria-labelledby="fq-live-h">
      <div className="fq-live__head">
        <h2 id="fq-live-h">Every payout, tip and payment in one feed.</h2>
        <p>Client payments, platform payouts and fan tips land in one place, so you read one total instead of opening five dashboards. This is the view behind your earnings dashboard.</p>
      </div>

      <div className="fq-live__grid">
        <figure className="fq-chart">
          <figcaption className="fq-chart__top">
            <span className="fq-chart__title">Earnings landing each minute across Pollen, USD thousands</span>
            <span className="fq-chart__note">Sample data</span>
          </figcaption>
          <ul className="fq-legend">
            {SERIES.map((s, i) => (
              <li key={s.id}>
                <button type="button" aria-pressed={on[s.id]} onClick={() => setOn((o) => ({ ...o, [s.id]: !o[s.id] }))}>
                  <i style={{ background: s.color }} aria-hidden="true" />
                  <span>{s.label}</span>
                  <b>{num1.format(latest[i])}</b>
                </button>
              </li>
            ))}
          </ul>
          <div
            className="fq-chart__plot"
            ref={wrap}
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={onLeave}
            role="img"
            aria-label="Line chart of earnings landing each minute over the last 90 minutes for client payments, platform payouts, and tips and memberships. Sample data; current values are listed above the chart."
          >
            <canvas ref={canvas} />
          </div>
        </figure>

        <div className="fq-stream">
          <h3>Just landed</h3>
          <ol className="fq-stream__list" aria-label="Recent arrivals, sample data">
            {txs.map((t) => (
              <li key={t.id} className={t.hold ? 'is-hold' : undefined}>
                <span className="fq-stream__kind">{t.kind}</span>
                <span className="fq-stream__amt">{t.amount}</span>
                <span className="fq-stream__route">{t.route}</span>
                <span className="fq-stream__status">{t.status}</span>
                <span className="fq-stream__ref">
                  {t.ref} at {t.at}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
