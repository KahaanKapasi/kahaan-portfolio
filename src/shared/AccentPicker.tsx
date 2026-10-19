import { useId, type CSSProperties } from 'react'
import { ACCENTS, useAccent } from './accent'
import './accent.css'

/**
 * Footer control: pick the portfolio's accent colour. Native radios, so arrow keys, focus and
 * screen-reader semantics come for free; the swatch pills are drawn on top.
 */
export default function AccentPicker({ className }: { className?: string }) {
  const [accent, setAccent] = useAccent()
  const name = useId()
  const labelId = `${name}-label`
  return (
    <div className={`kk-acc ${className ?? ''}`.trim()} role="radiogroup" aria-labelledby={labelId}>
      <span className="kk-acc__legend" id={labelId}>
        Accent colour
      </span>
      <div className="kk-acc__row">
        {ACCENTS.map((a) => (
          <label key={a.id} className="kk-acc__opt" style={{ '--sw': a.hex } as CSSProperties}>
            <input
              className="kk-acc__in"
              type="radio"
              name={name}
              value={a.id}
              checked={accent === a.id}
              onChange={() => setAccent(a.id)}
            />
            <span className="kk-acc__pill">
              <span className="kk-acc__dot" aria-hidden="true" />
              {a.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
