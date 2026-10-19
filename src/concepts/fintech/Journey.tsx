import { useEffect, useId, useRef, useState } from 'react'
import { useInViewport, usePrefersReducedMotion } from '../../shared/webgl'
import { num0 } from './hooks'

/* ------------------------------------------------- payment lifecycle */
const STAGES = [
  {
    name: 'Invoice sent',
    actor: 'You',
    text: 'Pick an amount, a currency and a due date, then send a payment link or a PDF invoice. Your client needs no account and sees the total before they pay.',
    docs: ['Payment link', 'Invoice PDF'],
    old: '30 minutes of formatting',
    pl: '2 minutes',
  },
  {
    name: 'Client pays',
    actor: 'Your client',
    text: 'They pay by card or a local transfer from their own country, in their own currency. No wire form, no intermediary fees pulled out of the middle.',
    docs: ['Receipt for your client', 'Payment reference'],
    old: '1 to 3 days to set up a wire',
    pl: 'As soon as they pay',
  },
  {
    name: 'Checks',
    actor: 'Pollen',
    text: 'The payment is matched to your invoice and screened for fraud. Large or unusual payments get a one-time payer check, and your invoice stays open meanwhile.',
    docs: ['Invoice matched', 'Fraud screen'],
    old: '1 to 2 days',
    pl: 'Under a minute',
  },
  {
    name: 'Landed',
    actor: 'Your account',
    text: 'The money arrives in a balance in your client’s currency. Your tax pot rule takes its share, and the rest is yours to hold, convert or spend.',
    docs: ['Balance updated', 'Tax pot top-up'],
    old: '3 to 5 days',
    pl: 'Seconds',
  },
  {
    name: 'Smart FX',
    actor: 'You',
    text: 'Convert now, at a target rate or on a schedule. The mid-market rate and our margin are shown side by side before you confirm.',
    docs: ['Rate lock', 'FX receipt'],
    old: 'Hidden in the rate',
    pl: 'Instant',
  },
  {
    name: 'Payout',
    actor: 'Your account',
    text: 'Send it to your local account in your home country. Where the local rail allows it, the payout is instant, at any hour.',
    docs: ['Payout confirmation', 'Statement line'],
    old: '2 to 3 days',
    pl: 'Under a minute in most places',
  },
]

function Lifecycle() {
  const reduced = usePrefersReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const visible = useInViewport(root, '0px')
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const [flag, setFlag] = useState(false)
  const s = STAGES[i]
  const checking = i === 2

  useEffect(() => {
    if (!play || !visible || reduced) return
    const id = window.setTimeout(() => setI((x) => (x + 1) % STAGES.length), 2600)
    return () => window.clearTimeout(id)
  }, [play, visible, reduced, i])

  return (
    <div className="fq-life" ref={root}>
      <div className="fq-life__bar">
        <h3>Follow one client payment, invoice to payout</h3>
        <button type="button" className="fq-btn fq-btn--small" onClick={() => setPlay((p) => !p)} disabled={reduced} aria-pressed={play}>
          {play ? 'Pause' : 'Play the journey'}
        </button>
      </div>

      <ol className="fq-life__steps" aria-label="Payment stages">
        {STAGES.map((st, n) => (
          <li key={st.name} className={n < i ? 'is-done' : n === i ? 'is-on' : undefined}>
            <button
              type="button"
              onClick={() => {
                setPlay(false)
                setI(n)
              }}
              aria-current={n === i ? 'step' : undefined}
            >
              <span className="fq-life__dot" aria-hidden="true" />
              <span className="fq-life__nm">{st.name}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="fq-life__panel" aria-live="polite">
        <div className="fq-life__main">
          <p className="fq-life__actor">{checking && flag ? 'Pollen, then your client' : s.actor}</p>
          <h4>{s.name}</h4>
          <p>
            {checking && flag
              ? 'This payer is new and the payment is well above the usual size. Pollen asks them to confirm who they are, once. Your invoice stays open and you get a note when it clears.'
              : s.text}
          </p>
          {checking ? (
            <label className="fq-check">
              <input type="checkbox" checked={flag} onChange={(e) => setFlag(e.target.checked)} />
              <span>Simulate a flagged payment</span>
            </label>
          ) : null}
        </div>
        <div className="fq-life__side">
          <ul className="fq-life__docs" aria-label="Records at this stage">
            {s.docs.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <dl className="fq-life__time">
            <div>
              <dt>The old way</dt>
              <dd>{s.old}</dd>
            </div>
            <div>
              <dt>On Pollen</dt>
              <dd>{checking && flag ? '14 minutes, including the payer’s check' : s.pl}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------ protections & limits */
const PROTECT = [
  {
    n: 'Where your balances are held',
    t: 'Balances sit in segregated accounts with licensed partners, apart from Pollen’s own money. If Pollen ever failed, your money would still be yours, and a named administrator would return it.',
    k: 'Reconciled every day',
    v: 'Statement on request',
  },
  {
    n: 'Receiving limits',
    t: 'A new account can receive up to USD 10,000 a month. Confirm your identity in about five minutes and the limit rises to match your work. The limit is visible in the app, and on a client’s payment link if it ever applies.',
    k: 'Verified in about 5 minutes',
    v: 'Up to USD 250,000 a month',
  },
  {
    n: 'Card payment disputes',
    t: 'If a client disputes a card payment, Pollen asks you for evidence in plain language, holds only the disputed amount, and releases it the moment the case closes in your favour.',
    k: 'First reply within 24 hours',
    v: 'Only the disputed amount is held',
  },
  {
    n: 'Instant payout limits',
    t: 'Instant payouts are capped at USD 5,000 each and USD 20,000 a day. Standard payouts have no daily cap and arrive within a working day.',
    k: 'Instant: seconds to minutes',
    v: 'Standard: within one working day',
  },
  {
    n: 'Your tax pot',
    t: 'The pot is a separate balance you can move money in and out of at any time. Pollen sets money aside using your rule, but it does not file taxes or tell you what you owe.',
    k: 'Always withdrawable',
    v: 'No lock-in',
  },
]

function Protections() {
  return (
    <div className="fq-faq">
      <h3>Protections and limits, in plain words</h3>
      <div className="fq-faq__list">
        {PROTECT.map((g, n) => (
          <details key={g.n} name="fq-protect" open={n === 0}>
            <summary>
              <span>{g.n}</span>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M3 8h10M8 3v10" />
              </svg>
            </summary>
            <p>{g.t}</p>
            <p className="fq-faq__meta">
              {g.k}. {g.v}.
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------- tax pot */
function TaxPot() {
  const id = useId().replace(/:/g, '')
  const [amt, setAmt] = useState(2400)
  const [rate, setRate] = useState(22)
  const [save, setSave] = useState(5)
  const [per, setPer] = useState(4)
  const tax = (amt * rate) / 100
  const sav = (amt * save) / 100
  const spend = amt - tax - sav
  const year = (tax + sav) * per * 12
  const pct = { spend: (spend / amt) * 100, tax: (tax / amt) * 100, save: (sav / amt) * 100 }

  return (
    <div className="fq-tax">
      <h3>Set money aside before you can spend it</h3>
      <div className="fq-tax__ctl">
        <div className="fq-field">
          <label htmlFor={`${id}a`}>
            Each payment <output htmlFor={`${id}a`}>USD {num0.format(amt)}</output>
          </label>
          <input id={`${id}a`} type="range" min={100} max={10000} step={50} value={amt} onChange={(e) => setAmt(Number(e.target.value))} />
        </div>
        <div className="fq-field">
          <label htmlFor={`${id}v`}>
            Tax pot rule <output htmlFor={`${id}v`}>{rate}%</output>
          </label>
          <input id={`${id}v`} type="range" min={5} max={45} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>
        <fieldset className="fq-field">
          <legend>Auto-save on top</legend>
          <div className="fq-seg">
            {[0, 5, 10, 15].map((d) => (
              <button key={d} type="button" aria-pressed={save === d} onClick={() => setSave(d)}>
                {d}%
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="fq-field">
          <legend>Payments a month</legend>
          <div className="fq-seg">
            {[1, 2, 4, 8].map((d) => (
              <button key={d} type="button" aria-pressed={per === d} onClick={() => setPer(d)}>
                {d}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div
        className="fq-tax__bar"
        role="img"
        aria-label={`Each payment splits into spendable ${pct.spend.toFixed(0)} percent, tax pot ${pct.tax.toFixed(0)} percent, and savings ${pct.save.toFixed(0)} percent.`}
      >
        <i className="is-spend" style={{ flexGrow: pct.spend }} />
        <i className="is-tax" style={{ flexGrow: pct.tax }} />
        <i className="is-save" style={{ flexGrow: pct.save }} />
      </div>

      <dl className="fq-tax__out" aria-live="polite">
        <div>
          <dt>Yours to spend</dt>
          <dd>USD {num0.format(spend)}</dd>
        </div>
        <div>
          <dt>Into the tax pot</dt>
          <dd>USD {num0.format(tax)}</dd>
        </div>
        <div>
          <dt>Into savings</dt>
          <dd>USD {num0.format(sav)}</dd>
        </div>
      </dl>
      <p className="fq-tax__year">
        At {per} {per === 1 ? 'payment' : 'payments'} a month, you would set aside <b>USD {num0.format(year)}</b> in a year. Sample figures; Pollen does not give tax advice.
      </p>
    </div>
  )
}

export default function Journey() {
  return (
    <section className="fq-mech" id="paid" aria-labelledby="fq-mech-h">
      <div className="fq-mech__head">
        <h2 id="fq-mech-h">From invoice to payout, without the waiting.</h2>
        <p>Send a link, get paid in your client’s currency, and choose when to convert and cash out. Step through one payment, read the fine print, and see what your tax pot would hold.</p>
      </div>
      <Lifecycle />
      <div className="fq-mech__two">
        <Protections />
        <TaxPot />
      </div>
    </section>
  )
}
