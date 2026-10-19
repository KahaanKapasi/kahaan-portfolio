import { useState } from 'react'
import { photoPath, type CarModel } from './data'
import { Photo } from './Photo'

/** Labelled points on the front photograph. Replaces the old exploded view with something drawn from the real car. */
export function Hotspots({ model }: { model: CarModel }) {
  const [active, setActive] = useState(model.hotspots[0].id)
  const current = model.hotspots.find((h) => h.id === active) ?? model.hotspots[0]

  return (
    <section className="au-look au-wrap" aria-labelledby="au-look-h">
      <h2 id="au-look-h">Look closer</h2>
      <div className="au-look__grid">
        <div className="au-look__photo">
          <Photo path={photoPath(model.id, 'front')} alt={`${model.name}, front three-quarter view`} sizes="(min-width: 1000px) 760px, 100vw" />
          {model.hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`au-pin${h.id === active ? ' is-on' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label={h.label}
              aria-pressed={h.id === active}
              onClick={() => setActive(h.id)}
            />
          ))}
        </div>
        <div className="au-look__list">
          <ul>
            {model.hotspots.map((h) => (
              <li key={h.id}>
                <button type="button" className={h.id === active ? 'is-on' : ''} aria-pressed={h.id === active} onClick={() => setActive(h.id)}>
                  {h.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="au-look__text" aria-live="polite">{current.text}</p>
        </div>
      </div>
    </section>
  )
}
