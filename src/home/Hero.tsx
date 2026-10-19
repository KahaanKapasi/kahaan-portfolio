import { lazy, Suspense, useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { WebGLGate, useWebGLAllowed } from '../shared/webgl'
import { EMAIL, HIRE_HREF, LINKEDIN, LINKEDIN_LABEL } from './data'
import type { Ptr, Scroll } from './scene/NameScene'

const NameScene = lazy(() => import('./scene/NameScene'))

/** Static name: shown first, and kept when WebGL is off or motion is reduced. */
function StaticName({ hidden }: { hidden?: boolean }) {
  return (
    <div className={`h-static${hidden ? ' is-hidden' : ''}`} aria-hidden="true">
      <span className="h-static-a">KAHAAN</span>
      <span className="h-static-b">KAPASI</span>
      <span className="h-static-eq">
        {Array.from({ length: 28 }, (_, i) => (
          <i key={i} style={{ height: `${8 + ((i * 37) % 11) * 6}%` }} />
        ))}
      </span>
    </div>
  )
}

export default function Hero() {
  const stage = useRef<HTMLDivElement>(null)
  const ptr = useRef<Ptr>({ x: 0, y: 0, on: false })
  const scroll = useRef<Scroll>({ v: 0 })
  const allowed = useWebGLAllowed()
  const [live, setLive] = useState(false)
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth < 720)

  // Phone layout flips the lockup; re-evaluate on resize/rotate.
  useEffect(() => {
    const on = () => setCompact(window.innerWidth < 720)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // Scroll speed -> 0..1, eased down when scrolling stops. Cheap: no layout reads.
  useEffect(() => {
    if (!allowed) return
    let last = window.scrollY
    let lastT = performance.now()
    let raf = 0
    const onScroll = () => {
      const now = performance.now()
      const dy = Math.abs(window.scrollY - last)
      const dt = Math.max(8, now - lastT)
      last = window.scrollY
      lastT = now
      scroll.current.v = Math.max(scroll.current.v, Math.min(1, (dy / dt) * 0.55))
    }
    const decay = () => {
      scroll.current.v *= 0.93
      if (scroll.current.v < 0.002) scroll.current.v = 0
      raf = requestAnimationFrame(decay)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(decay)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [allowed])

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = stage.current
    if (!el) return
    const r = el.getBoundingClientRect()
    ptr.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
    ptr.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
    ptr.current.on = Math.abs(ptr.current.x) <= 1.05 && Math.abs(ptr.current.y) <= 1.05
  }
  const onLeave = () => {
    ptr.current.on = false
    ptr.current.x = 0
    ptr.current.y = 0
  }
  const onLive = useCallback(() => setLive(true), [])

  return (
    <section
      className="h-hero"
      id="top"
      aria-labelledby="h-name"
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={onLeave}
      onPointerUp={(e) => e.pointerType === 'touch' && onLeave()}
    >
      <div className="h-stage" ref={stage}>
        <StaticName hidden={allowed && live} />
        {allowed ? (
          <WebGLGate className="h-stage-gl" fallback={null}>
            {(active) => (
              <Suspense fallback={null}>
                <NameScene active={active} pointer={ptr} scroll={scroll} compact={compact} onLive={onLive} />
              </Suspense>
            )}
          </WebGLGate>
        ) : null}
      </div>

      <div className="h-hero-copy">
        <h1 id="h-name" className="sr-only">
          Kahaan Kapasi, freelance web developer
        </h1>
        <p className="h-hero-line">
          I build business websites, product catalogues you can edit yourself, and web apps for small and mid-size
          companies. One person, start to finish.
        </p>
        <div className="h-hero-actions">
          <a className="h-btn h-btn-solid" href="#work">
            <span>See work</span>
          </a>
          <a className="h-btn h-btn-ghost" href={HIRE_HREF}>
            <span>Email me</span>
          </a>
        </div>
        <p className="h-hero-contact">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <span aria-hidden="true">/</span>
          <a href={LINKEDIN} target="_blank" rel="me noopener noreferrer">
            {LINKEDIN_LABEL}
          </a>
        </p>
      </div>
    </section>
  )
}
