import { useState } from 'react'

const Tick = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3.2 3.2L13 4.5" />
  </svg>
)

const TIERS = [
  {
    id: 'open',
    name: 'Starter',
    blurb: 'For your first international clients.',
    monthly: 0,
    unit: '1% on payments received, capped at USD 12',
    feats: ['Accounts in three currencies', 'Payment links and invoices', 'Standard payouts', 'One virtual spend card', 'A tax pot'],
  },
  {
    id: 'operate',
    name: 'Pro',
    blurb: 'For freelancers who invoice abroad every week.',
    monthly: 9,
    unit: '0.5% on payments received, capped at USD 8',
    feats: ['Accounts in all six currencies', 'Instant payouts', 'Smart FX with rate alerts', 'Five physical or virtual cards', 'Creator-earnings dashboard', 'Tax pot and savings rules'],
  },
  {
    id: 'desk',
    name: 'Studio',
    blurb: 'For creators and small studios with a team.',
    monthly: 29,
    unit: 'Payments at cost, plus 0.2%',
    feats: ['Everything in Pro', 'Ten team members with card limits', 'Your logo on links and invoices', 'Accounting export', 'Priority chat support', 'Activity log streaming'],
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)
  return (
    <section className="fq-price" id="pricing" aria-labelledby="fq-price-h">
      <div className="fq-price__head">
        <h2 id="fq-price-h">Free to start. Pay more only when you earn more.</h2>
        <p>Illustrative tiers for this concept. Pay monthly or take fifteen per cent off by paying for a year.</p>
        <div className="fq-seg fq-seg--lg" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)}>
            Monthly
          </button>
          <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)}>
            Yearly
          </button>
        </div>
      </div>

      <div className="fq-tiers">
        {TIERS.map((t) => {
          const price = Math.round(t.monthly * (annual ? 0.85 : 1))
          return (
            <article key={t.id} className={`fq-tier fq-tier--${t.id}`} aria-labelledby={`fq-t-${t.id}`}>
              <h3 id={`fq-t-${t.id}`}>{t.name}</h3>
              <p className="fq-tier__blurb">{t.blurb}</p>
              <p className="fq-tier__price">
                <span className="fq-tier__amt">{price === 0 ? 'Free' : `$${price.toLocaleString('en-US')}`}</span>
                {price === 0 ? null : <span className="fq-tier__per"> a month</span>}
              </p>
              <p className="fq-tier__unit">{t.unit}</p>
              <ul className="fq-tier__feats">
                {t.feats.map((f) => (
                  <li key={f}>
                    <Tick />
                    {f}
                  </li>
                ))}
              </ul>
              <a className="fq-btn fq-btn--tier" href="#demo">
                Join the waitlist
              </a>
            </article>
          )
        })}
      </div>

      <p className="fq-price__ent">
        Managing a roster of creators or a collective? Shared balances, team cards and custom payout rules are available. <a href="#demo">Tell us about your setup</a>.
      </p>
    </section>
  )
}
