import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/concepts/autos#marques', label: 'Marques' },
  { to: '/concepts/autos#lineup', label: 'Line-up' },
  { to: '/concepts/autos#test-drive', label: 'Test drive' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const home = loc.pathname === '/concepts/autos' || loc.pathname === '/concepts/autos/'

  return (
    <header className="au-head">
      <div className="au-head__in">
        <Link className="au-brand" to="/concepts/autos" onClick={() => setOpen(false)}>
          Strada
          <span>Motors</span>
        </Link>
        <button
          type="button"
          className="au-menu-btn"
          aria-expanded={open}
          aria-controls="au-nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="au-menu-btn__bars" aria-hidden="true" />
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
        <nav id="au-nav-panel" className={`au-nav${open ? ' au-nav--open' : ''}`} aria-label="Main">
          {!home && (
            <Link to="/concepts/autos" onClick={() => setOpen(false)}>
              Showroom
            </Link>
          )}
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
