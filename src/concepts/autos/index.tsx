import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/hanken-grotesk'
import './autos.css'
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ConceptStrip } from '../../shared/ConceptStrip'
import { Nav } from './Nav'
import { Home } from './Home'
import { ModelDetail } from './ModelDetail'
import { Credits } from './Credits'

/** Scrolls to the element named by the URL hash after a route change, or to the top when there is none. */
function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function ShowroomShell() {
  return (
    <div className="c-autos">
      <ConceptStrip brand="Strada Motors" note="Unofficial concept. Not affiliated with Lamborghini, Porsche or BMW." />
      <Nav />
      <ScrollToHash />
      <main className="au-main">
        <Routes>
          <Route index element={<Home />} />
          <Route path="model/:slug" element={<ModelDetail />} />
        </Routes>
      </main>
      <footer className="au-foot">
        <div className="au-wrap">
          <p>Strada Motors is a fictional dealer. Concept website designed and built by Kahaan Kapasi.</p>
          <p className="au-foot__legal">Vehicle names are used for demonstration only. No official logos or crests. Prices are indicative.</p>
          <Credits />
        </div>
      </footer>
    </div>
  )
}

export default function AutosPage() {
  return <ShowroomShell />
}
