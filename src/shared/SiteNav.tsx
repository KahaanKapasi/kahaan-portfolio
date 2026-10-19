import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '@fontsource-variable/saira/wght.css'
import '@fontsource-variable/onest'
import { EMAIL, LINKEDIN, LINKEDIN_LABEL } from './contact'
import './world.css'
import './site-nav.css'


const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const

/** Letter-roll: each letter slides up and is replaced by its twin from below. */
function Roll({ text }: { text: string }) {
  return (
    <span className="sn-roll" aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span key={i} data-c={ch} style={{ '--i': i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  )
}

function Mark() {
  return (
    <svg className="sn-mark" viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">
      <rect x="2" y="8" width="4.2" height="12" rx="0.6" />
      <rect x="8.9" y="2" width="4.2" height="18" rx="0.6" />
      <rect x="15.8" y="11" width="4.2" height="9" rx="0.6" />
    </svg>
  )
}

/**
 * Floating pill navigation shared by Home and every case study.
 * Desktop: one centred pill at the top. Phones: a bottom pill whose Menu expands in place.
 */
export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const panelId = useId()
  const loc = useLocation()
  const onHome = loc.pathname === '/'
  const root = useRef<HTMLElement>(null)

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [loc.pathname, loc.hash])

  // Escape closes; a tap outside closes.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  // Mark the section in view (home only).
  useEffect(() => {
    if (!onHome || typeof IntersectionObserver === 'undefined') {
      setActive(null)
      return
    }
    const seen = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        let best: string | null = null
        let bestR = 0
        seen.forEach((r, id) => {
          if (r > bestR) {
            best = id
            bestR = r
          }
        })
        setActive(best)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.1, 0.4, 1] },
    )
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [onHome])

  const go = useCallback(
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      setOpen(false)
      if (!onHome) return // router handles /#id from case pages
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      window.history.replaceState(null, '', `/#${id}`)
    },
    [onHome],
  )

  const goTop = (e: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false)
    if (!onHome) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    window.history.replaceState(null, '', '/')
  }

  return (
    <header className="sn" ref={root} data-open={open ? 'true' : 'false'}>
      <nav className="sn-pill" aria-label="Site">
        <div className="sn-collapse" id={panelId}>
          <div className="sn-collapse-in">
            <ul className="sn-links">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <Link
                    to={`/#${l.id}`}
                    onClick={go(l.id)}
                    aria-current={active === l.id ? 'location' : undefined}
                  >
                    <span className="sr-only">{l.label}</span>
                    <Roll text={l.label} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="sn-contact">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={LINKEDIN} target="_blank" rel="me noopener noreferrer">
                {LINKEDIN_LABEL}
              </a>
            </div>
          </div>
        </div>

        <div className="sn-bar">
          <Link className="sn-logo" to="/" onClick={goTop} aria-label="Kahaan Kapasi, home">
            <Mark />
            <span className="sn-logo-t">Kahaan Kapasi</span>
          </Link>
          <button
            type="button"
            className="sn-menu"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d={open ? 'M2 2l8 8M10 2L2 10' : 'M1 4l5 5 5-5'} />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}
