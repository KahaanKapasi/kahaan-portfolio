import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../shared/webgl'

/** Small non-cryptographic hash, enough to show how a chain of records detects edits. */
function fnv(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

const EVENTS = [
  'Account opened, Lisbon',
  'Client payment received, EUR 2,400',
  'Instant payout sent, USD 1,150',
  'Tax pot rule set to 22%',
  'Payout details changed, passkey confirmed',
  'Spend card frozen from the app',
  'FX order filled, GBP to INR',
  'Statement exported, March',
]

const CONTROLS: [string, string][] = [
  ['Sign-in', 'Passkeys and two-step checks. Changing where your payouts go always needs a passkey.'],
  ['Spend cards', 'Freeze a card in one tap, set limits per card, and get an alert for every purchase.'],
  ['Encryption', 'AES-256 at rest and TLS 1.3 in transit. Card numbers are never stored in the app.'],
  ['Your data', 'Export every payment and statement as CSV or PDF whenever you like, and delete your account when you leave.'],
  ['Safeguarding', 'Your balances are held in segregated accounts with licensed partners, apart from Pollen’s own money.'],
  ['Reports', 'SOC 2 Type II and ISO 27001 summaries on request. As this is a concept, both are invented.'],
]

function Chain() {
  const reduced = usePrefersReducedMotion()
  const [altered, setAltered] = useState(false)
  const [scan, setScan] = useState(-1) // -1 idle, n = blocks checked so far
  const [running, setRunning] = useState(false)
  const timer = useRef(0)

  const blocks = useMemo(() => {
    // the stored chain was written once, with the original text
    const stored: { text: string; prev: string; hash: string }[] = []
    let prev = '00000000'
    EVENTS.forEach((t) => {
      const hash = fnv(prev + t)
      stored.push({ text: t, prev, hash })
      prev = hash
    })
    return stored
  }, [])

  // what is on disk now: record 3 may have been edited, but hashes were not recomputed
  const shown = blocks.map((b, i) => (altered && i === 2 ? { ...b, text: 'Instant payout sent, USD 11,500' } : b))
  const failAt = altered ? 2 : -1

  const verify = () => {
    window.clearTimeout(timer.current)
    if (reduced) {
      setScan(failAt >= 0 ? failAt + 1 : EVENTS.length)
      return
    }
    setRunning(true)
    setScan(0)
    const step = (n: number) => {
      setScan(n)
      if (n >= EVENTS.length || (failAt >= 0 && n > failAt)) {
        setRunning(false)
        return
      }
      timer.current = window.setTimeout(() => step(n + 1), 280)
    }
    timer.current = window.setTimeout(() => step(1), 280)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const done = scan >= 0 && !running
  const broken = done && failAt >= 0
  const intact = done && failAt < 0

  return (
    <div className="fq-chain">
      <div className="fq-chain__bar">
        <button type="button" className="fq-btn fq-btn--hot fq-btn--small" onClick={verify} disabled={running}>
          Verify log
        </button>
        <button
          type="button"
          className="fq-btn fq-btn--line fq-btn--small"
          onClick={() => {
            window.clearTimeout(timer.current)
            setRunning(false)
            setScan(-1)
            setAltered((a) => !a)
          }}
        >
          {altered ? 'Restore record 3' : 'Alter record 3'}
        </button>
        <p className="fq-chain__result" aria-live="polite">
          {broken
            ? `Chain broken at record ${failAt + 1}: its stored hash no longer matches its text.`
            : intact
              ? 'All 8 records verified. The log is intact.'
              : running
                ? 'Checking records...'
                : altered
                  ? 'Record 3 was edited on disk. Verify to see what the chain says.'
                  : 'Each record carries the hash of the one before it.'}
        </p>
      </div>
      <ol className="fq-chain__list">
        {shown.map((b, i) => {
          const checked = scan > i
          const bad = checked && failAt === i
          const ok = checked && !bad
          const live = fnv(b.prev + b.text)
          return (
            <li key={i} className={bad ? 'is-bad' : ok ? 'is-ok' : undefined}>
              <span className="fq-chain__n">{i + 1}</span>
              <span className="fq-chain__t">{b.text}</span>
              <code className="fq-chain__h" title="Stored hash">
                {b.hash}
              </code>
              <span className="fq-chain__s">{bad ? `Mismatch, text hashes to ${live}` : ok ? 'Verified' : 'Not yet checked'}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function Security() {
  return (
    <section className="fq-sec" id="security" aria-labelledby="fq-sec-h">
      <div className="fq-sec__top">
        <div className="fq-sec__text">
          <h2 id="fq-sec-h">A history nobody can quietly rewrite.</h2>
          <p>Every action on your account is written to a tamper-evident activity log, each entry chained to the one before it. Change a line anywhere and the break shows for anyone who checks. Try it.</p>
        </div>
        <Chain />
      </div>
      <dl className="fq-sec__controls">
        {CONTROLS.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
