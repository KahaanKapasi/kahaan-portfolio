import { useMemo, type CSSProperties } from 'react'
import { formatPrice, configImages, imageKey, type AngleId, type CarModel, type PaintOption, type WheelOption } from './data'

export interface Choice {
  paintId: string
  wheelId: string
  angle: AngleId
}

export function resolveChoice(model: CarModel, c: Choice) {
  const paint = model.paints.find((p) => p.id === c.paintId) ?? model.paints[0]
  const wheel = model.wheels.find((w) => w.id === c.wheelId) ?? model.wheels[0]
  return { paint, wheel }
}

export function totalPrice(model: CarModel, paint: PaintOption, wheel: WheelOption): number {
  return model.basePrice + (paint.base ? 0 : paint.price) + (wheel.base ? 0 : wheel.price)
}

const ANGLE_LABEL: Record<AngleId, string> = { front: 'Front', rear: 'Rear' }

export function Configurator({ model, choice, onChange }: { model: CarModel; choice: Choice; onChange: (c: Choice) => void }) {
  const { paint, wheel } = resolveChoice(model, choice)
  const base = model.paints.find((p) => p.base)!
  const stock = model.wheels.find((w) => w.base)!
  const images = useMemo(() => configImages(model), [model])
  const activeKey = imageKey(paint, wheel, choice.angle)
  const total = totalPrice(model, paint, wheel)

  const pickPaint = (p: PaintOption) => {
    onChange({
      paintId: p.id,
      wheelId: stock.id,
      angle: p.angles.includes(choice.angle) ? choice.angle : 'front',
    })
  }
  const pickWheel = (w: WheelOption) => {
    if (w.base) onChange({ ...choice, wheelId: w.id })
    else onChange({ paintId: base.id, wheelId: w.id, angle: 'front' })
  }
  const angleAvailable = (a: AngleId) => wheel.base && paint.angles.includes(a)

  return (
    <section className="au-cfg" aria-labelledby="au-cfg-h">
      <h2 id="au-cfg-h" className="visually-hidden">Configure the {model.name}</h2>

      <div className="au-cfg__stage">
        <div className="au-cfg__frame">
          {images.map((img) => (
            <img
              key={img.key}
              className={img.key === activeKey ? 'is-on' : ''}
              src={`${img.path}.webp`}
              srcSet={`${img.path}-800.webp 800w, ${img.path}.webp 1600w`}
              sizes="(min-width: 1100px) 800px, 100vw"
              width={1600}
              height={900}
              alt={img.key === activeKey ? `${model.name} in ${paint.name} with ${wheel.name} wheels, ${choice.angle} view` : ''}
              aria-hidden={img.key === activeKey ? undefined : true}
              loading={img.key === activeKey ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}
        </div>
        <div className="au-cfg__bar">
          {model.angles.length > 1 ? (
            <div className="au-chips" role="group" aria-label="Camera angle">
              {model.angles.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`au-chip${choice.angle === a ? ' au-chip--on' : ''}`}
                  aria-pressed={choice.angle === a}
                  disabled={!angleAvailable(a)}
                  onClick={() => onChange({ ...choice, angle: a })}
                >
                  {ANGLE_LABEL[a]}
                </button>
              ))}
            </div>
          ) : (
            <p className="au-cfg__angle">Front three-quarter view</p>
          )}
          <p className="au-cfg__caption" aria-live="polite">
            {paint.name}, {wheel.name}
          </p>
        </div>
      </div>

      <div className="au-cfg__panel">
        <fieldset className="au-opt">
          <legend>
            Paint <span>{paint.name}</span>
          </legend>
          <ul className="au-swatches">
            {model.paints.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`au-swatch${p.id === paint.id ? ' au-swatch--on' : ''}`}
                  style={{ '--sw': p.hex } as CSSProperties}
                  aria-pressed={p.id === paint.id}
                  aria-label={`${p.name}, ${p.finish.toLowerCase()}${p.base ? ', as photographed' : ''}`}
                  title={p.name}
                  onClick={() => pickPaint(p)}
                />
              </li>
            ))}
          </ul>
          <p className="au-opt__line">
            {paint.finish} finish. {paint.base || paint.price === 0 ? 'Included.' : `Adds ${formatPrice(paint.price)}.`}
          </p>
        </fieldset>

        <fieldset className="au-opt">
          <legend>
            Wheels <span>{wheel.name}</span>
          </legend>
          <div className="au-chips">
            {model.wheels.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`au-chip${w.id === wheel.id ? ' au-chip--on' : ''}`}
                aria-pressed={w.id === wheel.id}
                onClick={() => pickWheel(w)}
              >
                {w.name}
              </button>
            ))}
          </div>
          <p className="au-opt__line">
            {wheel.note}. {wheel.base ? 'Included.' : `Adds ${formatPrice(wheel.price)}.`}
            {!wheel.base && ' The preview shows the as-photographed colour.'}
          </p>
        </fieldset>

        <div className="au-sum" aria-label="Your configuration">
          <dl>
            <div><dt>Model</dt><dd>{model.name}</dd></div>
            <div><dt>Paint</dt><dd>{paint.name}</dd></div>
            <div><dt>Wheels</dt><dd>{wheel.name}</dd></div>
          </dl>
          <p className="au-sum__total">
            <span>Indicative price</span>
            <strong>{formatPrice(total)}</strong>
          </p>
          <a className="au-btn au-btn--solid au-btn--wide" href="#request">
            Request this build
          </a>
          <p className="au-sum__fine">Indicative only. Strada Motors is a fictional dealer.</p>
        </div>
      </div>
    </section>
  )
}
