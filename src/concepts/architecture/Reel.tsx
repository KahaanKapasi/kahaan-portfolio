import { lazy, Suspense, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { WebGLGate } from '../../shared/webgl'
import { PROJECTS } from './render/scenes'
import StaticStack from './StaticStack'

const ProjectScene = lazy(() => import('./ProjectScene'))

function useReelSize(): [number, number] {
  const [s] = useState<[number, number]>(() => (typeof window !== 'undefined' && window.innerWidth < 760 ? [620, 840] : [1200, 675]))
  return s
}

/**
 * A pinned, scroll-driven second use of the same distortion shader. Scrolling
 * moves through the six projects; each change is a sliced, colour-split lift.
 */
export default function Reel() {
  const sec = useRef<HTMLElement>(null)
  const [i, setI] = useState(0)
  const size = useReelSize()
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setI(Math.max(0, Math.min(PROJECTS.length - 1, Math.floor(v * PROJECTS.length)))))
  const p = PROJECTS[i]

  return (
    <section className="ca-reel" ref={sec} aria-label="Project reel" style={{ ['--reel-n' as string]: PROJECTS.length }}>
      <div className="ca-reel__stage">
        <div className="ca-reel__media" role="img" aria-label={`Computer-generated render: ${p.name}. ${p.note}`}>
          <WebGLGate className="ca-gate" fallback={<StaticStack index={i} size={size} />}>
            {(active) => (
              <Suspense fallback={<StaticStack index={i} size={size} />}>
                <ProjectScene active={active} index={i} texSize={size} />
              </Suspense>
            )}
          </WebGLGate>
        </div>
        <div className="ca-reel__scrim" aria-hidden="true" />
        <div className="ca-reel__cap">
          <p className="ca-reel__name" key={p.id}>
            {p.name}
          </p>
          <p className="ca-reel__note">{p.note}</p>
          <dl className="ca-reel__facts">
            <div>
              <dt>Type</dt>
              <dd>{p.kind}</dd>
            </div>
            <div>
              <dt>Place</dt>
              <dd>{p.place}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{p.year}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>{p.area}</dd>
            </div>
          </dl>
        </div>
        <ol className="ca-reel__rail" aria-hidden="true">
          {PROJECTS.map((x, n) => (
            <li key={x.id} className={n === i ? 'is-on' : n < i ? 'is-past' : ''} />
          ))}
        </ol>
      </div>
    </section>
  )
}
