import { useEffect, useRef } from 'react'
import { Reveal } from '../shared/Reveal'

type Stop = {
  when: string
  title: string
  org?: string
  body: string[]
  sub?: { name: string; text: string }[]
  logo?: boolean
}

const STOPS: Stop[] = [
  {
    when: 'Nov 2025 - now',
    title: 'Product Development Intern',
    org: 'Veefin Solutions Ltd',
    body: [
      'Retail internet banking for a Philippines-based bank, mobile and web. Employee of the Month, January. Trade finance product work in React, Spring Boot and PostgreSQL/MySQL. An internal induction platform built end to end, and an org-wide feedback app with Slack.',
      'Technical solutionist on Flippr, the B2C sports app: system architecture, backend design, and core mobile developer. Employer screens and client names stay off this site.',
    ],
  },
  {
    when: 'Dec 2023 - now',
    title: 'Founder',
    org: 'Madridonomy',
    body: [
      '61K+ followers. An AI content pipeline. Brand partnerships with FIFA x DoorDash, FanCode, ChatBCC and The Residency. About ₹1.5L+ revenue in eight months, run solo.',
    ],
  },
  {
    when: 'Aug 2024 - now',
    title: 'Vice President, now Mentor',
    org: 'Spectrum, college tech event',
    body: ['Led the 2025 edition with an 80+ member committee. Helped raise about ₹2.25-2.5L in sponsorships.'],
  },
  {
    when: 'Hackathons and community',
    title: 'Builds outside class and work',
    body: [],
    sub: [
      { name: 'Ignite IT 8.0', text: 'Final 8 of 60. Emergency SOS app.' },
      { name: 'RaktDaan', text: 'Blood-donation SOS with Gemini OCR.' },
      { name: 'Minetree', text: 'Moderation and QA for a large gaming community.' },
    ],
    logo: true,
  },
]

export default function Experience() {
  const rail = useRef<HTMLOListElement>(null)

  // The rail fills as you read down it, and each stop lights once it passes the reading line.
  useEffect(() => {
    const el = rail.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('.h-stop'))
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const line = vh * 0.62
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height))
      el.style.setProperty('--fill', p.toFixed(4))
      for (const it of items) it.classList.toggle('is-lit', it.getBoundingClientRect().top < line)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="h-exp" id="experience" aria-labelledby="h-exp-title">
      <Reveal as="header" className="h-sec-head">
        <h2 id="h-exp-title">Experience</h2>
        <p className="h-voice k-voice">Banking software by day, a football media brand by night.</p>
      </Reveal>

      <ol className="h-rail" ref={rail}>
        {STOPS.map((s) => (
          <li className="h-stop" key={s.title}>
            <span className="h-stop-dot" aria-hidden="true" />
            <Reveal as="div" className="h-stop-in">
              <p className="h-stop-when">{s.when}</p>
              <div className="h-stop-body">
                <h3>
                  {s.title}
                  {s.org ? <span>{s.org}</span> : null}
                </h3>
                {s.body.map((t) => (
                  <p key={t.slice(0, 24)}>{t}</p>
                ))}
                {s.sub ? (
                  <ul className="h-stop-sub">
                    {s.sub.map((x) => (
                      <li key={x.name}>
                        <strong>{x.name}</strong>
                        <span>{x.text}</span>
                        {x.name === 'Minetree' && s.logo ? (
                          <img
                            className="h-minetree"
                            src="/home/minetree.webp"
                            width={720}
                            height={361}
                            alt="Minetree wordmark with a toucan and a blocky tree."
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
