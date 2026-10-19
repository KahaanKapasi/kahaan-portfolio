import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { WebGLGate, usePrefersReducedMotion, useInViewport } from '../../shared/webgl'
import { PROJECTS } from './render/scenes'
import StaticStack from './StaticStack'

const ProjectScene = lazy(() => import('./ProjectScene'))

function useTexSize(): [number, number] {
  const [s] = useState<[number, number]>(() => (typeof window !== 'undefined' && window.innerWidth < 720 ? [640, 800] : [900, 1125]))
  return s
}

const Arrow = ({ dir }: { dir: 'l' | 'r' }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'l' ? 'M20 12H4M10 6l-6 6 6 6' : 'M4 12h16M14 6l6 6-6 6'} />
  </svg>
)

export default function Hero() {
  const [i, setI] = useState(0)
  const reduced = usePrefersReducedMotion()
  const size = useTexSize()
  const wrap = useRef<HTMLDivElement>(null)
  const visible = useInViewport(wrap, '0px')
  const hold = useRef(false)
  const p = PROJECTS[i]

  useEffect(() => {
    if (reduced || !visible) return
    const id = window.setTimeout(() => {
      if (!hold.current) setI((x) => (x + 1) % PROJECTS.length)
    }, 7000)
    return () => window.clearTimeout(id)
  }, [i, reduced, visible])

  const go = (n: number) => setI((n + PROJECTS.length) % PROJECTS.length)

  return (
    <section className="ca-hero" id="projects" aria-labelledby="ca-h1">
      <div className="ca-hero__text">
        <h1 id="ca-h1">
          Rooms that <em>hold</em> the light.
        </h1>
        <p className="ca-hero__lede">
          Aldermoor is an architecture and interiors studio. We draw houses, libraries and public rooms around one question: where does
          the sun land at ten, at noon, at four?
        </p>
      </div>

      <div className="ca-viewer" ref={wrap} onPointerEnter={() => (hold.current = true)} onPointerLeave={() => (hold.current = false)} onFocus={() => (hold.current = true)} onBlur={() => (hold.current = false)}>
        <div className="ca-viewer__media" role="img" aria-label={`Computer-generated render: ${p.name}, ${p.kind.toLowerCase()}. ${p.note}`}>
          <WebGLGate className="ca-gate" fallback={<StaticStack index={i} size={size} />}>
            {(active) => (
              <Suspense fallback={<StaticStack index={i} size={size} />}>
                <ProjectScene active={active} index={i} texSize={size} />
              </Suspense>
            )}
          </WebGLGate>
          <svg className="ca-marks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 6V2h4M94 2h4v4M98 94v4h-4M6 98H2v-4" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="ca-viewer__bar">
          <div className="ca-viewer__cap" aria-live="polite">
            <p className="ca-viewer__name">{p.name}</p>
            <p className="ca-viewer__meta">
              {p.kind}, {p.place}, {p.year}, {p.area}
            </p>
          </div>
          <div className="ca-viewer__ctl">
            <p className="ca-viewer__count" aria-hidden="true">
              <b>{String(i + 1).padStart(2, '0')}</b> / {String(PROJECTS.length).padStart(2, '0')}
            </p>
            <button type="button" onClick={() => go(i - 1)} aria-label="Previous project">
              <Arrow dir="l" />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label="Next project">
              <Arrow dir="r" />
            </button>
          </div>
        </div>
      </div>

      <ol className="ca-index" aria-label="Selected projects">
        {PROJECTS.map((x, n) => (
          <li key={x.id}>
            <button type="button" onClick={() => setI(n)} aria-pressed={i === n} onMouseEnter={() => setI(n)}>
              <span className="ca-index__n">{String(n + 1).padStart(2, '0')}</span>
              <span className="ca-index__name">{x.name}</span>
              <span className="ca-index__kind">{x.kind}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
