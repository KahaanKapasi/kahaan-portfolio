import type { ReactNode } from 'react'
import { useLightbox, type LightboxItem } from './Lightbox'

export function ExtIcon() {
  return (
    <svg className="w-ext" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 3h8v8M13 3L3 13" />
    </svg>
  )
}

export function Section({ id, title, children, wide }: { id: string; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className={`w-sec${wide ? ' w-sec--wide' : ''}`} id={id} aria-labelledby={`${id}-h`}>
      <div className="w-sec__head">
        <h2 id={`${id}-h`}>{title}</h2>
      </div>
      <div className="w-sec__body">{children}</div>
    </section>
  )
}

export function Prose({ children, lead }: { children: ReactNode; lead?: boolean }) {
  return <div className={`w-prose${lead ? ' w-prose--lead' : ''}`}>{children}</div>
}

/** Numbered rows: name left, description right. Not a card grid. */
export function Rows({ items }: { items: { name: string; text: ReactNode }[] }) {
  return (
    <ol className="w-rows">
      {items.map((it) => (
        <li key={it.name}>
          <h3>{it.name}</h3>
          <p>{it.text}</p>
        </li>
      ))}
    </ol>
  )
}

export function StackTable({ groups }: { groups: { name: string; items: string }[] }) {
  return (
    <dl className="w-stack">
      {groups.map((g) => (
        <div key={g.name}>
          <dt>{g.name}</dt>
          <dd>{g.items}</dd>
        </div>
      ))}
    </dl>
  )
}

export type Shot = LightboxItem & { kind?: 'wide' | 'tall' }

type FigureProps = {
  shot: Shot
  plate?: string
  caption?: ReactNode
  group?: Shot[]
  eager?: boolean
  className?: string
}

/** A screenshot on a dark mat. Click or press Enter to enlarge. */
export function Figure({ shot, plate, caption, group, eager, className }: FigureProps) {
  const lb = useLightbox()
  const list = group ?? [shot]
  const idx = Math.max(0, list.indexOf(shot))
  return (
    <figure className={`w-fig${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        className="w-fig__btn"
        onClick={() => lb.open(list, idx)}
        aria-label={`Enlarge: ${shot.caption ?? shot.alt}`}
      >
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </button>
      {plate || caption ? (
        <figcaption>
          {plate ? <b>{plate}</b> : null}
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}

export function PlateGrid({ layout, children }: { layout: 'wide-tall' | 'tall-wide' | 'wide' | 'duo' | 'trio' | 'phones'; children: ReactNode }) {
  return <div className={`w-plates w-plates--${layout}`}>{children}</div>
}

export function PhoneFrame({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <div className={`w-phone${className ? ` ${className}` : ''}`} role={label ? 'group' : undefined} aria-label={label}>
      <div className="w-phone__screen">{children}</div>
    </div>
  )
}

export function BrowserFrame({
  url,
  children,
  action,
  className,
}: {
  url: string
  children: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={`w-browser${className ? ` ${className}` : ''}`}>
      <div className="w-browser__bar">
        <span className="w-browser__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="w-browser__url">{url}</span>
        {action}
      </div>
      <div className="w-browser__body">{children}</div>
    </div>
  )
}

export function MockNote({ children }: { children: ReactNode }) {
  return (
    <p className="w-mocknote" role="note">
      {children}
    </p>
  )
}
