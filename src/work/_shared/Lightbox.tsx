import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type LightboxItem = { src: string; alt: string; width: number; height: number; caption?: string }

type Ctx = { open: (items: LightboxItem[], index: number) => void }
const LightboxContext = createContext<Ctx>({ open: () => {} })
export const useLightbox = () => useContext(LightboxContext)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [items, setItems] = useState<LightboxItem[]>([])
  const [index, setIndex] = useState(0)

  const open = useCallback((list: LightboxItem[], i: number) => {
    returnFocus.current = document.activeElement as HTMLElement | null
    setItems(list)
    setIndex(i)
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])

  const close = useCallback(() => {
    ref.current?.close()
  }, [])

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (items.length ? (i + dir + items.length) % items.length : 0)),
    [items.length],
  )

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onClose = () => {
      returnFocus.current?.focus?.()
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
  }

  const ctx = useMemo(() => ({ open }), [open])
  const cur = items[index]

  return (
    <LightboxContext.Provider value={ctx}>
      {children}
      <dialog
        ref={ref}
        className="w-lb"
        aria-label="Image viewer"
        onKeyDown={onKey}
        onClick={(e) => {
          if (e.target === ref.current) close()
        }}
      >
        {cur ? (
          <div className="w-lb__inner">
            <img
              key={cur.src}
              className="w-lb__img"
              src={cur.src}
              alt={cur.alt}
              width={cur.width}
              height={cur.height}
            />
            <div className="w-lb__bar">
              <p className="w-lb__cap">{cur.caption ?? cur.alt}</p>
              <div className="w-lb__ctl">
                {items.length > 1 ? (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous image">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                    </button>
                    <span aria-live="polite">
                      {index + 1} / {items.length}
                    </span>
                    <button type="button" onClick={() => step(1)} aria-label="Next image">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                ) : null}
                <button type="button" onClick={close} autoFocus>
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </LightboxContext.Provider>
  )
}
