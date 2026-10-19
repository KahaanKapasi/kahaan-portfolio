import { Reveal } from '../shared/Reveal'
import { CREDIBILITY } from './data'

export default function Credibility() {
  const [lead, ...rest] = CREDIBILITY
  return (
    <section className="h-cred" aria-label="Highlights">
      <Reveal as="p" className="h-cred-lead">
        <b>{lead.k}</b> {lead.text}
      </Reveal>
      <ul>
        {rest.map((item, i) => (
          <Reveal as="li" key={item.k} delay={i * 60}>
            <b>{item.k}</b>
            <span>{item.text}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
