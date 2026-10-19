import type { CSSProperties } from 'react'

interface PhotoProps {
  /** Path without extension. <path>.webp is 1600w and <path>-800.webp is 800w. */
  path: string
  alt: string
  sizes: string
  eager?: boolean
  className?: string
  style?: CSSProperties
}

/** A 16:9 photograph with a responsive srcset. Intrinsic size is declared to prevent layout shift. */
export function Photo({ path, alt, sizes, eager, className, style }: PhotoProps) {
  return (
    <img
      className={className}
      style={style}
      src={`${path}.webp`}
      srcSet={`${path}-800.webp 800w, ${path}.webp 1600w`}
      sizes={sizes}
      width={1600}
      height={900}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
    />
  )
}
