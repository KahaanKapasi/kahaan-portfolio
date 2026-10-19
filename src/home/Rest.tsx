import { useEffect, useRef } from 'react'
import { Reveal } from '../shared/Reveal'
import AccentPicker from '../shared/AccentPicker'
import { EMAIL, EMAIL_HREF, LINKEDIN, LINKEDIN_LABEL, SERVICES, STACK } from './data'

/** Services as a word stack: the word nearest the middle of the screen lights up. */
export function Services() {
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = list.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const items = Array.from(el.children) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.target as HTMLElement).classList.toggle('is-on', e.isIntersecting)
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    )
    items.forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [])

  return (
    <section className="h-svc" id="services" aria-labelledby="h-svc-title">
      <div className="h-svc-side">
        <Reveal as="div" className="h-sec-head">
          <h2 id="h-svc-title">Here's what I build</h2>
          <p className="h-voice k-voice">Direct with the person writing the code.</p>
        </Reveal>
      </div>
      <ul className="h-words" ref={list}>
        {SERVICES.map((s) => (
          <li key={s.name}>
            <h3>{s.name}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Stack() {
  return (
    <section className="h-stack" id="stack" aria-labelledby="h-stack-title">
      <Reveal as="header" className="h-sec-head">
        <h2 id="h-stack-title">Tools I actually ship with</h2>
      </Reveal>
      <dl>
        {STACK.map((group, i) => (
          <Reveal as="div" key={group.name} delay={(i % 2) * 50}>
            <dt>{group.name}</dt>
            <dd>{group.items.join(', ')}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

export function Contact() {
  return (
    <section className="h-contact" id="contact" aria-labelledby="h-contact-title">
      <Reveal as="div" className="h-contact-in">
        <h2 id="h-contact-title">Email me</h2>
        <p className="h-voice k-voice">Questions, feedback or just a hello are welcome.</p>
        <a className="h-mail" href={EMAIL_HREF}>
          {EMAIL}
        </a>
        <p className="h-li">
          <a href={LINKEDIN} rel="me noopener noreferrer" target="_blank">
            {LINKEDIN_LABEL}
          </a>
        </p>
      </Reveal>
      <footer className="h-foot">
        <AccentPicker className="h-foot-acc" />
        <p>Kahaan Kapasi. Developer.</p>
        <p>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </section>
  )
}
