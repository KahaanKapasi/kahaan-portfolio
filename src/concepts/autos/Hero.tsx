import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRANDS, MODELS, photoPath, type ModelId } from './data'
import { Photo } from './Photo'

/** One lead car per marque. */
const SLIDES: ModelId[] = ['revuelto', 'taycan-turbo', 'm4-csl']

export function Hero() {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6500)
    return () => window.clearInterval(t)
  }, [auto])

  const current = MODELS[SLIDES[index]]

  return (
    <section
      className="au-hero"
      aria-labelledby="au-hero-title"
      onMouseEnter={() => setAuto(false)}
      onFocus={() => setAuto(false)}
    >
      <div className="au-hero__stage" aria-hidden="true">
        {SLIDES.map((id, i) => (
          <Photo
            key={id}
            className={`au-hero__img${i === index ? ' is-on' : ''}`}
            path={photoPath(id, 'front')}
            alt=""
            sizes="100vw"
            eager={i === 0}
            style={{ objectPosition: MODELS[id].focus }}
          />
        ))}
        <div className="au-hero__scrim" />
      </div>

      <div className="au-hero__body au-wrap">
        <div className="au-hero__copy">
          <h1 id="au-hero-title">Three marques. One floor.</h1>
          <p>Lamborghini, Porsche and BMW, shown in real photographs you can recolour and re-wheel.</p>
          <div className="au-hero__actions">
            <Link className="au-btn au-btn--solid" to={`/concepts/autos/model/${current.id}`}>
              Configure the {current.name}
            </Link>
            <a className="au-btn au-btn--ghost" href="#lineup">
              Browse the line-up
            </a>
          </div>
        </div>

        <div className="au-hero__switch" role="group" aria-label="Featured car">
          {SLIDES.map((id, i) => {
            const m = MODELS[id]
            return (
              <button
                key={id}
                type="button"
                className={`au-hero__tab${i === index ? ' is-on' : ''}`}
                aria-pressed={i === index}
                onClick={() => {
                  setIndex(i)
                  setAuto(false)
                }}
              >
                <span>{BRANDS[m.brand].name}</span>
                <strong>{m.name}</strong>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
