import { PHOTO_CREDITS } from './creditsData'

/** Compact photo credits. The full record, including the AI-modified variants, is in public/concepts/autos/CREDITS.md. */
export function Credits() {
  return (
    <details className="au-credits">
      <summary>Photo credits and licences</summary>
      <p>
        Photographs from Wikimedia Commons, cropped to 16:9 and resized. Colour and wheel options are modified with AI (Google Gemini
        image editing) from the photographs credited below and carry the same licence as their original.{' '}
        <a href="/concepts/autos/CREDITS.md">Full credits</a>.
      </p>
      <ul>
        {PHOTO_CREDITS.map((c) => (
          <li key={`${c.model}-${c.angle}`}>
            <span>{c.name}, {c.angle}:</span>{' '}
            <a href={c.source} target="_blank" rel="noreferrer">{c.title.replace(/\.jpe?g$/i, '')}</a> by {c.author},{' '}
            <a href={c.licenseUrl} target="_blank" rel="noreferrer">{c.license}</a>
          </li>
        ))}
      </ul>
    </details>
  )
}
