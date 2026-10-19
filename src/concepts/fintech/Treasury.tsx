import { useEffect, useId, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { usePrefersReducedMotion } from '../../shared/webgl'
import { num0 } from './hooks'

/** USD per one unit of each currency. Sample rates, not market data. */
const USD_PER: Record<string, number> = { USD: 1, EUR: 1.09, GBP: 1.27, AUD: 0.66, INR: 0.0119, PHP: 0.0171 }

const BOOK = [
  { cur: 'USD', name: 'US dollar', bal: 4_820, tone: '#0a1470' },
  { cur: 'EUR', name: 'Euro', bal: 1_237, tone: '#1633dc' },
  { cur: 'GBP', name: 'British pound', bal: 2_104, tone: '#3d5bff' },
  { cur: 'AUD', name: 'Australian dollar', bal: 880, tone: '#7d92ff' },
  { cur: 'PHP', name: 'Philippine peso', bal: 96_500, tone: '#b2bfff' },
  { cur: 'INR', name: 'Indian rupee', bal: 78_200, tone: '#ff6a2b' },
]

function Accounts() {
  const reduced = usePrefersReducedMotion()
  const [view, setView] = useState<'USD' | 'EUR' | 'GBP'>('USD')
  const totalUsd = BOOK.reduce((a, b) => a + b.bal * USD_PER[b.cur], 0)
  const target = totalUsd / USD_PER[view]
  const [shown, setShown] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (reduced) {
      setShown(target)
      from.current = target
      return
    }
    const c = animate(from.current, target, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        from.current = v
        setShown(v)
      },
    })
    return () => c.stop()
  }, [target, reduced])

  return (
    <div className="fq-acct">
      <div className="fq-acct__total">
        <p className="fq-acct__label" id="fq-acct-l">
          Everything you hold, in one number
        </p>
        <p className="fq-acct__num" aria-labelledby="fq-acct-l">
          <span>{view}</span> {num0.format(shown)}
        </p>
        <div className="fq-seg" role="group" aria-label="Show total in">
          {(['USD', 'EUR', 'GBP'] as const).map((c) => (
            <button key={c} type="button" aria-pressed={view === c} onClick={() => setView(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="fq-acct__bar" role="img" aria-label="Share of the total held in each currency, as a single stacked bar. The list below gives each figure.">
        {BOOK.map((b) => (
          <i key={b.cur} style={{ flexGrow: b.bal * USD_PER[b.cur], background: b.tone }} />
        ))}
      </div>

      <table className="fq-acct__table">
        <caption className="sr-only">Balances by currency, with share of total</caption>
        <thead>
          <tr>
            <th scope="col">Currency</th>
            <th scope="col">Balance</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {BOOK.map((b) => {
            const share = (b.bal * USD_PER[b.cur]) / totalUsd
            return (
              <tr key={b.cur}>
                <th scope="row">
                  <i style={{ background: b.tone }} aria-hidden="true" />
                  <span>{b.cur}</span> {b.name}
                </th>
                <td>{num0.format(b.bal)}</td>
                <td>{(share * 100).toFixed(1)}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* -------------------------------------------------------------- payments */
type Rail = [string, string, number]
const CLIENT: Record<string, { label: string; cur: string; card: Rail; local: Rail }> = {
  ny: { label: 'New York', cur: 'USD', card: ['Card', 'Within minutes', 0.024], local: ['Direct debit (ACH)', '1 to 2 working days', 0.005] },
  lon: { label: 'London', cur: 'GBP', card: ['Card', 'Within minutes', 0.024], local: ['Faster Payments', 'About 2 minutes', 0.002] },
  ber: { label: 'Berlin', cur: 'EUR', card: ['Card', 'Within minutes', 0.024], local: ['SEPA Instant', 'Under 10 seconds', 0.003] },
  syd: { label: 'Sydney', cur: 'AUD', card: ['Card', 'Within minutes', 0.024], local: ['PayID transfer', 'Within a minute', 0.003] },
}
const MAX_AMT = 50_000
const EXTRA_CHECK = 5_000
const FX_BPS = 35

function Payments() {
  const id = useId().replace(/:/g, '')
  const [amount, setAmount] = useState('1800')
  const [client, setClient] = useState('ber')
  const [home, setHome] = useState('INR')
  const [pri, setPri] = useState<'card' | 'local'>('local')
  const [touched, setTouched] = useState(false)

  const amt = Number(amount.replace(/,/g, ''))
  const bad = !amount.trim() || !Number.isFinite(amt) || amt <= 0 ? 'Enter an invoice amount above zero.' : amt > MAX_AMT ? `The preview handles up to ${num0.format(MAX_AMT)}.` : ''
  const d = CLIENT[client]
  const [rail, eta, rate] = d[pri]
  const converts = home !== d.cur
  const fee = Math.max(0.3, amt * rate)
  const fxCost = converts ? ((amt - fee) * FX_BPS) / 10000 : 0
  const gets = (((amt - fee - fxCost) * USD_PER[d.cur]) / USD_PER[home])
  const needsCheck = amt > EXTRA_CHECK
  const steps = [
    { t: 'Link opened', s: `Your client sees the total in ${d.cur}, fee included` },
    ...(needsCheck ? [{ t: 'One-time payer check', s: `Asked above ${num0.format(EXTRA_CHECK)}` }] : []),
    { t: `Paid by ${rail}`, s: pri === 'card' ? 'The quickest way to pay' : 'The cheapest way to pay' },
    { t: 'Landed', s: converts ? `In ${d.cur}, then converted to ${home}` : `In your ${home} balance` },
  ]

  return (
    <div className="fq-pay">
      <form className="fq-pay__form" onSubmit={(e) => e.preventDefault()} noValidate aria-label="Payment arrival preview">
        <div className="fq-field fq-field--amt">
          <label htmlFor={`${id}a`}>Invoice amount</label>
          <input
            id={`${id}a`}
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && bad ? true : undefined}
            aria-describedby={touched && bad ? `${id}e` : undefined}
          />
          {touched && bad ? (
            <p className="fq-err" id={`${id}e`}>
              {bad}
            </p>
          ) : null}
        </div>
        <div className="fq-field">
          <label htmlFor={`${id}f`}>Your client is in</label>
          <select id={`${id}f`} value={client} onChange={(e) => setClient(e.target.value)}>
            {Object.entries(CLIENT).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label} ({v.cur})
              </option>
            ))}
          </select>
        </div>
        <div className="fq-field">
          <label htmlFor={`${id}t`}>You receive in</label>
          <select id={`${id}t`} value={home} onChange={(e) => setHome(e.target.value)}>
            {Object.keys(USD_PER).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <fieldset className="fq-field fq-field--seg">
          <legend>Client pays by</legend>
          <div className="fq-seg">
            <button type="button" aria-pressed={pri === 'card'} onClick={() => setPri('card')}>
              Card
            </button>
            <button type="button" aria-pressed={pri === 'local'} onClick={() => setPri('local')}>
              Local transfer
            </button>
          </div>
        </fieldset>
      </form>

      <div className="fq-pay__out" aria-live="polite">
        {bad ? (
          <p className="fq-pay__empty">{bad}</p>
        ) : (
          <>
            <p className="fq-pay__gets">
              <span>You receive</span>
              <b>
                {home} {num0.format(gets)}
              </b>
            </p>
            <dl className="fq-pay__facts">
              <div>
                <dt>Route</dt>
                <dd>{rail}</dd>
              </div>
              <div>
                <dt>Arrives</dt>
                <dd>{eta}</dd>
              </div>
              <div>
                <dt>Payment fee</dt>
                <dd>
                  {d.cur} {fee.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt>Smart FX margin</dt>
                <dd>{converts ? `${(FX_BPS / 100).toFixed(2)}%, ${d.cur} ${fxCost.toFixed(2)}` : 'None, same currency'}</dd>
              </div>
            </dl>
            <ol className="fq-steps" key={`${client}${pri}${needsCheck}${converts}`}>
              {steps.map((s, i) => (
                <li key={s.t} style={{ ['--i' as string]: i }}>
                  <b>{s.t}</b>
                  <span>{s.s}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  )
}

export default function Treasury() {
  return (
    <section className="fq-treasury" id="product" aria-labelledby="fq-acct-h">
      <div className="fq-block">
        <div className="fq-block__text">
          <h2 id="fq-acct-h">One account for every currency you earn in.</h2>
          <p>Get local account details in six currencies, so clients pay you like a local. See them as a single balance, convert at a rate you can check first, and spend from any of them with a card that adds no conversion fee.</p>
        </div>
        <Accounts />
      </div>

      <div className="fq-block fq-block--rev">
        <div className="fq-block__text">
          <h2>How your client’s payment reaches you.</h2>
          <p>Pick where your client is and how they will pay. Pollen shows the route it takes, what it costs, and when the money is yours, before you send the invoice.</p>
          <p className="fq-note">Rates and fees on this page are invented for the concept.</p>
        </div>
        <Payments />
      </div>
    </section>
  )
}
