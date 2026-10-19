import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WebGLGate, useWebGLAllowed } from '../../shared/webgl'
import { ATTEMPTS, KickGame, type KickOutcome, type KickParams } from './kickgame'
import { useCelebrate } from './celebrate'
import { CLUBS, type ClubId } from './data'
import { Crest } from './crests'

const KickScene = lazy(() => import('./scene/KickScene'))

interface KickerOption {
  id: string
  name: string
  number: number
  clubId: ClubId
  opponentClubId: ClubId
  specialty: string
}

const STAR_KICKERS: KickerOption[] = [
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    number: 9,
    clubId: 'real-madrid',
    opponentClubId: 'barcelona',
    specialty: 'Near-post top corner whip with heavy top-spin',
  },
  {
    id: 'yamal',
    name: 'Lamine Yamal',
    number: 19,
    clubId: 'barcelona',
    opponentClubId: 'real-madrid',
    specialty: 'Left-foot curled arc over the defensive wall',
  },
  {
    id: 'debruyne',
    name: 'Kevin De Bruyne',
    number: 17,
    clubId: 'man-city',
    opponentClubId: 'liverpool',
    specialty: 'Dipping knuckleball with late unpredictable drop',
  },
  {
    id: 'trent',
    name: 'Trent Alexander-Arnold',
    number: 66,
    clubId: 'liverpool',
    opponentClubId: 'man-city',
    specialty: 'David Beckham-esque outswinging whip into side netting',
  },
  {
    id: 'saka',
    name: 'Bukayo Saka',
    number: 7,
    clubId: 'arsenal',
    opponentClubId: 'bayern',
    specialty: 'Controlled inside-foot curler grazing the crossbar',
  },
  {
    id: 'kane',
    name: 'Harry Kane',
    number: 9,
    clubId: 'bayern',
    opponentClubId: 'arsenal',
    specialty: 'Pure power drive drilled low into the corners',
  },
]

const MESSAGES: Record<KickOutcome, string> = {
  goal: 'Goal! Top bins, net rippling.',
  saved: 'Saved! The goalkeeper read the flight.',
  blocked: 'Blocked by the defensive wall.',
  post: 'Off the woodwork! Inches away.',
  wide: 'Wide of the far post.',
  over: 'Over the crossbar.',
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export function KickSection() {
  const allowed = useWebGLAllowed()
  const celebrate = useCelebrate()
  const [selectedKickerId, setSelectedKickerId] = useState<string>('mbappe')
  const [game] = useState(() => new KickGame())
  const [params, setParams] = useState<KickParams>(game.params)
  const [results, setResults] = useState<KickOutcome[]>([])
  const [message, setMessage] = useState('')
  const [phase, setPhase] = useState<'ready' | 'flight' | 'result'>('ready')
  const timer = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)

  const activeKicker = useMemo(
    () => STAR_KICKERS.find((k) => k.id === selectedKickerId) ?? STAR_KICKERS[0],
    [selectedKickerId],
  )
  const kickerClub = CLUBS[activeKicker.clubId]
  const opponentClub = CLUBS[activeKicker.opponentClubId]

  const done = results.length >= ATTEMPTS
  const score = results.filter((r) => r === 'goal').length

  const handleResult = useCallback(
    (o: KickOutcome, n: number) => {
      setMessage(MESSAGES[o])
      if (o === 'goal') {
        celebrate({
          club: activeKicker.clubId,
          title: 'GOAL!',
          sub: `${activeKicker.name} scores! Set piece ${n} of ${ATTEMPTS}`,
        })
      }
    },
    [celebrate, activeKicker],
  )

  useEffect(() => {
    const off = game.on((e) => {
      if (e.type === 'strike') {
        setPhase('flight')
        setMessage('')
      } else if (e.type === 'fx' && e.what === 'post') {
        setMessage('Off the woodwork!')
      } else if (e.type === 'result') {
        setPhase('result')
        setResults([...game.results])
        handleResult(e.outcome, e.attempt)
        window.clearTimeout(timer.current)
        if (e.attempt < ATTEMPTS) {
          timer.current = window.setTimeout(
            () => {
              game.next()
            },
            e.outcome === 'goal' ? 2600 : 1900,
          )
        }
      } else if (e.type === 'ready') {
        setPhase('ready')
        setMessage('')
        setParams({ ...game.params })
      }
    })
    return () => {
      off()
      window.clearTimeout(timer.current)
    }
  }, [game, handleResult])

  const update = (patch: Partial<KickParams>) => {
    if (game.phase !== 'ready') return
    game.params = { ...game.params, ...patch }
    setParams(game.params)
  }

  const strike = () => {
    if (game.phase === 'ready') game.strike()
  }

  const again = () => {
    window.clearTimeout(timer.current)
    setResults([])
    game.reset()
  }

  /* ---------- keyboard controls ---------- */
  const onKey = (e: React.KeyboardEvent) => {
    const p = game.params
    let handled = true
    if (e.key === ' ' || e.key === 'Enter') strike()
    else if (e.shiftKey && e.key === 'ArrowLeft') update({ curve: clamp(p.curve - 0.1, -1, 1) })
    else if (e.shiftKey && e.key === 'ArrowRight') update({ curve: clamp(p.curve + 0.1, -1, 1) })
    else if (e.shiftKey && e.key === 'ArrowUp') update({ power: clamp(p.power + 0.05, 0, 1) })
    else if (e.shiftKey && e.key === 'ArrowDown') update({ power: clamp(p.power - 0.05, 0, 1) })
    else if (e.key === 'ArrowLeft') update({ yaw: clamp(p.yaw - 0.01, -0.35, 0.35) })
    else if (e.key === 'ArrowRight') update({ yaw: clamp(p.yaw + 0.01, -0.35, 0.35) })
    else if (e.key === 'ArrowUp') update({ loft: clamp(p.loft + 0.01, 0.05, 0.65) })
    else if (e.key === 'ArrowDown') update({ loft: clamp(p.loft - 0.01, 0.05, 0.65) })
    else handled = false
    if (handled) e.preventDefault()
  }

  /* ---------- touch / mouse flick swipe ---------- */
  const samples = useRef<{ x: number; y: number; t: number }[]>([])
  const [trail, setTrail] = useState<string>('')
  const onDown = (e: React.PointerEvent) => {
    if (game.phase !== 'ready') return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    samples.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
    setTrail('')
  }
  const onMove = (e: React.PointerEvent) => {
    if (!samples.current.length) return
    samples.current.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    const box = e.currentTarget.getBoundingClientRect()
    setTrail(samples.current.map((s) => `${(s.x - box.left).toFixed(0)},${(s.y - box.top).toFixed(0)}`).join(' '))
  }
  const onUp = (e: React.PointerEvent) => {
    const s = samples.current
    samples.current = []
    setTrail('')
    if (s.length < 2 || game.phase !== 'ready') return
    const stage = stageRef.current?.getBoundingClientRect()
    const H = stage?.height ?? 500
    const a = s[0]
    const z = { x: e.clientX, y: e.clientY, t: performance.now() }
    const dx = z.x - a.x
    const dy = z.y - a.y
    const len = Math.hypot(dx, dy)
    if (dy > -24 || len < 40) {
      setMessage('Flick upward towards the target.')
      return
    }
    const tail = s.filter((p) => z.t - p.t < 160)
    const t0 = tail[0] ?? a
    const speed = Math.hypot(z.x - t0.x, z.y - t0.y) / Math.max(30, z.t - t0.t)
    const power = clamp(speed / 2.2, 0.22, 1)
    const yaw = clamp(Math.atan2(dx, -dy) * 0.5, -0.3, 0.3)
    const loft = clamp(0.18 + (len / (H * 0.5)) * 0.2, 0.15, 0.55)
    let best = 0
    for (const p of s) {
      const sd = ((p.x - a.x) * -dy + (p.y - a.y) * dx) / len
      if (Math.abs(sd) > Math.abs(best)) best = sd
    }
    const curve = clamp((-best / len) * 4, -1, 1)
    game.params = { yaw, loft, curve, power }
    setParams(game.params)
    game.strike()
  }

  const speedKmh = Math.round((13 + 20 * params.power) * 3.6)
  const deg = (r: number) => `${Math.round((r * 180) / Math.PI)}°`
  const dirLabel =
    params.yaw === 0 ? 'Centre' : `${Math.abs(Math.round((params.yaw * 180) / Math.PI))}° ${params.yaw < 0 ? 'left' : 'right'}`
  const curveLabel =
    Math.abs(params.curve) < 0.03 ? 'Straight' : `${Math.round(Math.abs(params.curve) * 100)}% ${params.curve < 0 ? 'left' : 'right'}`
  const kickNo = Math.min(results.length + 1, ATTEMPTS)
  const locked = phase !== 'ready'

  const pips = useMemo(
    () =>
      Array.from({ length: ATTEMPTS }, (_, i) => {
        const r = results[i]
        return { r, label: r ? MESSAGES[r] : i === results.length ? 'Next' : 'To come' }
      }),
    [results],
  )

  const fallback = <KickFallback results={results} setResults={setResults} onResult={handleResult} disabled={done} />

  return (
    <section className="cf-kick" id="kick" aria-labelledby="kick-h">
      <div className="cf-kick-head">
        <h2 id="kick-h" className="cf-h2">
          Interactive free-kick range
        </h2>
        <p className="cf-lede">
          Five set-piece angles, a defensive wall at 9.15 metres, and an agile goalkeeper. The simulation models gravity,
          drag, Magnus spin curvature, and woodwork bounces. Choose a world-class kicker and bend your strike into the top corner.
        </p>

        {/* Kicker Selector Strip */}
        <div className="cf-kicker-strip" role="group" aria-label="Select kicker">
          {STAR_KICKERS.map((k) => {
            const isSelected = k.id === selectedKickerId
            return (
              <button
                key={k.id}
                type="button"
                className="cf-kicker-btn"
                data-selected={isSelected}
                onClick={() => setSelectedKickerId(k.id)}
              >
                <Crest club={k.clubId} size={22} />
                <span className="cf-kicker-btn-name">{k.name}</span>
                <span className="cf-kicker-btn-num">
                  #{k.number}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="cf-kick-copy">
        {/* Selected Kicker Spotlight */}
        <div className="cf-kicker-spotlight">
          <div className="cf-kicker-spotlight-top">
            <Crest club={activeKicker.clubId} size={36} />
            <div>
              <p className="cf-kicker-spot-name">{activeKicker.name}</p>
              <p className="cf-kicker-spot-club">
                {kickerClub.name} vs {opponentClub.name}
              </p>
            </div>
          </div>
          <p className="cf-kicker-specialty">{activeKicker.specialty}</p>
        </div>

        <div className="cf-scoreline" aria-live="polite">
          <ol className="cf-pips" aria-label={`Free kicks: ${score} goals from ${results.length} taken`}>
            {pips.map((p, i) => (
              <li key={i} data-r={p.r ?? ''} data-now={!p.r && i === results.length}>
                <span className="sr-only">{`Kick ${i + 1}: ${p.label}`}</span>
              </li>
            ))}
          </ol>
          <p className="cf-score-num">
            <b>{score}</b>
            <span> from {ATTEMPTS}</span>
          </p>
        </div>

        {allowed && (
          <div className="cf-controls" role="group" aria-label="Shot trajectory controls">
            <Slider
              id="k-dir"
              label="Horizontal Aim"
              value={params.yaw}
              min={-0.35}
              max={0.35}
              step={0.005}
              out={dirLabel}
              onChange={(v) => update({ yaw: v })}
              disabled={locked}
            />
            <Slider
              id="k-loft"
              label="Elevation / Loft"
              value={params.loft}
              min={0.05}
              max={0.65}
              step={0.005}
              out={deg(params.loft)}
              onChange={(v) => update({ loft: v })}
              disabled={locked}
            />
            <Slider
              id="k-curve"
              label="Magnus Spin (Curve)"
              value={params.curve}
              min={-1}
              max={1}
              step={0.02}
              out={curveLabel}
              onChange={(v) => update({ curve: v })}
              disabled={locked}
            />
            <Slider
              id="k-power"
              label="Shot Power"
              value={params.power}
              min={0}
              max={1}
              step={0.01}
              out={`${speedKmh} km/h`}
              onChange={(v) => update({ power: v })}
              disabled={locked}
            />
            <div className="cf-ctl-row">
              <button
                type="button"
                className="cf-btn cf-btn-primary"
                onClick={strike}
                disabled={locked || done}
              >
                Strike the Ball
              </button>
              {done && (
                <button type="button" className="cf-btn" onClick={again}>
                  Reset Range
                </button>
              )}
            </div>
          </div>
        )}

        {!allowed && done && (
          <button type="button" className="cf-btn" onClick={() => setResults([])}>
            Reset Range
          </button>
        )}

        <p className="cf-hint">
          {allowed
            ? 'Swipe / flick upward directly on the pitch to bend. Keyboard: Arrow keys aim, Shift + Arrows curve/power, Space or Enter strikes.'
            : 'Motion reduced or WebGL inactive: pick target zones inside the net.'}
        </p>
      </div>

      <div className="cf-kick-stage-wrap">
        <div
          ref={stageRef}
          className="cf-kick-stage"
          tabIndex={allowed ? 0 : -1}
          role={allowed ? 'group' : undefined}
          aria-label={
            allowed
              ? 'Free-kick pitch view. Aim with arrows, curve with Shift+arrows, Space to strike.'
              : undefined
          }
          onKeyDown={allowed ? onKey : undefined}
        >
          {allowed ? (
            <WebGLGate className="cf-kick-gate" fallback={fallback}>
              {(active) => (
                <Suspense fallback={<div className="cf-kick-loading">Preparing free-kick turf…</div>}>
                  <KickScene
                    active={active}
                    game={game}
                    kickerClub={activeKicker.clubId}
                    wallClub={activeKicker.opponentClubId}
                  />
                </Suspense>
              )}
            </WebGLGate>
          ) : (
            fallback
          )}

          {allowed && (
            <>
              <div className="cf-kick-hud" aria-hidden="true">
                <span>
                  Kick <b>{kickNo}</b> of {ATTEMPTS} &bull; {activeKicker.name}
                </span>
              </div>
              <div
                className="cf-flick-pad"
                data-locked={locked}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={() => {
                  samples.current = []
                  setTrail('')
                }}
                aria-hidden="true"
              >
                {trail && (
                  <svg className="cf-trail" aria-hidden="true">
                    <polyline points={trail} />
                  </svg>
                )}
                <span className="cf-flick-label">{locked ? '' : 'Flick upward here'}</span>
              </div>
            </>
          )}

          <div className="cf-kick-msg" data-show={!!message} role="status">
            {message}
          </div>

          {done && (
            <div className="cf-kick-final" role="status">
              <p className="cf-kick-final-n">
                {score}
                <span> / {ATTEMPTS}</span>
              </p>
              <p>
                {score >= 4
                  ? `${activeKicker.name} caliber. Top-tier technique.`
                  : score >= 2
                    ? 'Respectable execution. Ready for European nights.'
                    : 'Back to the training pitch.'}
              </p>
              <button type="button" className="cf-btn cf-btn-primary" onClick={again}>
                Take 5 More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  out,
  onChange,
  disabled,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  out: string
  onChange: (v: number) => void
  disabled: boolean
}) {
  return (
    <div className="cf-slider">
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>{out}</output>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

/* ---------------- 2D fallback for reduced motion / no WebGL ---------------- */

const ZONES = [
  ['Top left', 0, 0],
  ['Top centre', 1, 0],
  ['Top right', 2, 0],
  ['Low left', 0, 1],
  ['Low centre', 1, 1],
  ['Low right', 2, 1],
] as const

function KickFallback({
  results,
  setResults,
  onResult,
  disabled,
}: {
  results: KickOutcome[]
  setResults: React.Dispatch<React.SetStateAction<KickOutcome[]>>
  onResult: (o: KickOutcome, n: number) => void
  disabled: boolean
}) {
  const [keeper, setKeeper] = useState<[number, number] | null>(null)
  const [shot, setShot] = useState<[number, number] | null>(null)
  const take = (zx: number, zy: number) => {
    if (disabled) return
    const gk: [number, number] =
      Math.random() < 0.42 ? [zx, zy] : [Math.floor(Math.random() * 3), Math.floor(Math.random() * 2)]
    setKeeper(gk)
    setShot([zx, zy])
    const miss = Math.random() < 0.12
    const outcome: KickOutcome = miss ? 'wide' : gk[0] === zx && gk[1] === zy ? 'saved' : 'goal'
    setResults((r) => [...r, outcome])
    onResult(outcome, results.length + 1)
  }

  return (
    <div className="cf-kick-2d">
      <svg viewBox="0 0 480 300" role="img" aria-label="Goal with six target zones">
        <rect width="480" height="300" fill="#0b180f" />
        <path d="M0 220h480v80H0z" fill="#1a6531" />
        <path d="M0 220h480" stroke="#f1f5e9" strokeWidth="3" />
        <rect x="80" y="60" width="320" height="160" fill="none" stroke="#f1f5e9" strokeWidth="6" />
        <g stroke="#f1f5e9" strokeOpacity=".25">
          {Array.from({ length: 15 }, (_, i) => (
            <path key={i} d={`M${80 + i * 22.8} 60V220`} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M80 ${60 + i * 26.6}H400`} />
          ))}
        </g>
        {keeper && (
          <rect
            x={96 + keeper[0] * 100}
            y={68 + keeper[1] * 70}
            width="84"
            height="76"
            rx="10"
            fill="#d4ff3c"
            opacity=".85"
          />
        )}
        {shot && (
          <circle
            cx={130 + shot[0] * 110}
            cy={105 + shot[1] * 70}
            r="13"
            fill="#f1f5e9"
            stroke="#0b180f"
            strokeWidth="3"
          />
        )}
      </svg>
      <div className="cf-zones" role="group" aria-label="Choose where to shoot">
        {ZONES.map(([name, zx, zy]) => (
          <button
            key={name}
            type="button"
            className="cf-zone"
            onClick={() => take(zx, zy)}
            disabled={disabled}
            aria-label={`Shoot ${name.toLowerCase()}`}
            style={{ gridColumn: zx + 1, gridRow: zy + 1 }}
          />
        ))}
      </div>
    </div>
  )
}
