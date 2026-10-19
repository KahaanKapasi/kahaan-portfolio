import { lazy, Suspense, useEffect, useRef } from 'react'
import { WebGLGate, useWebGLAllowed } from '../../shared/webgl'
import { telemetry } from './scene/flypath'
import { Crest } from './crests'
import { Aerial } from './Aerial'
import { CLUBS, MATCH } from './data'

const FlyScene = lazy(() => import('./scene/FlyScene'))

export function Hero() {
  const allowed = useWebGLAllowed()
  const sectionRef = useRef<HTMLElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const alt = useRef<HTMLElement>(null)
  const spd = useRef<HTMLElement>(null)
  const dist = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!allowed) return
    let raf = 0
    let lastStage = -1
    const update = () => {
      raf = 0
      const el = sectionRef.current
      const root = rootRef.current
      if (!el || !root) return
      const rect = el.getBoundingClientRect()
      const total = Math.max(1, rect.height - window.innerHeight)
      const p = Math.min(1, Math.max(0, -rect.top / total))
      progress.current = p
      root.style.setProperty('--p', p.toFixed(4))
      const stage = p < 0.07 ? 0 : p < 0.3 ? 1 : p < 0.58 ? 2 : p < 0.86 ? 3 : 4
      if (stage !== lastStage) {
        lastStage = stage
        root.dataset.stage = String(stage)
      }
      const t = telemetry(p)
      if (alt.current) alt.current.textContent = String(Math.round(t.altitude))
      if (dist.current) dist.current.textContent = String(Math.round(t.toGoal))
      if (spd.current) spd.current.textContent = String(Math.round(t.speed))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    update()
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [allowed])

  const staticMode = !allowed
  const fallback = <Aerial />
  const homeClub = CLUBS[MATCH.home]
  const awayClub = CLUBS[MATCH.away]

  return (
    <section
      ref={sectionRef}
      className="cf-fly"
      data-mode={staticMode ? 'static' : 'scroll'}
      id="top"
      aria-label="Footonomy matchday showcase"
    >
      <div ref={rootRef} className="cf-fly-stick" data-stage="0">
        <div className="cf-fly-canvas">
          <WebGLGate className="cf-gate" fallback={fallback}>
            {(active) => (
              <Suspense fallback={fallback}>
                <FlyScene active={active} progress={progress} />
              </Suspense>
            )}
          </WebGLGate>
        </div>
        <div className="cf-fly-shade" aria-hidden="true" />

        <div className="cf-intro">
          <h1 className="cf-title">
            <span className="cf-title-1">Footonomy</span>
            <span className="cf-title-2">The Showpiece</span>
          </h1>

          <div className="cf-fixture">
            <div className="cf-side">
              <Crest club={MATCH.home} size={58} />
              <span>
                <b>{homeClub.name}</b>
                <i>{homeClub.nickname} &bull; {homeClub.league}</i>
              </span>
            </div>
            <span className="cf-v">v</span>
            <div className="cf-side cf-side-r">
              <span>
                <b>{awayClub.name}</b>
                <i>{awayClub.nickname} &bull; {awayClub.league}</i>
              </span>
              <Crest club={MATCH.away} size={58} />
            </div>
          </div>

          <p className="cf-where">
            {MATCH.venue}, {MATCH.capacity} capacity. Interactive 3D stadium fly-through, rotatable 3D kit models, tactics simulator, and free-kick range.
          </p>

          <div className="cf-cta">
            <a className="cf-btn cf-btn-primary" href="#player-3d">
              Inspect 3D Players
            </a>
            <a className="cf-btn" href="#kick">
              Take Free Kick
            </a>
            <a className="cf-btn" href="#tactics">
              Tactics Board
            </a>
          </div>
        </div>

        {allowed && (
          <>
            <div className="cf-chapters" aria-live="off">
              <div className="cf-chapter" data-s="1">
                <h2>{MATCH.venue}</h2>
                <p>{MATCH.capacity} seats under four floodlight towers. The grand European stage is lit for El Clásico.</p>
              </div>
              <div className="cf-chapter" data-s="2">
                <h2>Down through the roof line</h2>
                <p>The roof opens over 105 by 68 metres of hybrid turf, striped and primed for European football royalty.</p>
              </div>
              <div className="cf-chapter" data-s="3">
                <h2>Touchline level</h2>
                <p>Dynamic perimeter boards ripple past with live match telemetry. The net waits at the south stand.</p>
              </div>
              <div className="cf-chapter" data-s="4">
                <h2>Eleven metres out</h2>
                <p>The ball is on the penalty spot. Step up and bend your shot past the wall.</p>
                <a className="cf-btn cf-btn-primary" href="#kick">
                  Take the kick
                </a>
              </div>
            </div>

            <dl className="cf-hud" aria-hidden="true">
              <div>
                <dt>Altitude</dt>
                <dd>
                  <b ref={alt}>96</b> m
                </dd>
              </div>
              <div>
                <dt>Speed</dt>
                <dd>
                  <b ref={spd}>0</b> km/h
                </dd>
              </div>
              <div>
                <dt>To goal</dt>
                <dd>
                  <b ref={dist}>150</b> m
                </dd>
              </div>
            </dl>

            <div className="cf-rail" aria-hidden="true">
              <i />
            </div>

            <p className="cf-scrollcue" aria-hidden="true">
              Scroll to fly through
            </p>
          </>
        )}
      </div>
    </section>
  )
}
