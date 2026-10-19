import { useEffect, useRef } from 'react'
import type { ConceptKey } from '../data'
import { ART_H, ART_W, artFontsReady, paintConcept } from './art'

/** 2D canvas version of the card art, for phones and the no-WebGL fallback. */
export default function ConceptArt({ k, label }: { k: ConceptKey; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let dead = false
    artFontsReady().then(() => {
      const el = ref.current
      if (dead || !el) return
      const ctx = el.getContext('2d')
      if (ctx) paintConcept(ctx, k)
    })
    return () => {
      dead = true
    }
  }, [k])
  return <canvas ref={ref} width={ART_W} height={ART_H} className="h-cc-art" role="img" aria-label={label} />
}
