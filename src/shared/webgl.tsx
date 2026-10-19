/**
 * Shared WebGL conventions for every route.
 *
 *   <WebGLGate fallback={<StaticPicture />}>
 *     {(active) => (
 *       <Suspense fallback={<StaticPicture />}>
 *         <LazyScene active={active} />   // LazyScene = React.lazy(() => import('./Scene'))
 *       </Suspense>
 *     )}
 *   </WebGLGate>
 *
 * Inside the scene:  <Canvas dpr={DPR} frameloop={active ? 'always' : 'never'} ...>
 *
 * The gate renders `fallback` when WebGL is unavailable, when the visitor prefers
 * reduced motion, or when the URL carries `?static` (handy for testing).
 * `active` is false while the gate's box is off-screen or the tab is hidden, so
 * scenes stop rendering when nobody can see them.
 */
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

/** Device-pixel-ratio range for every Canvas: never above 1.5 (mobile budget). */
export const DPR: [number, number] = [1, 1.5]

let webglCache: boolean | null = null
export function canUseWebGL(): boolean {
  if (webglCache !== null) return webglCache
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).has('static')) return (webglCache = false)
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    webglCache = !!gl
    const lose = gl && (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')
    lose?.loseContext()
  } catch {
    webglCache = false
  }
  return webglCache
}

export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** True while `ref` intersects the viewport (with a margin) and the tab is visible. */
export function useInViewport<T extends Element>(ref: React.RefObject<T | null>, rootMargin = '120px'): boolean {
  const [inView, setInView] = useState(false)
  const [visible, setVisible] = useState(() => (typeof document === 'undefined' ? true : !document.hidden))
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  useEffect(() => {
    const on = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  return inView && visible
}

/** Whether 3D should run at all (WebGL present, motion allowed, not forced static). */
export function useWebGLAllowed(): boolean {
  const reduced = usePrefersReducedMotion()
  const [ok] = useState(() => canUseWebGL())
  return ok && !reduced
}

type GateProps = {
  fallback: ReactNode
  children: (active: boolean) => ReactNode
  className?: string
  style?: CSSProperties
  /** Allow WebGL even with prefers-reduced-motion (scene must then be static/still). */
  allowWithReducedMotion?: boolean
}

export function WebGLGate({ fallback, children, className, style, allowWithReducedMotion }: GateProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [ok] = useState(() => canUseWebGL())
  const active = useInViewport(ref)
  const use3D = ok && (allowWithReducedMotion || !reduced)
  return (
    <div ref={ref} className={className} style={style}>
      {use3D ? children(active) : fallback}
    </div>
  )
}
