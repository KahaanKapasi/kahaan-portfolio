import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, type Location } from 'react-router-dom'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import Home from './home/Home'
import NotFound from './shared/NotFound'
import './shared/shared.css'

// Every non-home route is code-split. Each entry file default-exports its page.
const loaders = {
  football: () => import('./concepts/football'),
  autos: () => import('./concepts/autos'),
  architecture: () => import('./concepts/architecture'),
  fintech: () => import('./concepts/fintech'),
  auction: () => import('./work/auction'),
  flipprApp: () => import('./work/flippr-app'),
  madridonomy: () => import('./work/madridonomy'),
  footonomy: () => import('./work/footonomy'),
  contentStudio: () => import('./work/content-studio'),
  flipprLive: () => import('./work/flippr-live'),
  chatspace: () => import('./work/chatspace'),
  madridonomyStore: () => import('./work/madridonomy-store'),
}
const Football = lazy(loaders.football)
const Autos = lazy(loaders.autos)
const Architecture = lazy(loaders.architecture)
const Fintech = lazy(loaders.fintech)
const WorkAuction = lazy(loaders.auction)
const WorkFlipprApp = lazy(loaders.flipprApp)
const WorkMadridonomy = lazy(loaders.madridonomy)
const WorkFootonomy = lazy(loaders.footonomy)
const WorkContentStudio = lazy(loaders.contentStudio)
const WorkFlipprLive = lazy(loaders.flipprLive)
const WorkChatSpace = lazy(loaders.chatspace)
const WorkMadridonomyStore = lazy(loaders.madridonomyStore)

const PATH_LOADER: [string, () => Promise<unknown>][] = [
  ['/concepts/footonomy', loaders.football],
  ['/concepts/autos', loaders.autos],
  ['/concepts/architecture', loaders.architecture],
  ['/concepts/fintech', loaders.fintech],
  ['/work/auction-flippr-live', loaders.auction],
  ['/work/flippr-app', loaders.flipprApp],
  ['/work/madridonomy', loaders.madridonomy],
  ['/work/footonomy', loaders.footonomy],
  ['/work/content-studio', loaders.contentStudio],
  ['/work/flippr-live', loaders.flipprLive],
  ['/work/chatspace', loaders.chatspace],
  ['/work/madridonomy-store', loaders.madridonomyStore],
]

/** Start fetching a route's chunk early so the wipe never waits on the network. */
function preload(pathname: string) {
  const hit = PATH_LOADER.find(([p]) => pathname === p || pathname.startsWith(`${p}/`))
  hit?.[1]().catch(() => undefined)
}

/** Pages are the unit of transition: in-page hash and nested concept routes do not wipe. */
function pageKey(pathname: string) {
  const hit = PATH_LOADER.find(([p]) => pathname === p || pathname.startsWith(`${p}/`))
  return hit ? hit[0] : pathname === '/' ? '/' : '*'
}

function ScrollManager({ at }: { at: Location }) {
  const { pathname, hash } = at
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      // wait a frame so lazy routes can paint before we look for the anchor
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60)
      return () => window.clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const EASE = [0.76, 0, 0.24, 1] as const

/** Cross-fade with a small upward shift. Positioned only while moving, so pages keep normal layout at rest. */
function Page({ children, reduce }: { children: ReactNode; reduce: boolean }) {
  const [moving, setMoving] = useState(!reduce)
  return (
    <motion.div
      className="kk-page"
      initial={reduce ? false : { opacity: 0, top: 24 }}
      animate={{ opacity: 1, top: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      style={moving ? { position: 'relative' } : undefined}
      onAnimationComplete={() => setMoving(false)}
    >
      {children}
    </motion.div>
  )
}

function Pages() {
  const location = useLocation()
  const reduce = useReducedMotion()
  const [shown, setShown] = useState<Location>(location)
  const shownRef = useRef(shown)
  // 0 -> 1: the bar covers the screen left to right. 1 -> 2: it leaves the same way.
  const p = useMotionValue(0)
  const clip = useTransform(p, (v) => (v <= 1 ? `inset(0 ${100 - v * 100}% 0 0)` : `inset(0 0 0 ${(v - 1) * 100}%)`))
  const edgeLeft = useTransform(p, (v) => `${(v <= 1 ? v : v - 1) * 100}%`)
  const edgeX = useTransform(p, (v) => (v <= 1 ? '-100%' : '0%'))

  useEffect(() => {
    if (location === shownRef.current) return
    const swap = () => {
      shownRef.current = location
      setShown(location)
    }
    if (reduce || pageKey(location.pathname) === pageKey(shownRef.current.pathname)) {
      swap()
      return
    }
    let dead = false
    preload(location.pathname)
    const cover = animate(p, 1, { duration: 0.3, ease: EASE })
    cover.then(() => {
      if (dead) return
      swap()
      animate(p, 2, { duration: 0.46, ease: EASE, delay: 0.1 }).then(() => p.set(0))
    })
    return () => {
      dead = true
      cover.stop()
    }
  }, [location, reduce, p])

  const key = pageKey(shown.pathname)

  return (
    <>
      <ScrollManager at={shown} />
      <Page key={key} reduce={!!reduce}>
        <Suspense fallback={<div className="kk-route-loading">Loading…</div>}>
          <Routes location={shown}>
            <Route path="/" element={<Home />} />
            <Route path="/concepts/footonomy/*" element={<Football />} />
            <Route path="/concepts/autos/*" element={<Autos />} />
            <Route path="/concepts/architecture/*" element={<Architecture />} />
            <Route path="/concepts/fintech/*" element={<Fintech />} />
            <Route path="/work/auction-flippr-live" element={<WorkAuction />} />
            <Route path="/work/flippr-app" element={<WorkFlipprApp />} />
            <Route path="/work/madridonomy" element={<WorkMadridonomy />} />
            <Route path="/work/footonomy" element={<WorkFootonomy />} />
            <Route path="/work/content-studio" element={<WorkContentStudio />} />
            <Route path="/work/flippr-live" element={<WorkFlipprLive />} />
            <Route path="/work/chatspace" element={<WorkChatSpace />} />
            <Route path="/work/madridonomy-store" element={<WorkMadridonomyStore />} />
            <Route path="/work/storemad" element={<Navigate to="/work/madridonomy-store" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Page>
      {reduce ? null : (
        <motion.div className="kk-wipe" aria-hidden="true" style={{ clipPath: clip }}>
          <motion.span className="kk-wipe-edge" style={{ left: edgeLeft, x: edgeX }} />
        </motion.div>
      )}
    </>
  )
}

export default function App() {
  return <Pages />
}
