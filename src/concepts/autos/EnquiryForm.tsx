import { useState, type FormEvent } from 'react'
import { ALL_MODEL_IDS, BRANDS, MODELS, type ModelId } from './data'

type Fields = {
  name: string
  email: string
  model: ModelId | ''
  date: string
  message: string
}

type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = { name: '', email: '', model: '', date: '', message: '' }

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.'
  if (!f.model) e.model = 'Choose a model.'
  if (!f.date) e.date = 'Pick a preferred date.'
  else {
    const d = new Date(f.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (d < today) e.date = 'Date must be today or later.'
  }
  if (f.message.trim().length > 800) e.message = 'Keep the message under 800 characters.'
  return e
}

export function EnquiryForm({ defaultModel, prefill }: { defaultModel?: ModelId; prefill?: string }) {
  const [fields, setFields] = useState<Fields>({ ...empty, model: defaultModel ?? '' })
  const [edited, setEdited] = useState(false)
  const message = edited ? fields.message : (prefill ?? fields.message)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const next = validate({ ...fields, message })
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
  }

  if (sent) {
    return (
      <div className="au-form-done" role="status">
        <h3>Request received</h3>
        <p>
          This is a front-end demo only. In production, your details would reach a sales advisor within one business day.
        </p>
        <button type="button" className="au-btn au-btn--ghost" onClick={() => { setSent(false); setEdited(false); setFields({ ...empty, model: defaultModel ?? '' }) }}>
          Send another
        </button>
      </div>
    )
  }

  return (
    <form className="au-form" onSubmit={onSubmit} noValidate>
      <div className="au-field">
        <label htmlFor="au-name">Full name</label>
        <input
          id="au-name"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'au-name-err' : undefined}
        />
        {errors.name && <p id="au-name-err" className="au-field__err" role="alert">{errors.name}</p>}
      </div>
      <div className="au-field">
        <label htmlFor="au-email">Email</label>
        <input
          id="au-email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'au-email-err' : undefined}
        />
        {errors.email && <p id="au-email-err" className="au-field__err" role="alert">{errors.email}</p>}
      </div>
      <div className="au-field">
        <label htmlFor="au-model">Model</label>
        <select
          id="au-model"
          name="model"
          value={fields.model}
          onChange={(e) => setFields((f) => ({ ...f, model: e.target.value as ModelId }))}
          aria-invalid={!!errors.model}
          aria-describedby={errors.model ? 'au-model-err' : undefined}
        >
          <option value="">Select a model</option>
          {ALL_MODEL_IDS.map((id) => (
            <option key={id} value={id}>{BRANDS[MODELS[id].brand].name} {MODELS[id].name}</option>
          ))}
        </select>
        {errors.model && <p id="au-model-err" className="au-field__err" role="alert">{errors.model}</p>}
      </div>
      <div className="au-field">
        <label htmlFor="au-date">Preferred date</label>
        <input
          id="au-date"
          name="date"
          type="date"
          value={fields.date}
          onChange={(e) => setFields((f) => ({ ...f, date: e.target.value }))}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? 'au-date-err' : undefined}
        />
        {errors.date && <p id="au-date-err" className="au-field__err" role="alert">{errors.date}</p>}
      </div>
      <div className="au-field">
        <label htmlFor="au-message">Notes (optional)</label>
        <textarea
          id="au-message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => {
            setEdited(true)
            setFields((f) => ({ ...f, message: e.target.value }))
          }}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'au-message-err' : undefined}
        />
        {errors.message && <p id="au-message-err" className="au-field__err" role="alert">{errors.message}</p>}
      </div>
      <button type="submit" className="au-btn au-btn--solid au-btn--wide">Book test drive</button>
    </form>
  )
}
