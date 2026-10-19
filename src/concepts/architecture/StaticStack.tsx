import { useEffect, useRef } from 'react'
import { PROJECTS, renderProject } from './render/scenes'

/** 2D fallback: every project drawn to its own canvas, cross-faded with CSS. */
export default function StaticStack({ index, size }: { index: number; size: [number, number] }) {
  const refs = useRef<(HTMLCanvasElement | null)[]>([])
  const drawn = useRef<boolean[]>([])

  useEffect(() => {
    const draw = (i: number) => {
      const c = refs.current[i]
      if (!c || drawn.current[i]) return
      drawn.current[i] = true
      renderProject(i, c, size[0], size[1])
    }
    draw(index)
    let i = 0
    const id = window.setInterval(() => {
      if (i >= PROJECTS.length) {
        window.clearInterval(id)
        return
      }
      draw(i++)
    }, 300)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const c = refs.current[index]
    if (c && !drawn.current[index]) {
      drawn.current[index] = true
      renderProject(index, c, size[0], size[1])
    }
  }, [index, size])

  return (
    <div className="ca-static" aria-hidden="true">
      {PROJECTS.map((p, i) => (
        <canvas
          key={p.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          className={`ca-static__c${i === index ? ' is-on' : ''}`}
        />
      ))}
    </div>
  )
}
