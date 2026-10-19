import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useMeta } from '../../shared/meta'
import { BRAND_IDS, BRANDS, MODELS, photoPath } from './data'
import { Hero } from './Hero'
import { EnquiryForm } from './EnquiryForm'
import { ModelCard } from './ModelCard'
import { Photo } from './Photo'

export function Home() {
  useMeta(
    'Strada Motors: car showroom concept by Kahaan Kapasi',
    'A multi-brand car dealer concept with real photography of Lamborghini, Porsche and BMW, and a photo-based configurator for paint and wheels.',
  )
  return (
    <>
      <Hero />

      <section className="au-marques au-wrap" id="marques" aria-labelledby="au-marques-h">
        <h2 id="au-marques-h">Choose a marque</h2>
        <ul className="au-marque-grid">
          {BRAND_IDS.map((id) => {
            const brand = BRANDS[id]
            const lead = MODELS[brand.lead]
            return (
              <li key={id}>
                <Link
                  className="au-marque"
                  to={`/concepts/autos#lineup-${id}`}
                  style={{ '--au-brand': brand.accent, '--au-brand-text': brand.accentText } as CSSProperties}
                >
                  <Photo
                    path={photoPath(lead.id, 'front')}
                    alt=""
                    sizes="(min-width: 900px) 33vw, 100vw"
                    style={{ objectPosition: lead.focus }}
                  />
                  <span className="au-marque__text">
                    <strong>{brand.name}</strong>
                    <span className="au-marque__town">{brand.town}</span>
                    <span className="au-marque__cta">View line-up</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="au-lineup au-wrap" id="lineup" aria-labelledby="au-lineup-h">
        <h2 id="au-lineup-h">On the floor now</h2>
        <p className="au-lineup__note">Prices are indicative. Strada Motors is a fictional dealer.</p>
        {BRAND_IDS.map((id, bi) => {
          const brand = BRANDS[id]
          return (
            <div key={id} className={`au-lineup__brand${bi % 2 ? ' au-lineup__brand--flip' : ''}`} id={`lineup-${id}`}>
              <h3>{brand.name}</h3>
              <div className="au-lineup__cards">
                {brand.models.map((mid) => (
                  <ModelCard key={mid} model={MODELS[mid]} sizes="(min-width: 900px) 52vw, 100vw" />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <section className="au-enquire au-wrap" id="test-drive" aria-labelledby="au-enquire-h">
        <div className="au-enquire__copy">
          <h2 id="au-enquire-h">Book a test drive</h2>
          <p>
            Tell us which car you want to sit in and when you are free. A specialist will confirm by email. The form is checked in
            your browser only; nothing is sent in this concept.
          </p>
          <div className="au-enquire__photo">
            <Photo path={photoPath('huracan-sto', 'front')} alt="A Lamborghini Huracán STO on display" sizes="(min-width: 900px) 40vw, 100vw" />
          </div>
        </div>
        <EnquiryForm />
      </section>
    </>
  )
}
