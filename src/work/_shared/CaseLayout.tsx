import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource-variable/bodoni-moda/wght-italic.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import { useMeta } from '../../shared/meta'
import SiteNav from '../../shared/SiteNav'
import AccentPicker from '../../shared/AccentPicker'
import { EMAIL, LINKEDIN, LINKEDIN_LABEL } from '../../shared/contact'
import { LightboxProvider } from './Lightbox'
import { ExtIcon } from './parts'
import { neighbours } from './cases'
import './case.css'

export type CaseLink = { label: string; href: string; external?: boolean }

type Props = {
  slug: string
  title: string
  summary: ReactNode
  /** Short role line shown in the facts list. */
  role: ReactNode
  stack: string
  status: string
  links?: CaseLink[]
  /** Extra credit line, e.g. "Built with a 3-person team". */
  credit?: ReactNode
  accent?: string
  accentInk?: string
  metaTitle: string
  metaDescription: string
  hero: ReactNode
  children: ReactNode
}

export default function CaseLayout({
  slug,
  title,
  summary,
  role,
  stack,
  status,
  links,
  credit,
  accent,
  accentInk,
  metaTitle,
  metaDescription,
  hero,
  children,
}: Props) {
  useMeta(metaTitle, metaDescription)
  const { prev, next } = neighbours(slug)
  // The shared world keeps one accent. A case's own brand colour only tints a small swatch.
  void accentInk
  const style = (accent ? { '--w-tint': accent } : {}) as CSSProperties

  return (
    <div className="w-case" style={style}>
      <LightboxProvider>
        <a className="w-skip" href="#case-main">
          Skip to the case study
        </a>
        <SiteNav />
        <div className="w-top">
          <Link className="w-back" to="/#work">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3L5 8l5 5" />
            </svg>
            All work
          </Link>
          <p className="w-top__who">
            <span className="w-top__sw" aria-hidden="true" />
            Case study
          </p>
        </div>

        <main id="case-main" className="w-main">
          <section className="w-hero" aria-labelledby="case-title">
            <h1 id="case-title">{title}</h1>
            <div className="w-hero__text">
              <p className="w-hero__lede">{summary}</p>
              {credit ? <p className="w-hero__credit">{credit}</p> : null}
            </div>
            <dl className="w-facts">
              <div>
                <dt>Role</dt>
                <dd>{role}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{stack}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{status}</dd>
              </div>
              {links && links.length ? (
                <div>
                  <dt>Links</dt>
                  <dd className="w-facts__links">
                    {links.map((l) =>
                      l.external ? (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label}
                          <ExtIcon />
                        </a>
                      ) : (
                        <Link key={l.href} to={l.href}>
                          {l.label}
                        </Link>
                      ),
                    )}
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="w-hero__visual">{hero}</div>
          </section>

          {children}
        </main>

        <footer className="w-foot">
          <Link className="w-next" to={next.path}>
            <span className="w-next__lbl">Next case study</span>
            <span className="w-next__name">{next.name}</span>
            <span className="w-next__blurb">{next.blurb}</span>
          </Link>
          <div className="w-foot__pn">
            <Link to={prev.path}>
              <span>Previous</span>
              {prev.name}
            </Link>
            <Link to="/#work">
              <span>All work</span>
              Back to the list
            </Link>
          </div>
          <div className="w-foot__contact">
            <h2 className="k-voice">Have something to build?</h2>
            <a className="w-foot__mail" href={`mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry')}`}>
              {EMAIL}
            </a>
            <a className="w-foot__li" href={LINKEDIN} target="_blank" rel="me noopener noreferrer">
              {LINKEDIN_LABEL}
            </a>
          </div>
          <div className="w-foot__end">
            <p className="w-foot__fine">Kahaan Kapasi. Independent web developer.</p>
            <AccentPicker />
          </div>
        </footer>
      </LightboxProvider>
    </div>
  )
}
