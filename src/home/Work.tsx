import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../shared/Reveal'
import { WebGLGate, useWebGLAllowed } from '../shared/webgl'
import { CASES, CONCEPTS, type CaseRow } from './data'
import ConceptArt from './concepts/ConceptArt'

const ConceptStage = lazy(() => import('./concepts/ConceptStage'))

function Arrow() {
  return (
    <svg className="h-row-arrow" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 15L15 5M7 5h8v8" />
    </svg>
  )
}

/** The hover preview that follows the cursor. Desktop with a fine pointer only. */
function Peek({ item, armed }: { item: CaseRow | null; armed: boolean }) {
  return (
    <div className="h-peek" aria-hidden="true" data-on={item ? 'true' : 'false'}>
      <div className="h-peek-in">
        {armed
          ? CASES.map((c) => (
              <div key={c.href} className="h-peek-item" data-active={item?.href === c.href ? 'true' : 'false'} data-tall={c.shot && c.shot.h > c.shot.w ? 'true' : 'false'}>
                {c.shot ? (
                  <img src={c.shot.src} width={c.shot.w} height={c.shot.h} alt="" decoding="async" />
                ) : (
                  <div className="h-peek-draw" style={{ '--tint': c.tint } as CSSProperties}>
                    <span>{c.name}</span>
                  </div>
                )}
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

function CaseRows() {
  const [hot, setHot] = useState<CaseRow | null>(null)
  const [armed, setArmed] = useState(false)
  const [fine, setFine] = useState(false)
  const peek = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const on = () => setFine(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const move = (e: PointerEvent<HTMLOListElement>) => {
    if (!fine) return
    const el = peek.current?.querySelector<HTMLElement>('.h-peek')
    if (!el) return
    const w = 340
    const x = Math.min(window.innerWidth - w - 24, e.clientX + 28)
    el.style.transform = `translate3d(${Math.max(12, x)}px, ${e.clientY}px, 0)`
  }

  return (
    <div ref={peek}>
      <ol className="h-rows" onPointerMove={move} onPointerLeave={() => setHot(null)}>
        {CASES.map((c, i) => (
          <Reveal as="li" key={c.href} className="h-row" delay={Math.min(i, 3) * 40}>
            <Link
              to={c.href}
              onPointerEnter={(e) => {
                if (!fine) return
                setArmed(true)
                setHot(c)
                move(e as unknown as PointerEvent<HTMLOListElement>)
              }}
              onFocus={() => fine && setHot(null)}
            >
              <span className="h-row-name">{c.name}</span>
              <span className="h-row-what">{c.what}</span>
              <span className="h-row-fig">
                <b>{c.figure}</b>
                <i>{c.figureLabel}</i>
              </span>
              <span className="h-row-meta">
                <span className="h-row-year">{c.year}</span>
                <span className="h-row-status">{c.status}</span>
              </span>
              <Arrow />
            </Link>
          </Reveal>
        ))}
      </ol>
      {fine ? <Peek item={hot} armed={armed} /> : null}
    </div>
  )
}

/** Mounts the WebGL cards the first time the section comes near the viewport, not on page load. */
function StageOnce({ active }: { active: boolean }) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (active) setSeen(true)
  }, [active])
  if (!seen) return null
  return (
    <Suspense fallback={null}>
      <ConceptStage active={active} />
    </Suspense>
  )
}

function Concepts() {
  const allowed = useWebGLAllowed()
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const showStage = allowed && wide

  return (
    <div className="h-cc" id="concepts">
      <Reveal as="div" className="h-cc-head">
        <h3 id="h-cc-title">Concept builds</h3>
        <p className="h-voice k-voice">Four sites I made to show range. Fictional or unofficial, never client work.</p>
      </Reveal>

      {showStage ? (
        <div className="h-cc-stage">
          <WebGLGate className="h-cc-gate" fallback={null}>
            {(active) => <StageOnce active={active} />}
          </WebGLGate>
        </div>
      ) : null}

      <ul className={`h-cc-list${showStage ? ' is-text' : ''}`} aria-labelledby="h-cc-title">
        {CONCEPTS.map((c) => (
          <li key={c.key}>
            <Link to={c.href} data-concept={c.key}>
              {!showStage ? <ConceptArt k={c.key} label={`${c.name} concept card`} /> : null}
              <span className="h-cc-name">{c.name}</span>
              <span className="h-cc-line">{c.line}</span>
              <span className="h-cc-note">
                {c.note} <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Work() {
  return (
    <section className="h-work" id="work" aria-labelledby="h-work-title">
      <Reveal as="header" className="h-sec-head">
        <h2 id="h-work-title">Work</h2>
        <p className="h-voice k-voice">Things that shipped, with the one number that matters.</p>
      </Reveal>
      <CaseRows />
      <Concepts />
    </section>
  )
}
