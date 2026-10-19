import { useEffect, useMemo, useRef, useState } from 'react'
import { useInViewport } from '../../shared/webgl'
import { CLUBS, MATCH, MATCH_EVENTS, legibleAccent, type ClubId, type MatchEvent } from './data'
import { Crest } from './crests'
import { useCelebrate } from './celebrate'

const MIN_SECONDS = 0.8 // real seconds per match minute at 1x
const HT_HOLD = 2.4

function EvIcon({ kind }: { kind: MatchEvent['kind'] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (kind === 'goal')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5 16 10.4 14.5 15h-5L8 10.4z" />
        <path d="M12 3v4.5M20.5 9.5 16 10.4M17.5 19l-3-4M6.5 19l3-4M3.5 9.5 8 10.4" />
      </svg>
    )
  if (kind === 'yellow')
    return (
      <svg {...common}>
        <rect x="6.5" y="3.5" width="11" height="17" rx="1.5" fill="#ffd21f" stroke="#0a0f0c" strokeWidth="1" />
      </svg>
    )
  return (
    <svg {...common}>
      <circle cx="9" cy="14" r="5" />
      <path d="M13 11l7-5M14 8l4-2.5M9 11.5v3l2 .5" />
    </svg>
  )
}

function Bar({
  label,
  a,
  b,
  colorA,
  colorB,
  fmt = (n: number) => String(n),
}: {
  label: string
  a: number
  b: number
  colorA: string
  colorB: string
  fmt?: (n: number) => string
}) {
  const tot = a + b || 1
  return (
    <div className="cf-stat">
      <span className="cf-stat-v" style={{ color: colorA }}>
        {fmt(a)}
      </span>
      <span className="cf-stat-l">{label}</span>
      <span className="cf-stat-v" style={{ color: colorB }}>
        {fmt(b)}
      </span>
      <span className="cf-stat-bar" aria-hidden="true">
        <i style={{ width: `${(a / tot) * 100}%`, background: colorA }} />
        <i style={{ width: `${(b / tot) * 100}%`, background: colorB }} />
      </span>
    </div>
  )
}

function momentum(m: number) {
  let v = 0.5 * Math.sin(m / 7.3 + 1) + 0.28 * Math.sin(m / 2.9)
  for (const e of MATCH_EVENTS) {
    if (e.kind !== 'goal') continue
    const d = (m - e.min) / 4.5
    v += (e.club === MATCH.home ? 0.8 : -0.8) * Math.exp(-d * d)
  }
  return Math.max(-1, Math.min(1, v))
}

const CHART_W = 600
const CHART_H = 150

export function Matchday() {
  const celebrate = useCelebrate()
  const secRef = useRef<HTMLElement>(null)
  const inView = useInViewport(secRef, '-10% 0px')
  const [t, setT] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [userRun, setUserRun] = useState(true)
  const [flashKey, setFlashKey] = useState(0)
  const sim = useRef({ t: 0, hold: 0, idx: 0, shown: 0 })
  const speedRef = useRef(speed)
  speedRef.current = speed
  const running = userRun && inView && t < 90

  const home = CLUBS[MATCH.home]
  const away = CLUBS[MATCH.away]

  const fireEvent = (e: MatchEvent) => {
    if (e.kind === 'goal') {
      setFlashKey((k) => k + 1)
      celebrate({
        club: e.club,
        title: 'GOAL!',
        sub: `${e.player ?? CLUBS[e.club].name}, ${e.min}'`,
      })
    }
  }

  useEffect(() => {
    if (!running) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const s = sim.current
      if (s.hold > 0) s.hold -= dt
      else {
        s.t = Math.min(90, s.t + (dt / MIN_SECONDS) * speedRef.current)
        while (s.idx < MATCH_EVENTS.length && MATCH_EVENTS[s.idx].min <= s.t) {
          const e = MATCH_EVENTS[s.idx++]
          if (e.kind === 'ht') s.hold = HT_HOLD / Math.max(1, speedRef.current * 0.6)
          fireEvent(e)
        }
      }
      const q = Math.floor(s.t * 5)
      if (q !== s.shown) {
        s.shown = q
        setT(s.t)
      }
      if (s.t < 90) raf = requestAnimationFrame(tick)
      else setT(90)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const restart = () => {
    sim.current = { t: 0, hold: 0, idx: 0, shown: 0 }
    setT(0)
    setUserRun(true)
  }
  const skip = () => {
    const s = sim.current
    const next = MATCH_EVENTS.find((e, i) => i >= s.idx && (e.kind === 'goal' || e.kind === 'ft'))
    if (!next) return
    s.t = Math.max(s.t, next.min - 0.6)
    while (s.idx < MATCH_EVENTS.length && MATCH_EVENTS[s.idx].min <= s.t) s.idx++
    s.hold = 0
    setT(s.t)
    setUserRun(true)
  }

  const shown = MATCH_EVENTS.filter((e) => e.min <= t)
  const goals = (c: ClubId) => shown.filter((e) => e.kind === 'goal' && e.club === c).length
  const gHome = goals(MATCH.home)
  const gAway = goals(MATCH.away)
  const minute = Math.floor(t)
  const isHT = t >= 45 && t < 46 && sim.current.hold > 0
  const isFT = t >= 90
  const clock = isFT ? 'FT' : isHT ? 'HT' : `${minute}'`

  const frac = t / 90
  const possHome = Math.round(52 + 6 * Math.sin(t / 11) - (gAway - gHome) * 1.5)
  const shotsHome = Math.floor(frac * 15 + gHome)
  const shotsAway = Math.floor(frac * 12 + gAway)
  const onHome = Math.min(shotsHome, gHome + Math.floor(shotsHome * 0.38))
  const onAway = Math.min(shotsAway, gAway + Math.floor(shotsAway * 0.35))
  const xgHome = frac * 2.1 + gHome * 0.18
  const xgAway = frac * 1.8 + gAway * 0.16

  const chart = useMemo(() => {
    const pts: [number, number][] = []
    for (let m = 0; m <= 90; m++) pts.push([(m / 90) * CHART_W, CHART_H / 2 - momentum(m) * (CHART_H / 2 - 8)])
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('')
    return { line, area: `${line}L${CHART_W} ${CHART_H / 2}L0 ${CHART_H / 2}Z` }
  }, [])

  return (
    <section ref={secRef} className="cf-matchday" id="matchday" aria-labelledby="md-h">
      <div className="cf-md-head">
        <h2 id="md-h" className="cf-h2">
          Matchday live centre
        </h2>
        <p className="cf-lede">
          A high-tempo replay of El Clásico at the Santiago Bernabéu. Goals trigger stadium floodlight flashes, confetti bursts, scoreboard updates,
          and a momentary stadium shake.
        </p>
      </div>

      <div className="cf-board-led" key={flashKey} data-flash={flashKey > 0}>
        <div className="cf-led-team">
          <Crest club={MATCH.home} size={64} />
          <span>
            <b>{home.name}</b>
            <i>{home.short} &bull; {home.nickname}</i>
          </span>
        </div>
        <div className="cf-led-mid">
          <p className="cf-led-score" aria-live="polite" aria-label={`Score: ${home.name} ${gHome}, ${away.name} ${gAway}`}>
            <span style={{ color: legibleAccent(home.accent) }}>{gHome}</span>
            <em>:</em>
            <span style={{ color: legibleAccent(away.accent) }}>{gAway}</span>
          </p>
          <p className="cf-led-clock" data-live={running && !isHT}>
            {running && !isHT && <i aria-hidden="true" />}
            {clock}
          </p>
        </div>
        <div className="cf-led-team cf-led-team-r">
          <span>
            <b>{away.name}</b>
            <i>{away.short} &bull; {away.nickname}</i>
          </span>
          <Crest club={MATCH.away} size={64} />
        </div>
      </div>
      <p className="cf-led-venue">
        {MATCH.competition} &bull; {MATCH.round} at {MATCH.venue} ({MATCH.capacity} capacity)
      </p>

      <div className="cf-md-controls">
        <button
          type="button"
          className="cf-btn cf-btn-small"
          onClick={() => setUserRun((v) => !v)}
          disabled={isFT}
          aria-pressed={!userRun}
        >
          {userRun ? 'Pause' : 'Resume'}
        </button>
        <button type="button" className="cf-btn cf-btn-small" onClick={skip} disabled={isFT}>
          Next Big Moment
        </button>
        <button type="button" className="cf-btn cf-btn-small" onClick={restart}>
          Restart Match
        </button>
        <div className="cf-seg" role="group" aria-label="Replay speed">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              type="button"
              className="cf-btn cf-btn-small"
              aria-pressed={speed === s}
              onClick={() => setSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="cf-md-grid">
        <div className="cf-md-feed">
          <h3 className="cf-h3">Match Events</h3>
          {shown.length === 0 ? (
            <p className="cf-empty">Waiting for kick-off whistle…</p>
          ) : (
            <ol className="cf-events" aria-live="polite">
              {[...shown].reverse().map((e) => (
                <li key={`${e.min}-${e.kind}-${e.player ?? ''}`} data-kind={e.kind} data-club={e.club}>
                  <span className="cf-ev-min">{e.min}&rsquo;</span>
                  <span
                    className="cf-ev-ic"
                    style={{
                      color:
                        e.kind === 'yellow'
                          ? '#ffd21f'
                          : e.kind === 'goal'
                            ? CLUBS[e.club].accent
                            : 'var(--muted)',
                    }}
                  >
                    <EvIcon kind={e.kind} />
                  </span>
                  <span className="cf-ev-txt">
                    <b>
                      {e.kind === 'goal'
                        ? `Goal! ${e.player}`
                        : e.kind === 'yellow'
                          ? `Yellow card: ${e.player}`
                          : e.note}
                    </b>
                    {e.kind !== 'ht' && e.kind !== 'ft' && (
                      <i>
                        {CLUBS[e.club].name} &bull; {e.note}
                      </i>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="cf-md-stats">
          <h3 className="cf-h3">Live Match Statistics</h3>
          <Bar
            label="Possession"
            a={possHome}
            b={100 - possHome}
            colorA={home.accent}
            colorB={away.accent}
            fmt={(n) => `${n}%`}
          />
          <Bar label="Shots Total" a={shotsHome} b={shotsAway} colorA={home.accent} colorB={away.accent} />
          <Bar label="On Target" a={onHome} b={onAway} colorA={home.accent} colorB={away.accent} />
          <Bar
            label="Corners"
            a={Math.floor(frac * 7)}
            b={Math.floor(frac * 5)}
            colorA={home.accent}
            colorB={away.accent}
          />
          <Bar
            label="Expected Goals (xG)"
            a={Number(xgHome.toFixed(2))}
            b={Number(xgAway.toFixed(2))}
            colorA={home.accent}
            colorB={away.accent}
            fmt={(n) => n.toFixed(2)}
          />
        </div>
      </div>

      <figure className="cf-momentum">
        <figcaption>
          <h3 className="cf-h3">Match Momentum &amp; Pressure</h3>
          <span>Dominance curve by minute. Above line: {home.name}. Below: {away.name}.</span>
        </figcaption>
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H + 22}`}
          role="img"
          aria-label={`Momentum chart up to minute ${minute}. Real Madrid pressure is shown above the centre line, Barcelona below.`}
        >
          <defs>
            <clipPath id="cf-mom-up">
              <rect x="0" y="0" width={(frac * CHART_W).toFixed(1)} height={CHART_H / 2} />
            </clipPath>
            <clipPath id="cf-mom-down">
              <rect x="0" y={CHART_H / 2} width={(frac * CHART_W).toFixed(1)} height={CHART_H / 2} />
            </clipPath>
          </defs>
          <path d={chart.area} fill={home.accent} opacity="0.85" clipPath="url(#cf-mom-up)" />
          <path d={chart.area} fill={away.primary} opacity="0.85" clipPath="url(#cf-mom-down)" />
          <path d={`M0 ${CHART_H / 2}H${CHART_W}`} stroke="var(--line-strong)" strokeWidth="1" />
          {[0, 15, 30, 45, 60, 75, 90].map((m) => (
            <g key={m}>
              <path d={`M${(m / 90) * CHART_W} ${CHART_H}v5`} stroke="var(--line-strong)" />
              <text
                x={(m / 90) * CHART_W}
                y={CHART_H + 18}
                textAnchor={m === 0 ? 'start' : m === 90 ? 'end' : 'middle'}
                fill="var(--muted)"
                fontSize="11"
              >
                {m}&rsquo;
              </text>
            </g>
          ))}
          {shown
            .filter((e) => e.kind === 'goal')
            .map((e) => (
              <g key={e.min}>
                <path
                  d={`M${(e.min / 90) * CHART_W} 0V${CHART_H}`}
                  stroke="#f1f5e9"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
                <circle
                  cx={(e.min / 90) * CHART_W}
                  cy={e.club === MATCH.home ? 8 : CHART_H - 8}
                  r="5"
                  fill="#f1f5e9"
                  stroke="#050c08"
                  strokeWidth="2"
                />
              </g>
            ))}
        </svg>
      </figure>
    </section>
  )
}
