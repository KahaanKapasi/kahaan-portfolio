import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/bodoni-moda/opsz-italic.css'
import '@fontsource-variable/epilogue'
import { ConceptStrip } from '../../shared/ConceptStrip'
import { useMeta } from '../../shared/meta'
import Hero from './Hero'
import Reel from './Reel'
import SunStudy from './SunStudy'
import Plans from './Plans'
import Contact from './Contact'
import './architecture.css'

const icon = (d: string) => (
  <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

const SERVICES = [
  {
    name: 'Architecture',
    text: 'New houses, extensions and public buildings, from the first site walk to the building handover.',
    items: 'Concept and planning drawings, technical design, contractor tender, site inspections',
    ico: 'M4 27h24M7 27V13l9-7 9 7v14M13 27v-8h6v8',
  },
  {
    name: 'Interiors',
    text: 'Rooms planned around light and use: layouts, joinery, materials and the lighting that goes with them.',
    items: 'Layouts, joinery drawings, material palettes, lighting design',
    ico: 'M5 26V12h22v14M9 26v-6h8v6M20 16h4v4h-4zM5 12l11-6 11 6',
  },
  {
    name: 'Daylight and feasibility',
    text: 'A short study before any commitment: what can be built, and how the sun and shade will treat it.',
    items: 'Massing options, sun-path and overshadowing studies, planning appraisal',
    ico: 'M16 6v3M6.5 10l2 2M25.5 10l-2 2M5 20h22M9 20a7 7 0 0114 0M7 25h18',
  },
  {
    name: 'Site stewardship',
    text: 'We stay involved while it is built, because most of the quality is decided in the last ten per cent.',
    items: 'Contractor liaison, detail reviews, snagging and handover',
    ico: 'M8 27V10l8-4 8 4v17M12 27V15h8v12M4 27h24',
  },
]

export default function Architecture() {
  useMeta('Aldermoor Studio: concept build by Kahaan Kapasi', 'A concept website for a fictional architecture and interiors studio, with WebGL image transitions, a daylight study and a validated enquiry form.')
  return (
    <div className="c-architecture">
      <ConceptStrip brand="Aldermoor Studio" />
      <a className="ca-skip" href="#ca-main">Skip to content</a>
      <header className="ca-head">
        <a className="ca-brand" href="#projects" aria-label="Aldermoor Studio, home">
          Aldermoor
          <span>Architecture and interiors</span>
        </a>
        <nav aria-label="Main">
          <a href="#projects">Projects</a>
          <a href="#approach">Approach</a>
          <a href="#drawings">Drawings</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="ca-main">
        <Hero />

        <section className="ca-statement" aria-label="Studio statement">
          <p>
            We design houses, libraries and rooms that gather <em>daylight</em>, and the quiet details that keep hold of it. Six projects,
            drawn between 2022 and 2025.
          </p>
        </section>

        <Reel />

        <section className="ca-approach" id="approach" aria-labelledby="ca-approach-h">
          <div className="ca-approach__text">
            <h2 id="ca-approach-h">Begin with a section through the sun.</h2>
            <ol className="ca-principles">
              <li>
                <h3>Light first</h3>
                <p>Before a wall is drawn, we model where the sun will land through the year. Windows are placed for that, not for the facade.</p>
              </li>
              <li>
                <h3>Few materials, used honestly</h3>
                <p>Concrete, lime, oak and glass, left to age. Fewer finishes mean fewer joints to get wrong.</p>
              </li>
              <li>
                <h3>Plan for use</h3>
                <p>Rooms are sized by what happens in them. A long table needs a long room; a quiet corner needs a window and a door.</p>
              </li>
              <li>
                <h3>Quiet detail</h3>
                <p>Thresholds, handles and shadow gaps are drawn at full size before anything is built.</p>
              </li>
            </ol>
          </div>
          <div className="ca-approach__fig">
            <SunStudy />
            <p className="ca-approach__cap">A daylight study from the first meeting. Drag the slider to move the sun and watch the floor.</p>
          </div>
        </section>

        <section className="ca-drawings" id="drawings" aria-labelledby="ca-drawings-h">
          <div className="ca-drawings__head">
            <h2 id="ca-drawings-h">From the drawing board</h2>
            <p>Every project is drawn as a set of sheets: plans, sections and elevations. A few from the work above, redrawn for this site.</p>
          </div>
          <Plans />
        </section>

        <section className="ca-services" id="services" aria-labelledby="ca-services-h">
          <h2 id="ca-services-h">Services</h2>
          <ul className="ca-svc">
            {SERVICES.map((s) => (
              <li key={s.name}>
                <span className="ca-svc__ico">{icon(s.ico)}</span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <p className="ca-svc__items">{s.items}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="ca-contact" id="contact" aria-labelledby="ca-contact-h">
          <div className="ca-contact__text">
            <h2 id="ca-contact-h">Tell us about the site.</h2>
            <p>
              A first conversation is free and unhurried. Send a few lines about the plot, the people who will use it and the date you have
              in mind.
            </p>
            <address>
              12 Quarry Lane
              <br />
              Marsh Hollow
              <br />
              <a href="mailto:studio@aldermoor.example">studio@aldermoor.example</a>
            </address>
          </div>
          <Contact />
        </section>
      </main>

      <footer className="ca-foot">
        <dl className="ca-title">
          <div><dt>Drawing</dt><dd>Aldermoor Studio, concept website</dd></div>
          <div><dt>Drawn by</dt><dd>Kahaan Kapasi</dd></div>
          <div><dt>Status</dt><dd>Concept build, fictional studio</dd></div>
          <div><dt>Renders</dt><dd>Generated in the browser, no photographs</dd></div>
          <div><dt>Sheet</dt><dd>1 of 1</dd></div>
        </dl>
      </footer>
    </div>
  )
}
