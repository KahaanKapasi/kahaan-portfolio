import { useEffect, useState } from 'react'
import { FootonomyMark } from './crests'

const LINKS = [
  ['#player-3d', '3D Models'],
  ['#kick', 'Free Kick'],
  ['#tactics', 'Tactics'],
  ['#matchday', 'Matchday'],
  ['#squads', 'Squads'],
]

export function Nav() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className="cf-nav" data-solid={solid}>
      <a className="cf-brand" href="#top" aria-label="Footonomy, top of page">
        <FootonomyMark size={28} color="#d4ff3c" />
        <span>Footonomy</span>
      </a>
      <nav aria-label="Sections">
        <ul>
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
