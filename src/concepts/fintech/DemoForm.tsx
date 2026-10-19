import { useEffect, useRef, useState, type FormEvent } from 'react'

type V = { name: string; email: string; country: string; role: string; interest: string[]; volume: string; note: string; website: string }
type E = Partial<Record<'name' | 'email' | 'country' | 'role' | 'interest', string>>
const EMPTY: V = { name: '', email: '', country: '', role: '', interest: [], volume: '', note: '', website: '' }
const NOTE_MAX = 500

function validate(v: V): E {
  const e: E = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!v.email.trim()) e.email = 'Enter your email so we can send your invite.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email address looks incomplete.'
  if (v.country.trim().length < 2) e.country = 'Tell us where you are based.'
  if (!v.role) e.role = 'Choose what you do most.'
  if (!v.interest.length) e.interest = 'Pick at least one thing to try first.'
  return e
}

export default function DemoForm() {
  const [v, setV] = useState<V>(EMPTY)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const timer = useRef(0)
  const errs = validate(v)
  const show = (k: keyof E) => (touched[k] ? errs[k] : undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const set = (k: keyof V) => (e: { target: { value: string } }) => setV((cur) => ({ ...cur, [k]: e.target.value }))
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }))
  const toggle = (name: string) =>
    setV((cur) => ({ ...cur, interest: cur.interest.includes(name) ? cur.interest.filter((x) => x !== name) : [...cur.interest, name] }))

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    setTouched({ name: true, email: true, country: true, role: true, interest: true })
    const keys = Object.keys(errs) as (keyof E)[]
    if (keys.length) {
      const first = keys[0]
      document.getElementById(first === 'interest' ? 'fq-f-interest' : `fq-f-${first}`)?.focus()
      return
    }
    // honeypot: bots fill the hidden field; we answer exactly the same way and do nothing
    setState('sending')
    timer.current = window.setTimeout(() => setState('done'), v.website ? 300 : 1000)
  }

  const f = (k: keyof E, id = `fq-f-${k}`) => ({
    id,
    'aria-invalid': show(k) ? true : undefined,
    'aria-describedby': show(k) ? `${id}-e` : undefined,
    onBlur: blur(k),
  })

  if (state === 'done') {
    return (
      <div className="fq-form fq-form--done" role="status">
        <h3>Thanks, {v.name.trim().split(' ')[0]}.</h3>
        <p>
          Pollen is a concept, so nothing was sent or stored. In a real build, this is where your invite would arrive within a week, with account
          details in the currencies you picked.
        </p>
        <button
          type="button"
          className="fq-btn fq-btn--line"
          onClick={() => {
            setV(EMPTY)
            setTouched({})
            setState('idle')
          }}
        >
          Start again
        </button>
      </div>
    )
  }

  return (
    <form className="fq-form" onSubmit={submit} noValidate aria-label="Join the waitlist">
      <div className="fq-form__row">
        <div className="fq-field">
          <label htmlFor="fq-f-name">Full name</label>
          <input {...f('name')} type="text" autoComplete="name" value={v.name} onChange={set('name')} />
          {show('name') ? <p className="fq-err" id="fq-f-name-e">{show('name')}</p> : null}
        </div>
        <div className="fq-field">
          <label htmlFor="fq-f-email">Email</label>
          <input {...f('email')} type="email" autoComplete="email" value={v.email} onChange={set('email')} />
          {show('email') ? <p className="fq-err" id="fq-f-email-e">{show('email')}</p> : null}
        </div>
      </div>
      <div className="fq-form__row">
        <div className="fq-field">
          <label htmlFor="fq-f-country">Where you are based</label>
          <input {...f('country')} type="text" autoComplete="country-name" value={v.country} onChange={set('country')} />
          {show('country') ? <p className="fq-err" id="fq-f-country-e">{show('country')}</p> : null}
        </div>
        <div className="fq-field">
          <label htmlFor="fq-f-role">What you do</label>
          <select {...f('role')} value={v.role} onChange={set('role')}>
            <option value="">Choose one</option>
            <option>Developer or engineer</option>
            <option>Designer or illustrator</option>
            <option>Video creator or streamer</option>
            <option>Writer, editor or consultant</option>
            <option>Something else</option>
          </select>
          {show('role') ? <p className="fq-err" id="fq-f-role-e">{show('role')}</p> : null}
        </div>
      </div>

      <fieldset className="fq-field fq-field--group" aria-describedby={show('interest') ? 'fq-f-interest-e' : undefined}>
        <legend>What would you like to try first?</legend>
        <div className="fq-chips">
          {['Multi-currency account', 'Payment links', 'Spend cards', 'Tax pot'].map((n, i) => (
            <label key={n} className="fq-chip">
              <input
                type="checkbox"
                id={i === 0 ? 'fq-f-interest' : undefined}
                checked={v.interest.includes(n)}
                onChange={() => toggle(n)}
                onBlur={blur('interest')}
                aria-invalid={show('interest') ? true : undefined}
              />
              <span>{n}</span>
            </label>
          ))}
        </div>
        {show('interest') ? <p className="fq-err" id="fq-f-interest-e">{show('interest')}</p> : null}
      </fieldset>

      <div className="fq-field">
        <label htmlFor="fq-f-volume">Earned from abroad each month (optional)</label>
        <select id="fq-f-volume" value={v.volume} onChange={set('volume')}>
          <option value="">Skip</option>
          <option>Under USD 1,000</option>
          <option>USD 1,000 to 5,000</option>
          <option>USD 5,000 to 20,000</option>
          <option>Over USD 20,000</option>
        </select>
      </div>

      <div className="fq-field">
        <label htmlFor="fq-f-note">Anything we should know? (optional)</label>
        <textarea id="fq-f-note" rows={4} maxLength={NOTE_MAX} value={v.note} onChange={set('note')} />
        <p className="fq-count" aria-live="off">
          {v.note.length} of {NOTE_MAX}
        </p>
      </div>

      {/* honeypot: hidden from people and assistive tech, tempting to bots */}
      <div className="fq-hp" aria-hidden="true">
        <label htmlFor="fq-f-website">Website</label>
        <input id="fq-f-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
      </div>

      <div className="fq-form__foot">
        <button type="submit" className="fq-btn fq-btn--hot" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending...' : 'Join the waitlist'}
        </button>
        <p>Concept form: nothing is sent or stored.</p>
      </div>
    </form>
  )
}
