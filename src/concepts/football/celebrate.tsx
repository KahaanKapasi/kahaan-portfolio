import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../../shared/webgl'
import { CLUBS, type ClubId } from './data'
import { Crest } from './crests'

export interface CelebrateOpts {
  club: ClubId
  title?: string
  sub?: string
}

const Ctx = createContext<(o: CelebrateOpts) => void>(() => {})
export const useCelebrate = () => useContext(Ctx)

interface Piece {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  w: number
  h: number
  c: string
  life: number
  ribbon: boolean
}

/**
 * Goal celebration layer: confetti cannon on a fixed 2D canvas, floodlight flash,
 * a banner, and a short shake of whatever element carries `.cf-main`.
 */
export function CelebrationProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pieces = useRef<Piece[]>([])
  const raf = useRef(0)
  const last = useRef(0)
  const [banner, setBanner] = useState<(CelebrateOpts & { id: number }) | null>(null)
  const [flash, setFlash] = useState(0)
  const hide = useRef<number>(0)
  const seq = useRef(0)

  const frame = useCallback((now: number) => {
    const cv = canvasRef.current
    if (!cv) return
    const g = cv.getContext('2d')
    if (!g) return
    const dt = Math.min(0.04, (now - last.current) / 1000 || 0.016)
    last.current = now
    const dpr = cv.width / Math.max(1, cv.clientWidth)
    g.clearRect(0, 0, cv.width, cv.height)
    const list = pieces.current
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i]
      p.vy += 900 * dt
      p.vx *= 1 - 0.9 * dt
      p.vy *= 1 - 0.5 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.rot += p.vr * dt
      p.life -= dt
      if (p.life <= 0 || p.y > cv.clientHeight + 40) {
        list.splice(i, 1)
        continue
      }
      g.save()
      g.translate(p.x * dpr, p.y * dpr)
      g.rotate(p.rot)
      g.globalAlpha = Math.min(1, p.life * 1.6)
      g.fillStyle = p.c
      const flip = p.ribbon ? Math.abs(Math.cos(p.rot * 2)) : 1
      g.fillRect((-p.w / 2) * dpr, (-p.h / 2) * dpr * flip, p.w * dpr, p.h * dpr * flip)
      g.restore()
    }
    if (list.length) raf.current = requestAnimationFrame(frame)
    else {
      raf.current = 0
      g.clearRect(0, 0, cv.width, cv.height)
    }
  }, [])

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const fit = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      cv.width = Math.round(window.innerWidth * dpr)
      cv.height = Math.round(window.innerHeight * dpr)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => {
      window.removeEventListener('resize', fit)
      cancelAnimationFrame(raf.current)
      window.clearTimeout(hide.current)
    }
  }, [])

  const celebrate = useCallback(
    (o: CelebrateOpts) => {
      const id = ++seq.current
      setBanner({ ...o, id })
      window.clearTimeout(hide.current)
      hide.current = window.setTimeout(() => setBanner(null), reduced ? 3200 : 2900)
      if (reduced) return
      setFlash((n) => n + 1)
      const main = document.querySelector('.c-football .cf-main')
      if (main) {
        main.classList.remove('is-shaking')
        void (main as HTMLElement).offsetWidth
        main.classList.add('is-shaking')
        window.setTimeout(() => main.classList.remove('is-shaking'), 650)
      }
      const W = window.innerWidth
      const H = window.innerHeight
      const club = CLUBS[o.club]
      const colours = [club.primary, club.accent, club.secondary, '#f4f6ee', '#d4ff3c']
      const burst = (x: number, angle: number, n: number) => {
        for (let i = 0; i < n; i++) {
          const a = angle + (Math.random() - 0.5) * 0.9
          const sp = 600 + Math.random() * 900
          pieces.current.push({
            x,
            y: H + 10,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            rot: Math.random() * 6,
            vr: (Math.random() - 0.5) * 18,
            w: 6 + Math.random() * 7,
            h: 9 + Math.random() * 12,
            c: colours[Math.floor(Math.random() * colours.length)],
            life: 2.2 + Math.random() * 1.6,
            ribbon: Math.random() > 0.5,
          })
        }
      }
      burst(W * 0.08, -Math.PI * 0.36, 110)
      burst(W * 0.92, -Math.PI * 0.64, 110)
      burst(W * 0.5, -Math.PI / 2, 60)
      if (!raf.current) {
        last.current = performance.now()
        raf.current = requestAnimationFrame(frame)
      }
    },
    [frame, reduced],
  )

  const value = useMemo(() => celebrate, [celebrate])

  return (
    <Ctx.Provider value={value}>
      {children}
      <canvas ref={canvasRef} className="cf-confetti" aria-hidden="true" />
      {flash > 0 && <div key={flash} className="cf-flash" aria-hidden="true" />}
      <div className="cf-banner-wrap" role="status" aria-live="polite">
        {banner && (
          <div key={banner.id} className="cf-banner" data-club={banner.club}>
            <Crest club={banner.club} size={64} />
            <div>
              <p className="cf-banner-title">{banner.title ?? 'GOAL'}</p>
              <p className="cf-banner-sub">{banner.sub ?? CLUBS[banner.club].name}</p>
            </div>
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}
