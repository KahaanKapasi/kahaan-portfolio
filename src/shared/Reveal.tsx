import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Blur-to-sharp entrance. Content is visible by default; the hidden state only exists once the
 * observer is running (the .rv-on class on <html>), so nothing stays hidden if scripts fail.
 */
let observer: IntersectionObserver | null = null
function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in')
            observer?.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    document.documentElement.classList.add('rv-on')
  }
  return observer
}

type Props = {
  as?: string
  className?: string
  delay?: number
  style?: CSSProperties
  children?: ReactNode
  [key: string]: unknown
}

export function Reveal({ as = 'div', className, delay = 0, style, children, ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    const io = getObserver()
    if (!el || !io) return
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  return createElement(
    as,
    {
      ref,
      className: `rv${className ? ` ${className}` : ''}`,
      style: delay ? ({ ...style, '--rv-delay': `${delay}ms` } as CSSProperties) : style,
      ...rest,
    },
    children,
  )
}
