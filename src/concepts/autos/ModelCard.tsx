import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { BRANDS, formatPrice, photoPath, type CarModel } from './data'
import { Photo } from './Photo'

export function ModelCard({ model, sizes }: { model: CarModel; sizes: string }) {
  const brand = BRANDS[model.brand]
  return (
    <Link
      className="au-card"
      to={`/concepts/autos/model/${model.id}`}
      style={{ '--au-brand-text': brand.accentText } as CSSProperties}
    >
      <div className="au-card__photo">
        <Photo path={photoPath(model.id, 'front')} alt={`${brand.name} ${model.name}, front three-quarter view`} sizes={sizes} style={{ objectPosition: model.focus }} />
      </div>
      <div className="au-card__body">
        <h4>{model.name}</h4>
        <p className="au-card__tag">{model.tagline}</p>
        <p className="au-card__meta">
          <span>{model.specs.power}</span>
          <span>0-60 in {model.specs.zeroToSixty}</span>
        </p>
        <p className="au-card__foot">
          <span>
            Indicative <strong>{formatPrice(model.basePrice)}</strong>
          </span>
          <span className="au-card__cta">Configure</span>
        </p>
      </div>
    </Link>
  )
}
