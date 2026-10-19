import { useId, useMemo, useState } from 'react'
import { usePrefersReducedMotion } from '../../shared/webgl'
import { useMedia } from './hooks'

type Node = { id: string; city: string; cur: string; vol: number; settle: string; note: string }

const FROM: Node[] = [
  { id: 'nyc', city: 'New York', cur: 'USD', vol: 312, settle: '9 seconds', note: 'Agencies and startups paying designers, developers and editors by card or direct debit.' },
  { id: 'lon', city: 'London', cur: 'GBP', vol: 168, settle: '1 min 10 s', note: 'Studios and publishers paying for commissions, retainers and licensing.' },
  { id: 'ber', city: 'Berlin', cur: 'EUR', vol: 204, settle: '12 seconds', note: 'Product teams paying by instant euro transfer, usually the day an invoice lands.' },
]
const TO: Node[] = [
  { id: 'lis', city: 'Lisbon', cur: 'EUR', vol: 136, settle: '10 seconds', note: 'Remote workers and creators paid in euros, keeping some and converting the rest to dollars.' },
  { id: 'mum', city: 'Mumbai', cur: 'INR', vol: 289, settle: '15 seconds', note: 'Freelance developers and designers cashing out to a local account over instant rails.' },
  { id: 'man', city: 'Manila', cur: 'PHP', vol: 259, settle: '12 seconds', note: 'Virtual assistants and video editors paid in dollars and cashed out in pesos.' },
]
const TOTAL = FROM.reduce((a, n) => a + n.vol, 0)

type Geo = { w: number; h: number; vertical: boolean }
const H: Geo = { w: 1200, h: 520, vertical: false }
const V: Geo = { w: 420, h: 780, vertical: true }

function layout(g: Geo) {
  const nodeW = g.vertical ? 124 : 220
  const nodeH = g.vertical ? 76 : 72
  const coreW = g.vertical ? g.w - 40 : 260
  const coreH = g.vertical ? 92 : 400
  const coreX = g.vertical ? 20 : (g.w - coreW) / 2
  const coreY = g.vertical ? (g.h - coreH) / 2 : (g.h - coreH) / 2
  const usable = (g.vertical ? coreW : coreH) - 60

  const place = (list: Node[], side: 'a' | 'b') =>
    list.map((n, i) => {
      const along = g.vertical ? 20 + i * ((g.w - 40 - nodeW) / (list.length - 1)) : 28 + i * ((g.h - 56 - nodeH) / (list.length - 1))
      const x = g.vertical ? along : side === 'a' ? 0 : g.w - nodeW
      const y = g.vertical ? (side === 'a' ? 0 : g.h - nodeH) : along
      return { n, x, y }
    })
  const a = place(FROM, 'a')
  const b = place(TO, 'b')

  const flows = (items: typeof a, side: 'a' | 'b') => {
    let cum = 0
    return items.map(({ n, x, y }) => {
      const thick = Math.max(6, (n.vol / TOTAL) * usable * 0.72)
      const slot = 30 + cum + ((n.vol / TOTAL) * usable) / 2
      cum += (n.vol / TOTAL) * usable
      let sx: number, sy: number, ex: number, ey: number
      if (g.vertical) {
        const coreEdgeY = side === 'a' ? coreY : coreY + coreH
        sx = x + nodeW / 2
        sy = side === 'a' ? y + nodeH : y
        ex = coreX + slot
        ey = coreEdgeY
        if (side === 'b') [sx, sy, ex, ey] = [ex, ey, sx, sy]
        const my = (sy + ey) / 2
        return { n, side, thick, d: `M${sx} ${sy} C${sx} ${my} ${ex} ${my} ${ex} ${ey}` }
      }
      const coreEdgeX = side === 'a' ? coreX : coreX + coreW
      sx = side === 'a' ? x + nodeW : coreEdgeX
      sy = side === 'a' ? y + nodeH / 2 : coreY + slot
      ex = side === 'a' ? coreEdgeX : x
      ey = side === 'a' ? coreY + slot : y + nodeH / 2
      const mx = (sx + ex) / 2
      return { n, side, thick, d: `M${sx} ${sy} C${mx} ${sy} ${mx} ${ey} ${ex} ${ey}` }
    })
  }
  return { nodeW, nodeH, coreW, coreH, coreX, coreY, a, b, fa: flows(a, 'a'), fb: flows(b, 'b') }
}

export default function Corridors() {
  const reduced = usePrefersReducedMotion()
  const narrow = useMedia('(max-width: 760px)')
  const g = narrow ? V : H
  const L = useMemo(() => layout(g), [g])
  const [sel, setSel] = useState<string | null>(null)
  const uid = useId().replace(/:/g, '')
  const node = [...FROM, ...TO].find((n) => n.id === sel)

  const toggle = (id: string) => setSel((s) => (s === id ? null : id))
  const key = (id: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(id)
    }
  }

  const flows = [...L.fa, ...L.fb]

  return (
    <section className="fq-flows" id="corridors" aria-labelledby="fq-flows-h">
      <div className="fq-flows__head">
        <h2 id="fq-flows-h">Clients in three cities, creators in three more.</h2>
        <p>Follow a payment from the city your client pays in to the city you cash out in. Select a city to isolate its flow.</p>
      </div>

      <div className="fq-flows__stage">
        <svg className={g.vertical ? 'is-v' : undefined} viewBox={`0 0 ${g.w} ${g.h}`} role="group" aria-label="Diagram of payment flows. Three client cities send payments into Pollen, which pays out to three creator cities. Use the city buttons to filter.">
          <defs>
            <linearGradient id={`${uid}-in`} x1="0" y1="0" x2={g.vertical ? 0 : 1} y2={g.vertical ? 1 : 0}>
              <stop offset="0" stopColor="#5a73ff" />
              <stop offset="1" stopColor="#3d5bff" />
            </linearGradient>
            <linearGradient id={`${uid}-out`} x1="0" y1="0" x2={g.vertical ? 0 : 1} y2={g.vertical ? 1 : 0}>
              <stop offset="0" stopColor="#3d5bff" />
              <stop offset="1" stopColor="#ff6a2b" />
            </linearGradient>
          </defs>

          {flows.map((f, i) => {
            const dim = sel && sel !== f.n.id
            return (
              <g key={f.n.id} className={`fq-flow${dim ? ' is-dim' : ''}`}>
                <path id={`${uid}-p${i}`} d={f.d} fill="none" stroke={`url(#${uid}-${f.side === 'a' ? 'in' : 'out'})`} strokeWidth={f.thick} strokeOpacity="0.38" />
                {!reduced &&
                  [0, 1, 2].map((k) => (
                    <circle key={k} r={g.vertical ? 4 : 5} fill={f.side === 'a' ? '#dfe5ff' : '#ffb089'}>
                      <animateMotion dur={`${5 + (i % 3) * 0.9}s`} begin={`-${(k * (5 + (i % 3) * 0.9)) / 3}s`} repeatCount="indefinite">
                        <mpath href={`#${uid}-p${i}`} />
                      </animateMotion>
                    </circle>
                  ))}
              </g>
            )
          })}

          <g className="fq-core">
            <rect x={L.coreX} y={L.coreY} width={L.coreW} height={L.coreH} rx="22" />
            <text x={L.coreX + L.coreW / 2} y={L.coreY + L.coreH / 2 - (g.vertical ? 4 : 18)} textAnchor="middle" className="fq-core__t">
              {g.vertical ? (
                'Pollen wallets'
              ) : (
                <>
                  <tspan x={L.coreX + L.coreW / 2}>Pollen</tspan>
                  <tspan x={L.coreX + L.coreW / 2} dy="32">
                    wallets
                  </tspan>
                </>
              )}
            </text>
            <text x={L.coreX + L.coreW / 2} y={L.coreY + L.coreH / 2 + (g.vertical ? 22 : 52)} textAnchor="middle" className="fq-core__s">
              USD {TOTAL.toLocaleString('en-US')}m a day
            </text>
          </g>

          {[...L.a, ...L.b].map(({ n, x, y }) => (
            <g
              key={n.id}
              className={`fq-node${sel === n.id ? ' is-on' : ''}${sel && sel !== n.id ? ' is-dim' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={sel === n.id}
              aria-label={`${n.city}, ${n.cur}, ${n.vol} million US dollars a day`}
              onClick={() => toggle(n.id)}
              onKeyDown={key(n.id)}
            >
              <rect x={x} y={y} width={L.nodeW} height={L.nodeH} rx="16" />
              <text x={x + 18} y={y + L.nodeH / 2 - 4} className="fq-node__c">
                {n.city}
              </text>
              <text x={x + 18} y={y + L.nodeH / 2 + 20} className="fq-node__v">
                {n.cur} · ${n.vol}m
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="fq-flows__read" aria-live="polite">
        {node ? (
          <dl>
            <div>
              <dt>City</dt>
              <dd>
                {node.city} ({node.cur})
              </dd>
            </div>
            <div>
              <dt>Daily volume</dt>
              <dd>USD {node.vol} m</dd>
            </div>
            <div>
              <dt>Median arrival</dt>
              <dd>{node.settle}</dd>
            </div>
            <div className="fq-flows__note">
              <dt>Who is here</dt>
              <dd>{node.note}</dd>
            </div>
          </dl>
        ) : (
          <p>All corridors shown. Sample figures for a growing network; nothing here is live data.</p>
        )}
      </div>
    </section>
  )
}
