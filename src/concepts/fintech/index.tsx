import { useState } from 'react'
import '@fontsource-variable/anybody/wdth.css'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/martian-mono'
import { ConceptStrip } from '../../shared/ConceptStrip'
import { useMeta } from '../../shared/meta'
import Hero from './Hero'
import LiveBoard from './LiveBoard'
import Corridors from './Corridors'
import Treasury from './Treasury'
import Journey from './Journey'
import Security from './Security'
import Pricing from './Pricing'
import DemoForm from './DemoForm'
import './fintech.css'

const Mark = () => (
  <svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#ff6a2b" />
    <path d="M5 13c3.6-4.6 7.2-4.6 10.8 0s7.2 4.6 11.2 0M5 21c3.6-4.6 7.2-4.6 10.8 0s7.2 4.6 11.2 0" stroke="#0b1033" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

const LINKS = [
  ['Product', '#product'],
  ['Getting paid', '#paid'],
  ['Safety', '#security'],
  ['Pricing', '#pricing'],
]

export default function Fintech() {
  useMeta('Pollen: concept build by Kahaan Kapasi', 'A concept website for a fictional money app for freelancers and creators: multi-currency accounts, payment links, instant payouts, smart FX and a tax pot, with live data visuals, interactive tools and a validated waitlist form.')
  const [open, setOpen] = useState(false)
  return (
    <div className="c-fintech">
      <ConceptStrip brand="Pollen" />
      <a className="fq-skip" href="#fq-main">
        Skip to content
      </a>
      <header className="fq-head">
        <a className="fq-brand" href="#top" aria-label="Pollen, home">
          <Mark />
          Pollen
        </a>
        <button type="button" className="fq-menu" aria-expanded={open} aria-controls="fq-nav" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="fq-nav" className={open ? 'is-open' : undefined} aria-label="Main">
          {LINKS.map(([t, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>
              {t}
            </a>
          ))}
          <a className="fq-btn fq-btn--hot fq-btn--small" href="#demo" onClick={() => setOpen(false)}>
            Join the waitlist
          </a>
        </nav>
      </header>

      <main id="fq-main">
        <Hero />
        <LiveBoard />
        <Corridors />
        <Treasury />
        <Journey />
        <Security />
        <Pricing />

        <section className="fq-demo" id="demo" aria-labelledby="fq-demo-h">
          <div className="fq-demo__text">
            <h2 id="fq-demo-h">Get your Pollen account first.</h2>
            <p>Tell us where your clients are and how you get paid. We will open your account in the currencies you need and send an invite.</p>
            <ul className="fq-demo__next">
              <li>
                <b>Within a week</b>
                <span>your invite arrives, with account details in the currencies you picked.</span>
              </li>
              <li>
                <b>On day one</b>
                <span>send your first payment link before you finish your coffee.</span>
              </li>
              <li>
                <b>By the end of the month</b>
                <span>your tax pot and dashboard show a full picture of what you earned.</span>
              </li>
            </ul>
          </div>
          <DemoForm />
        </section>
      </main>

      <footer className="fq-foot">
        <div className="fq-foot__brand">
          <a className="fq-brand" href="#top">
            <Mark />
            Pollen
          </a>
          <p>Pollen is a fictional company. Figures, rates, certifications and customers on this page are invented for the concept.</p>
        </div>
        <div className="fq-foot__by">
          <p>
            Everything here is fictional. Designed and built by Kahaan Kapasi, a freelance web developer, as a portfolio concept.
          </p>
          <p>
            <a href="mailto:kahaankapasi@gmail.com">kahaankapasi@gmail.com</a>
            <br />
            <a href="https://linkedin.com/in/KahaanKapasi" target="_blank" rel="noreferrer noopener">
              linkedin.com/in/KahaanKapasi
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
