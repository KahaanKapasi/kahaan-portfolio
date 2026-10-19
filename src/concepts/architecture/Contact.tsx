import { useState, type FormEvent } from 'react'

type Vals = { name: string; email: string; type: string; message: string }
type Errs = Partial<Record<keyof Vals, string>>

function validate(v: Vals): Errs {
  const e: Errs = {}
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  if (!v.email.trim()) e.email = 'An email address is needed so we can reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email address looks incomplete.'
  if (!v.type) e.type = 'Choose the closest project type.'
  if (v.message.trim().length < 20) e.message = 'A couple of sentences about the site and the brief will do (20 characters or more).'
  return e
}

export default function Contact() {
  const [v, setV] = useState<Vals>({ name: '', email: '', type: '', message: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof Vals, boolean>>>({})
  const [done, setDone] = useState(false)
  const errs = validate(v)
  const show = (k: keyof Vals) => (touched[k] ? errs[k] : undefined)

  const set = (k: keyof Vals) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value })
  const blur = (k: keyof Vals) => () => setTouched({ ...touched, [k]: true })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, type: true, message: true })
    if (Object.keys(errs).length) {
      const first = (['name', 'email', 'type', 'message'] as const).find((k) => errs[k])
      if (first) document.getElementById(`ca-f-${first}`)?.focus()
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="ca-done" role="status">
        <p className="ca-done__t">Thank you, {v.name.split(' ')[0]}.</p>
        <p>
          Aldermoor is a concept studio, so this message has not been sent anywhere. In a real project the form would reach the studio, and
          you would hear back within two working days.
        </p>
        <button type="button" className="ca-btn ca-btn--ghost" onClick={() => { setDone(false); setV({ name: '', email: '', type: '', message: '' }); setTouched({}) }}>
          Write another note
        </button>
      </div>
    )
  }

  const field = (k: keyof Vals) => ({
    id: `ca-f-${k}`,
    'aria-invalid': show(k) ? true : undefined,
    'aria-describedby': show(k) ? `ca-e-${k}` : undefined,
    onBlur: blur(k),
  })

  return (
    <form className="ca-form" onSubmit={submit} noValidate>
      <div className="ca-field">
        <label htmlFor="ca-f-name">Your name</label>
        <input {...field('name')} type="text" autoComplete="name" value={v.name} onChange={set('name')} />
        {show('name') ? <p className="ca-err" id="ca-e-name">{show('name')}</p> : null}
      </div>
      <div className="ca-field">
        <label htmlFor="ca-f-email">Email</label>
        <input {...field('email')} type="email" autoComplete="email" value={v.email} onChange={set('email')} />
        {show('email') ? <p className="ca-err" id="ca-e-email">{show('email')}</p> : null}
      </div>
      <div className="ca-field">
        <label htmlFor="ca-f-type">What are you planning?</label>
        <select {...field('type')} value={v.type} onChange={set('type')}>
          <option value="">Choose one</option>
          <option>A new house or an extension</option>
          <option>A room or interior</option>
          <option>A public or commercial building</option>
          <option>Not sure yet</option>
        </select>
        {show('type') ? <p className="ca-err" id="ca-e-type">{show('type')}</p> : null}
      </div>
      <div className="ca-field">
        <label htmlFor="ca-f-message">Tell us about the site</label>
        <textarea {...field('message')} rows={5} value={v.message} onChange={set('message')} />
        {show('message') ? <p className="ca-err" id="ca-e-message">{show('message')}</p> : null}
      </div>
      <button type="submit" className="ca-btn">
        Send the note
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
      </button>
      <p className="ca-form__note">Concept form: nothing is sent or stored.</p>
    </form>
  )
}
