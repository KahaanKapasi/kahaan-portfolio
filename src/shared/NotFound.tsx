import { Link } from 'react-router-dom'
import { useMeta } from './meta'
import SiteNav from './SiteNav'

export default function NotFound() {
  useMeta('Page not found | Kahaan Kapasi')
  return (
    <main className="kk-route-loading" style={{ gridTemplateRows: 'auto auto', alignContent: 'center', gap: 16, fontFamily: 'var(--k-sans, system-ui)', padding: 24, textAlign: 'center' }}>
      <SiteNav />
      <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 6vw, 3rem)', color: '#eef1ea', fontFamily: 'var(--k-display, system-ui)', letterSpacing: '-0.04em' }}>
        This page does not exist.
      </h1>
      <Link to="/" style={{ color: 'var(--k-accent)', fontSize: 16, padding: '12px 0' }}>
        Go to the portfolio
      </Link>
    </main>
  )
}
