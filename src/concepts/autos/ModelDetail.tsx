import { useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMeta } from '../../shared/meta'
import { BRANDS, MODELS, formatPrice, getModel, photoPath, type CarModel } from './data'
import { Configurator, resolveChoice, totalPrice, type Choice } from './Configurator'
import { EnquiryForm } from './EnquiryForm'
import { Hotspots } from './Hotspots'
import { Photo } from './Photo'

function initialChoice(model: CarModel): Choice {
  return { paintId: model.paints.find((p) => p.base)!.id, wheelId: model.wheels.find((w) => w.base)!.id, angle: 'front' }
}

export function ModelDetail() {
  const { slug } = useParams<{ slug: string }>()
  const model = getModel(slug)
  if (!model) {
    return (
      <section className="au-missing au-wrap">
        <h1>Model not found</h1>
        <Link className="au-btn au-btn--ghost" to="/concepts/autos">Back to showroom</Link>
      </section>
    )
  }
  // Remount per model so the choice state resets when moving between cars.
  return <Detail key={model.id} model={model} />
}

function Detail({ model }: { model: CarModel }) {
  const brand = BRANDS[model.brand]
  const [choice, setChoice] = useState<Choice>(() => initialChoice(model))

  useMeta(
    `${model.name} by ${brand.name}: configurator concept | Strada Motors`,
    `Configure the ${brand.name} ${model.name} in real photographs: paint and wheels, with an indicative price. Concept build by Kahaan Kapasi.`,
  )

  const { paint, wheel } = resolveChoice(model, choice)
  const note = useMemo(
    () => `Configuration: ${paint.name}, ${wheel.name} wheels. Indicative ${formatPrice(totalPrice(model, paint, wheel))}.`,
    [model, paint, wheel],
  )
  const siblings = brand.models.filter((id) => id !== model.id)
  const next = MODELS[siblings[0] ?? (model.id === 'revuelto' ? 'huracan-sto' : 'revuelto')]
  const specs: [string, string][] = [
    ['Power', model.specs.power],
    ['Torque', model.specs.torque],
    ['0-60 mph', model.specs.zeroToSixty],
    ['Top speed', model.specs.topSpeed],
    ['Drivetrain', model.specs.drivetrain],
    ['Power unit', model.specs.engine],
  ]

  return (
    <article className="au-model" style={{ '--au-brand': brand.accent, '--au-brand-text': brand.accentText } as CSSProperties}>
      <header className="au-model__head au-wrap">
        <nav className="au-crumbs" aria-label="Breadcrumb">
          <Link to="/concepts/autos">Showroom</Link>
          <Link to={`/concepts/autos#lineup-${brand.id}`} className="au-crumbs__brand">{brand.name}</Link>
        </nav>
        <div className="au-model__titles">
          <h1>{model.name}</h1>
          <p>{model.tagline}</p>
        </div>
        <p className="au-model__price">
          <span>Indicative price</span>
          <strong>From {formatPrice(model.basePrice)}</strong>
          <small>Strada Motors is a fictional dealer.</small>
        </p>
      </header>

      <div className="au-wrap">
        <Configurator model={model} choice={choice} onChange={setChoice} />
      </div>

      <section className="au-gallery au-wrap" aria-labelledby="au-gal-h">
        <h2 id="au-gal-h">Gallery</h2>
        <ul>
          {model.gallery.map((g) => (
            <li key={g.file}>
              <figure>
                <Photo path={photoPath(model.id, g.file)} alt={`${brand.name} ${model.name}: ${g.caption.toLowerCase()}`} sizes="(min-width: 900px) 50vw, 100vw" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <Hotspots model={model} />

      <section className="au-specs au-wrap" aria-labelledby="au-spec-h">
        <div>
          <h2 id="au-spec-h">Specification</h2>
          <p className="au-specs__lead">{model.summary}</p>
        </div>
        <dl className="au-spec-grid">
          {specs.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="au-request au-wrap" id="request" aria-labelledby="au-req-h">
        <div className="au-request__copy">
          <h2 id="au-req-h">Request this build</h2>
          <p>Your configuration is added to the notes. A specialist replies by email to arrange a test drive. This form is validated in the browser only.</p>
          <p className="au-request__cfg">{note}</p>
        </div>
        <EnquiryForm defaultModel={model.id} prefill={note} />
      </section>

      <nav className="au-next au-wrap" aria-label="Next model">
        <Link to={`/concepts/autos/model/${next.id}`}>
          <span>Next model</span>
          <strong>{BRANDS[next.brand].name} {next.name}</strong>
        </Link>
      </nav>
    </article>
  )
}
