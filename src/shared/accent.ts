import { useEffect, useState } from 'react'

/**
 * The portfolio's one accent colour, chosen by the visitor. The CSS tokens live in shared.css
 * (`:root[data-accent=...]`); this module only stores the choice and tells WebGL to re-read it.
 * index.html sets `data-accent` from localStorage before first paint, so there is no flash.
 */
export const ACCENTS = [
  { id: 'amber', label: 'Amber', hex: '#e8a317' },
  { id: 'blue', label: 'Electric blue', hex: '#4f8dff' },
  { id: 'mono', label: 'Mono', hex: '#ebe5d6' },
  { id: 'red', label: 'Signal red', hex: '#ff4a3d' },
] as const

export type AccentId = (typeof ACCENTS)[number]['id']

export const DEFAULT_ACCENT: AccentId = 'amber'
export const ACCENT_KEY = 'kk-accent'
export const ACCENT_EVENT = 'kk-accent'

const isAccent = (v: unknown): v is AccentId => ACCENTS.some((a) => a.id === v)

/** The accent currently applied to the document (falls back to the default on the server). */
export function currentAccent(): AccentId {
  if (typeof document === 'undefined') return DEFAULT_ACCENT
  const v = document.documentElement.dataset.accent
  return isAccent(v) ? v : DEFAULT_ACCENT
}

export function applyAccent(id: AccentId) {
  document.documentElement.dataset.accent = id
  try {
    window.localStorage.setItem(ACCENT_KEY, id)
  } catch {
    /* private mode or blocked storage: the choice just lasts for this visit */
  }
  window.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: id }))
}

/** The resolved `--k-accent` colour as a hex string, read from the live document. */
export function accentHex(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--k-accent').trim()
  return v || ACCENTS[0].hex
}

/** Subscribe to accent changes (including from another tab). Returns an unsubscribe. */
export function onAccentChange(fn: (id: AccentId) => void) {
  const local = () => fn(currentAccent())
  const storage = (e: StorageEvent) => {
    if (e.key === ACCENT_KEY && isAccent(e.newValue)) {
      document.documentElement.dataset.accent = e.newValue
      fn(e.newValue)
    }
  }
  window.addEventListener(ACCENT_EVENT, local)
  window.addEventListener('storage', storage)
  return () => {
    window.removeEventListener(ACCENT_EVENT, local)
    window.removeEventListener('storage', storage)
  }
}

export function useAccent(): [AccentId, (id: AccentId) => void] {
  const [id, setId] = useState<AccentId>(currentAccent)
  useEffect(() => {
    setId(currentAccent())
    return onAccentChange(setId)
  }, [])
  return [id, applyAccent]
}
