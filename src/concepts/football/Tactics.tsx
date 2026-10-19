import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CLUBS, FORMATIONS, OPPOSITION, PLAYS, legibleAccent, type ClubId, type Play, type Pt } from './data'
import { Crest } from './crests'
import { useCelebrate } from './celebrate'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const smooth = (u: number) => u * u * (3 - 2 * u)

function useMedia(q: string) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

function posAt(play: Play, base: Pt[], i: number, t: number): Pt {
  const wp = play.runs[i]
  const b = base[i]
  if (!wp) return b
  if (t <= wp[0][0]) return [b[0] + wp[0][1], b[1] + wp[0][2]]
  for (let k = 1; k < wp.length; k++) {
    if (t <= wp[k][0]) {
      const u = smooth((t - wp[k - 1][0]) / (wp[k][0] - wp[k - 1][0]))
      return [b[0] + wp[k - 1][1] + (wp[k][1] - wp[k - 1][1]) * u, b[1] + wp[k - 1][2] + (wp[k][2] - wp[k - 1][2]) * u]
    }
  }
  const l = wp[wp.length - 1]
  return [b[0] + l[1], b[1] + l[2]]
}

function ballAt(play: Play, base: Pt[], t: number): { x: number; y: number; h: number } {
  let carrier = play.passes[0].from
  for (const p of play.passes) {
    if (t < p.at) {
      const c = posAt(play, base, carrier, t)
      return { x: c[0] + 1.7, y: c[1], h: 0 }
    }
    const end = p.at + p.flight
    if (t < end) {
      const u = (t - p.at) / p.flight
      const a = posAt(play, base, carrier, p.at)
      const b: Pt = p.to >= 0 ? posAt(play, base, p.to, end) : (p.target as Pt)
      const e = p.arc > 1.5 ? u : smooth(u)
      return {
        x: a[0] + 1.7 + (b[0] + (p.to >= 0 ? 1.7 : 0) - a[0] - 1.7) * e,
        y: a[1] + (b[1] - a[1]) * e,
        h: Math.sin(Math.PI * u) * p.arc,
      }
    }
    if (p.to >= 0) carrier = p.to
    else return { x: (p.target as Pt)[0] + 0.6, y: (p.target as Pt)[1], h: 0 }
  }
  const c = posAt(play, base, carrier, t)
  return { x: c[0] + 1.7, y: c[1], h: 0 }
}

const TACTIC_CLUBS: ClubId[] = ['real-madrid', 'barcelona', 'man-city', 'arsenal', 'bayern']

export function Tactics() {
  const celebrate = useCelebrate()
  const vertical = useMedia('(max-width: 760px)')
  const [activeClub, setActiveClub] = useState<ClubId>('real-madrid')
  const [formation, setFormation] = useState('4-3-3')
  const [base, setBase] = useState<Pt[]>(() => FORMATIONS['4-3-3'].pts.map((p) => [...p] as Pt))
  const [playId, setPlayId] = useState(PLAYS[0].id)
  const [playing, setPlaying] = useState(false)
  const [showOpp, setShowOpp] = useState(true)
  const [selected, setSelected] = useState<number | null>(9) // Striker
  const [status, setStatus] = useState('')

  const club = CLUBS[activeClub]
  const XI = club.xi

  const svgRef = useRef<SVGSVGElement>(null)
  const playerEls = useRef<(SVGGElement | null)[]>([])
  const ballEl = useRef<SVGGElement>(null)
  const ballShadow = useRef<SVGEllipseElement>(null)
  const drawn = useRef<Pt[]>(base)
  const raf = useRef(0)
  const dragging = useRef<number | null>(null)
  const baseRef = useRef(base)
  baseRef.current = base

  const play = useMemo(() => PLAYS.find((p) => p.id === playId) ?? PLAYS[0], [playId])

  const draw = useCallback((pts: Pt[]) => {
    drawn.current = pts
    pts.forEach((p, i) => playerEls.current[i]?.setAttribute('transform', `translate(${p[0].toFixed(2)} ${p[1].toFixed(2)})`))
  }, [])
  const drawBall = useCallback((x: number, y: number, h: number) => {
    ballEl.current?.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(1 + h * 0.16).toFixed(2)})`)
    ballShadow.current?.setAttribute('transform', `translate(${(x + h * 0.25).toFixed(2)} ${(y + h * 0.25).toFixed(2)})`)
    ballShadow.current?.setAttribute('opacity', String(Math.max(0.15, 0.55 - h * 0.08)))
  }, [])

  // When layout changes and nothing is animating, re-draw
  useLayoutEffect(() => {
    if (playing) return
    draw(base)
    const b = ballAt(play, base, 0)
    drawBall(b.x, b.y, 0)
  }, [base, play, playing, draw, drawBall])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const tween = useCallback(
    (to: Pt[], ms: number, done: () => void) => {
      const from = drawn.current.map((p) => [...p] as Pt)
      const t0 = performance.now()
      const tick = (now: number) => {
        const u = clamp((now - t0) / ms, 0, 1)
        const e = smooth(u)
        draw(to.map((p, i) => [from[i][0] + (p[0] - from[i][0]) * e, from[i][1] + (p[1] - from[i][1]) * e] as Pt))
        if (u < 1) raf.current = requestAnimationFrame(tick)
        else done()
      }
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(tick)
    },
    [draw],
  )

  const chooseFormation = (key: string) => {
    if (playing) return
    setFormation(key)
    const next = FORMATIONS[key].pts.map((p) => [...p] as Pt)
    tween(next, 650, () => setBase(next))
  }

  const reset = () => {
    cancelAnimationFrame(raf.current)
    setPlaying(false)
    setStatus('')
    const next = FORMATIONS[formation].pts.map((p) => [...p] as Pt)
    tween(next, 450, () => setBase(next))
  }

  const stop = () => {
    cancelAnimationFrame(raf.current)
    setPlaying(false)
    setStatus('')
    const b = baseRef.current
    tween(b, 400, () => setBase(b.map((p) => [...p] as Pt)))
  }

  const run = () => {
    if (playing) {
      stop()
      return
    }
    const b = baseRef.current.map((p) => [...p] as Pt)
    setBase(b)
    setPlaying(true)
    setStatus(`${play.name}: executing`)
    const t0 = performance.now()
    let scored = false
    const total = play.duration + 1.4
    const last = play.passes[play.passes.length - 1]
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      const tt = Math.min(t, play.duration)
      draw(b.map((_, i) => posAt(play, b, i, tt)))
      const ball = ballAt(play, b, tt)
      drawBall(ball.x, ball.y, ball.h)
      if (!scored && last.to === -1 && t >= last.at + last.flight) {
        scored = true
        const scorer = XI[9]?.name ?? club.name
        celebrate({ club: activeClub, title: 'GOAL', sub: `${play.name} finished by ${scorer}` })
        setStatus(`${play.name}: GOAL!`)
      }
      if (t < total) raf.current = requestAnimationFrame(tick)
      else {
        tween(b, 600, () => {
          setPlaying(false)
          setStatus('')
        })
      }
    }
    raf.current = requestAnimationFrame(tick)
  }

  /* ---------- drag + keyboard ---------- */
  const toPitch = (cx: number, cy: number): Pt | null => {
    const svg = svgRef.current
    const m = svg?.getScreenCTM()
    if (!svg || !m) return null
    const pt = svg.createSVGPoint()
    pt.x = cx
    pt.y = cy
    const p = pt.matrixTransform(m.inverse())
    return vertical ? [105 - p.y, p.x] : [p.x, p.y]
  }
  const setPlayer = (i: number, x: number, y: number) => {
    setBase((cur) => cur.map((p, k) => (k === i ? ([clamp(x, 2, 103), clamp(y, 2, 66)] as Pt) : p)))
  }
  const onDown = (i: number) => (e: React.PointerEvent) => {
    if (playing) return
    dragging.current = i
    setSelected(i)
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    e.preventDefault()
  }
  const onMove = (e: React.PointerEvent) => {
    const i = dragging.current
    if (i === null) return
    const p = toPitch(e.clientX, e.clientY)
    if (p) setPlayer(i, p[0], p[1])
  }
  const onUp = () => {
    dragging.current = null
  }
  const onKey = (i: number) => (e: React.KeyboardEvent) => {
    if (playing) return
    const step = e.shiftKey ? 4 : 1
    let sx = 0
    let sy = 0
    if (e.key === 'ArrowLeft') sx = -step
    else if (e.key === 'ArrowRight') sx = step
    else if (e.key === 'ArrowUp') sy = -step
    else if (e.key === 'ArrowDown') sy = step
    else return
    e.preventDefault()
    const [x, y] = base[i]
    if (vertical) setPlayer(i, x - sy, y + sx)
    else setPlayer(i, x + sx, y + sy)
  }

  const pathFor = (i: number) => {
    const wp = play.runs[i]
    if (!wp) return null
    const pts: string[] = []
    for (let t = wp[0][0]; t <= wp[wp.length - 1][0] + 0.01; t += 0.2) {
      const p = posAt(play, base, i, t)
      pts.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    }
    return pts.join(' ')
  }
  const passLines = play.passes.map((p) => {
    const a = posAt(play, base, p.from, p.at)
    const end = p.at + p.flight
    const b: Pt = p.to >= 0 ? posAt(play, base, p.to, end) : (p.target as Pt)
    return { a, b, key: `${p.from}-${p.to}-${p.at}` }
  })

  const sel = selected !== null ? XI[selected] : null
  const r = vertical ? 3.1 : 2.6
  const stripes = Array.from({ length: 14 }, (_, i) => i)

  return (
    <section className="cf-tactics" id="tactics" aria-labelledby="tac-h">
      <div className="cf-tactics-head">
        <h2 id="tac-h" className="cf-h2">
          Tactics board &amp; set plays
        </h2>
        <p className="cf-lede">
          Select an elite European club and adjust their tactical shape. Drag any player (or focus with arrow keys) to customize positions, then
          run set-piece routines with real stars moving in sync.
        </p>

        {/* Club Selector */}
        <div className="cf-tactics-clubs">
          {TACTIC_CLUBS.map((cid) => {
            const isSelected = cid === activeClub
            return (
              <button
                key={cid}
                type="button"
                className="cf-tactic-club-btn"
                data-active={isSelected}
                onClick={() => {
                  if (playing) return
                  setActiveClub(cid)
                }}
              >
                <Crest club={cid} size={24} />
                <span>{CLUBS[cid].name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="cf-tactics-body">
        <div className="cf-board-wrap">
          <svg
            ref={svgRef}
            className="cf-board"
            viewBox={vertical ? '0 0 68 105' : '0 0 105 68'}
            role="group"
            aria-label={`Tactics board. Eleven ${club.name} players on pitch.`}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <g transform={vertical ? 'translate(0 105) rotate(-90)' : undefined}>
              <g aria-hidden="true">
                {stripes.map((i) => (
                  <rect key={i} x={(i * 105) / 14} y="0" width={105 / 14 + 0.05} height="68" fill={i % 2 ? '#17602f' : '#1d6f37'} />
                ))}
                <g fill="none" stroke="#e9f2e0" strokeWidth="0.3" opacity="0.9">
                  <rect x="0.5" y="0.5" width="104" height="67" />
                  <path d="M52.5 0.5v67" />
                  <circle cx="52.5" cy="34" r="9.15" />
                  <rect x="0.5" y="13.84" width="16.5" height="40.32" />
                  <rect x="88" y="13.84" width="16.5" height="40.32" />
                  <rect x="0.5" y="24.84" width="5.5" height="18.32" />
                  <rect x="99" y="24.84" width="5.5" height="18.32" />
                  <path d="M16.9 27.2a9.15 9.15 0 0 1 0 13.6M88.1 27.2a9.15 9.15 0 0 0 0 13.6" />
                </g>
                <g fill="#e9f2e0" opacity="0.9">
                  <circle cx="52.5" cy="34" r="0.45" />
                  <circle cx="11" cy="34" r="0.4" />
                  <circle cx="94" cy="34" r="0.4" />
                </g>
                <rect x="-1.4" y="30.3" width="1.4" height="7.4" fill="none" stroke="#e9f2e0" strokeWidth="0.25" />
                <rect x="105" y="30.3" width="1.4" height="7.4" fill="none" stroke="#e9f2e0" strokeWidth="0.25" />
              </g>

              {showOpp && (
                <g aria-hidden="true" opacity="0.5">
                  {OPPOSITION.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={r * 0.85} fill="none" stroke="#46e3d1" strokeWidth="0.4" strokeDasharray="1 0.8" />
                  ))}
                </g>
              )}

              <g aria-hidden="true" className="cf-routes" opacity={playing ? 0.18 : 0.8}>
                {Object.keys(play.runs).map((k) => {
                  const pts = pathFor(Number(k))
                  return pts ? (
                    <polyline
                      key={k}
                      points={pts}
                      fill="none"
                      stroke="#d4ff3c"
                      strokeWidth="0.35"
                      strokeDasharray="1.2 0.9"
                      strokeLinecap="round"
                    />
                  ) : null
                })}
                {passLines.map((l) => (
                  <line key={l.key} x1={l.a[0] + 1.7} y1={l.a[1]} x2={l.b[0]} y2={l.b[1]} stroke="#f1f5e9" strokeWidth="0.3" opacity="0.7" />
                ))}
              </g>

              {XI.map((p, i) => (
                <g
                  key={p.n}
                  ref={(el) => void (playerEls.current[i] = el)}
                  className="cf-pl"
                  data-sel={selected === i}
                  data-gk={i === 0}
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.role}, number ${p.n}, ${p.name}. Arrow keys move this player.`}
                  onPointerDown={onDown(i)}
                  onKeyDown={onKey(i)}
                  onFocus={() => setSelected(i)}
                >
                  <circle r={r + 1.5} className="cf-pl-ring" />
                  <circle
                    r={r}
                    className="cf-pl-dot"
                    style={{
                      fill: i === 0 ? '#d4ff3c' : club.primary,
                      stroke: club.secondary,
                    }}
                  />
                  <text
                    className="cf-pl-n"
                    transform={vertical ? 'rotate(90)' : undefined}
                    y={r * 0.38}
                    fontSize={r * 1.15}
                    textAnchor="middle"
                    fill={i === 0 ? '#050c08' : club.textDark ? '#111827' : '#ffffff'}
                  >
                    {p.n}
                  </text>
                </g>
              ))}

              <ellipse ref={ballShadow} rx="1" ry="0.55" fill="#000" opacity="0.5" />
              <g ref={ballEl} aria-hidden="true">
                <circle r="1.05" fill="#f1f5e9" stroke="#0a0f0c" strokeWidth="0.3" />
                <path d="M-0.4-0.3 0 -0.7 0.4-0.3 0.25 0.25H-0.25z" fill="#0a0f0c" />
              </g>
            </g>
          </svg>
          <p className="cf-board-status" role="status">
            {status}
          </p>
        </div>

        <div className="cf-tactics-side">
          <fieldset className="cf-field">
            <legend>Tactical Shape</legend>
            <div className="cf-seg">
              {Object.entries(FORMATIONS).map(([k, f]) => (
                <button
                  key={k}
                  type="button"
                  className="cf-btn cf-btn-small"
                  aria-pressed={formation === k}
                  onClick={() => chooseFormation(k)}
                  disabled={playing}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="cf-formation-desc">{FORMATIONS[formation].desc}</p>
          </fieldset>

          <fieldset className="cf-field">
            <legend>Set-Piece Play</legend>
            <div className="cf-plays">
              {PLAYS.map((p) => (
                <label key={p.id} className="cf-play-opt">
                  <input
                    type="radio"
                    name="cf-play"
                    checked={playId === p.id}
                    onChange={() => setPlayId(p.id)}
                    disabled={playing}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
            <p className="cf-play-blurb">{play.blurb}</p>
          </fieldset>

          <div className="cf-ctl-row">
            <button type="button" className="cf-btn cf-btn-primary" onClick={run}>
              {playing ? 'Stop' : 'Execute Play'}
            </button>
            <button type="button" className="cf-btn" onClick={reset} disabled={playing}>
              Reset Positions
            </button>
          </div>

          <label className="cf-check">
            <input type="checkbox" checked={showOpp} onChange={(e) => setShowOpp(e.target.checked)} />
            <span>Show opponent 4-4-2 defensive shape</span>
          </label>

          {sel && (
            <div className="cf-selected" aria-live="polite">
              <b style={{ color: legibleAccent(club.accent) }}>{sel.n}</b>
              <div>
                <p className="cf-sel-name">{sel.name}</p>
                <p className="cf-sel-role">
                  {sel.role} &bull; OVR {sel.rating} &bull; {sel.foot} Foot
                </p>
                <p className="cf-sel-trait">{sel.trait}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
