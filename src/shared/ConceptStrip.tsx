import { Link } from 'react-router-dom'
import './shared.css'

/**
 * Required at the very top of every concept site (above its own nav).
 * States plainly that the site is a concept build with a fictional brand.
 */
export function ConceptStrip({ brand, note }: { brand: string; note?: string }) {
  return (
    <div className="kk-concept-strip" role="note">
      <p>
        {note?.startsWith('Concept build') ? (
          <>
            <strong>{note.split('.')[0]}.</strong>
            {note.slice(note.indexOf('.') + 1)}
          </>
        ) : (
          <>
            <strong>Concept build.</strong>{' '}
            {note ??
              `${brand} is a fictional brand, designed and built by Kahaan Kapasi as a portfolio piece. Not client work.`}
          </>
        )}
      </p>
      <Link to="/#concepts">Back to portfolio</Link>
    </div>
  )
}

/** Shared back link for case-study pages (or use your own styled version). */
export function BackToPortfolio({ className }: { className?: string }) {
  return (
    <Link className={className ?? 'kk-back'} to="/#work">
      Back to portfolio
    </Link>
  )
}
