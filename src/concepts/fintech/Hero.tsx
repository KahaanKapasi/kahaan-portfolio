import { lazy, Suspense, useEffect, useRef } from 'react'
import { WebGLGate } from '../../shared/webgl'
import { drawChart } from './terrain'

const HeroScene = lazy(() => import('./HeroScene'))

function StaticChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    const box = c?.parentElement
    if (!c || !box) return
    let id = 0
    const paint = () => drawChart(c, box.clientWidth || 1280, box.clientHeight || 720)
    paint()
    const ro = new ResizeObserver(() => {
      window.clearTimeout(id)
      id = window.setTimeout(paint, 180)
    })
    ro.observe(box)
    return () => {
      ro.disconnect()
      window.clearTimeout(id)
    }
  }, [])
  return <canvas className="fq-static" ref={ref} aria-hidden="true" />
}

export default function Hero() {
  return (
    <section className="fq-hero" id="top" aria-labelledby="fq-h1">
      <div className="fq-hero__scene" aria-hidden="true">
        <WebGLGate className="fq-gate" fallback={<StaticChart />}>
          {(active) => (
            <Suspense fallback={<StaticChart />}>
              <HeroScene active={active} />
            </Suspense>
          )}
        </WebGLGate>
      </div>
      <div className="fq-hero__scrim" aria-hidden="true" />
      <div className="fq-hero__copy">
        <h1 id="fq-h1">
          <span>Get paid from anywhere.</span> <span>Keep more of it.</span>
        </h1>
        <p>Pollen is the money app for freelancers and creators. Send a payment link, get paid in your client’s currency, and cash out in minutes.</p>
        <div className="fq-hero__cta">
          <a className="fq-btn fq-btn--hot" href="#demo">
            Join the waitlist
          </a>
          <a className="fq-btn fq-btn--line" href="#product">
            See how you get paid
          </a>
        </div>
      </div>
    </section>
  )
}
