import { CLUBS, type ClubId } from './data'

/**
 * Code-drawn simplified geometric club badges.
 * Unofficial stylized badges constructed strictly with code SVG.
 * No official copyrighted crest image files used.
 */
export function Crest({
  club,
  size = 56,
  title,
}: {
  club: ClubId
  size?: number
  title?: string
}) {
  const c = CLUBS[club]
  const label = title ?? `${c.name} badge`

  if (club === 'real-madrid') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 64 74" role="img" aria-label={label} className="cf-badge">
        {/* Stylized crown top */}
        <path d="M16 18L21 6L32 14L43 6L48 18Z" fill="#d4af37" stroke="#0e1726" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="21" cy="5" r="2.2" fill="#d4af37" />
        <circle cx="32" cy="12" r="2.4" fill="#ffffff" stroke="#0e1726" strokeWidth="1" />
        <circle cx="43" cy="5" r="2.2" fill="#d4af37" />
        {/* Circular royal shield */}
        <circle cx="32" cy="44" r="26" fill="#f8f9fa" stroke="#d4af37" strokeWidth="3" />
        <circle cx="32" cy="44" r="21" fill="none" stroke="#0e1726" strokeWidth="1.5" opacity="0.4" />
        {/* Diagonal purple/navy royal sash */}
        <g clipPath="url(#cf-rm-clip)">
          <path d="M12 28L52 60H42L8 34Z" fill="#3b2d71" />
        </g>
        <clipPath id="cf-rm-clip">
          <circle cx="32" cy="44" r="20" />
        </clipPath>
        {/* Stylized royal monogram lines */}
        <path d="M26 36V52M32 34V54M38 36V52" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="44" r="7" fill="none" stroke="#d4af37" strokeWidth="2" />
      </svg>
    )
  }

  if (club === 'barcelona') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 64 74" role="img" aria-label={label} className="cf-badge">
        <defs>
          <clipPath id="cf-barca-clip">
            <path d="M7 10C18 6 46 6 57 10C57 38 48 60 32 70C16 60 7 38 7 10Z" />
          </clipPath>
        </defs>
        {/* Shield base with gold border */}
        <path d="M7 10C18 6 46 6 57 10C57 38 48 60 32 70C16 60 7 38 7 10Z" fill="#edbb00" stroke="#0e1726" strokeWidth="2" />
        <g clipPath="url(#cf-barca-clip)">
          {/* Top Left: St George Cross */}
          <rect x="7" y="6" width="25" height="25" fill="#f8f9fa" />
          <path d="M19 6V31M7 18.5H32" stroke="#a50044" strokeWidth="4.5" />
          {/* Top Right: Senyera vertical stripes (red/yellow) */}
          <rect x="32" y="6" width="25" height="25" fill="#edbb00" />
          <path d="M37 6V31M43 6V31M49 6V31" stroke="#a50044" strokeWidth="3" />
          {/* Horizontal dividing sash */}
          <rect x="7" y="30" width="50" height="7" fill="#0e1726" />
          {/* Bottom half: Blaugrana vertical stripes */}
          <rect x="7" y="37" width="50" height="37" fill="#a50044" />
          <path d="M19 37V72M31 37V72M43 37V72" stroke="#004d98" strokeWidth="6" />
          {/* Vintage football at center */}
          <circle cx="32" cy="52" r="7.5" fill="#edbb00" stroke="#0e1726" strokeWidth="1.5" />
          <path d="M26 52H38M32 45V59" stroke="#0e1726" strokeWidth="1" />
        </g>
      </svg>
    )
  }

  if (club === 'man-city') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={label} className="cf-badge">
        <circle cx="32" cy="32" r="30" fill="#6cabdd" stroke="#1c2c5b" strokeWidth="2" />
        <circle cx="32" cy="32" r="26" fill="#ffffff" stroke="#1c2c5b" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="21" fill="#6cabdd" />
        {/* Three-masted sailing ship */}
        <path d="M22 25L32 15L42 25H22Z" fill="#edbb00" stroke="#1c2c5b" strokeWidth="1.2" />
        <path d="M24 25C26 31 38 31 40 25Z" fill="#edbb00" stroke="#1c2c5b" strokeWidth="1.2" />
        {/* Red rose of Lancashire */}
        <circle cx="32" cy="41" r="5" fill="#dc052d" stroke="#1c2c5b" strokeWidth="1" />
        <circle cx="32" cy="41" r="2.2" fill="#edbb00" />
      </svg>
    )
  }

  if (club === 'liverpool') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 64 74" role="img" aria-label={label} className="cf-badge">
        {/* Shankly Gates ornament */}
        <path d="M14 12C22 6 42 6 50 12V16H14V12Z" fill="#00b2a9" stroke="#0a140f" strokeWidth="1.5" />
        {/* Twin eternal flames */}
        <circle cx="10" cy="36" r="3.5" fill="#ffd21f" />
        <path d="M10 32C10 30 11 27 10 25C9 27 8 30 10 32Z" fill="#dc052d" />
        <circle cx="54" cy="36" r="3.5" fill="#ffd21f" />
        <path d="M54 32C54 30 55 27 54 25C53 27 52 30 54 32Z" fill="#dc052d" />
        {/* Shield with Liver bird */}
        <path d="M14 16H50V46C50 58 32 68 32 68C32 68 14 58 14 46V16Z" fill="#c8102e" stroke="#0a140f" strokeWidth="2" />
        {/* Liver bird stylized silhouette */}
        <path d="M32 26C34 26 36 24 37 22C38 24 38 28 35 30C38 30 41 33 40 37C39 41 36 43 36 47H28C28 44 26 42 27 38C28 34 29 32 31 31C30 28 30 26 32 26Z" fill="#00b2a9" stroke="#f8f9fa" strokeWidth="1" />
        <path d="M26 47H38V50H26V47Z" fill="#00b2a9" />
      </svg>
    )
  }

  if (club === 'arsenal') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 64 74" role="img" aria-label={label} className="cf-badge">
        {/* Shield */}
        <path d="M8 8H56V44C56 58 32 68 32 68C32 68 8 58 8 44V8Z" fill="#db0007" stroke="#9c824a" strokeWidth="2.5" />
        <path d="M13 13H51V42C51 54 32 62 32 62C32 62 13 54 13 42V13Z" fill="none" stroke="#001844" strokeWidth="1.5" />
        {/* Cannon facing right */}
        <g transform="translate(14, 28)">
          <path d="M3 14L28 9V14L3 17Z" fill="#9c824a" stroke="#001844" strokeWidth="1.2" />
          <circle cx="12" cy="18" r="7" fill="#9c824a" stroke="#001844" strokeWidth="1.5" />
          <circle cx="12" cy="18" r="3" fill="#001844" />
          <rect x="27" y="8" width="4" height="7" rx="1" fill="#9c824a" stroke="#001844" strokeWidth="1" />
          <path d="M4 17L12 18" stroke="#001844" strokeWidth="2" />
        </g>
      </svg>
    )
  }

  if (club === 'bayern') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={label} className="cf-badge">
        <circle cx="32" cy="32" r="30" fill="#dc052d" stroke="#ffffff" strokeWidth="2" />
        <circle cx="32" cy="32" r="25" fill="#0066b2" />
        <circle cx="32" cy="32" r="22" fill="#ffffff" />
        {/* Bavarian diamond lozenge pattern */}
        <g clipPath="url(#cf-bayern-clip)">
          <rect x="12" y="12" width="40" height="40" fill="#ffffff" />
          <path d="M8 16L32 0L56 16L32 32L8 16Z" fill="#0066b2" />
          <path d="M8 32L32 16L56 32L32 48L8 32Z" fill="#0066b2" />
          <path d="M8 48L32 32L56 48L32 64L8 48Z" fill="#0066b2" />
        </g>
        <clipPath id="cf-bayern-clip">
          <circle cx="32" cy="32" r="18" />
        </clipPath>
      </svg>
    )
  }

  if (club === 'psg') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={label} className="cf-badge">
        <circle cx="32" cy="32" r="30" fill="#004170" stroke="#da291c" strokeWidth="2" />
        <circle cx="32" cy="32" r="25" fill="#ffffff" />
        <circle cx="32" cy="32" r="21" fill="#004170" />
        {/* Eiffel Tower silhouette */}
        <path d="M30 16H34L33 26H31Z" fill="#da291c" />
        <path d="M30 26L23 44H27L30 36H34L37 44H41L34 26H30Z" fill="#da291c" stroke="#ffffff" strokeWidth="0.8" />
        <path d="M28 37H36" stroke="#ffffff" strokeWidth="1" />
        {/* Fleur-de-lys at base */}
        <path d="M32 45C33 46 34 47 34 48C33 48 32 47 32 45Z" fill="#ffffff" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={label}>
      <circle cx="32" cy="32" r="30" fill={c.primary} />
    </svg>
  )
}

/** Footonomy brand mark: modern football vector geometry */
export function FootonomyMark({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className="cf-footonomy-mark">
      <circle cx="32" cy="32" r="29" stroke={color} strokeWidth="3" />
      {/* Central pentagon */}
      <polygon points="32,20 42,27 38,39 26,39 22,27" fill={color} />
      {/* Dynamic trajectory seams */}
      <path d="M32 20V4M42 27L58 18M38 39L50 56M26 39L14 56M22 27L6 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Sub-orbits */}
      <circle cx="50" cy="56" r="3" fill="#d4ff3c" />
      <circle cx="14" cy="56" r="3" fill="#d4ff3c" />
    </svg>
  )
}

/**
 * 2D Kit Shirt SVG component displaying front or back of shirt with player name & number.
 */
export function Shirt({
  club,
  number,
  name,
  view = 'front',
  size = 140,
}: {
  club: ClubId
  number?: number
  name?: string
  view?: 'front' | 'back'
  size?: number
}) {
  const c = CLUBS[club]
  const clipId = `cf-shirt-clip-${club}-${view}`
  const textColor = c.textDark ? '#111827' : '#f8f9fa'

  return (
    <svg
      width={size}
      height={size * 0.94}
      viewBox="0 0 120 112"
      role="img"
      aria-label={`${c.name} kit ${view}, ${c.kitNote}`}
      className="cf-shirt-svg"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M40 6C44 14 52 18 60 18C68 18 76 14 80 6L110 18L120 46L103 54L97 42V106H23V42L17 54L0 46L10 18Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Base body */}
        <rect width="120" height="112" fill={c.primary} />

        {/* Club specific jersey motifs */}
        {club === 'barcelona' && (
          <g>
            <rect x="0" y="0" width="120" height="112" fill="#004d98" />
            <rect x="28" y="0" width="16" height="112" fill="#a50044" />
            <rect x="52" y="0" width="16" height="112" fill="#a50044" />
            <rect x="76" y="0" width="16" height="112" fill="#a50044" />
          </g>
        )}

        {club === 'psg' && (
          <g>
            {/* White margins with central red stripe */}
            <rect x="49" y="0" width="22" height="112" fill="#ffffff" />
            <rect x="52" y="0" width="16" height="112" fill="#da291c" />
          </g>
        )}

        {club === 'arsenal' && (
          <g>
            {/* White sleeves on red body */}
            <rect x="0" y="0" width="26" height="112" fill="#ffffff" />
            <rect x="94" y="0" width="26" height="112" fill="#ffffff" />
          </g>
        )}

        {club === 'real-madrid' && (
          <g>
            {/* Golden ochre shoulder bands */}
            <line x1="22" y1="12" x2="38" y2="8" stroke="#d4af37" strokeWidth="3" />
            <line x1="82" y1="8" x2="98" y2="12" stroke="#d4af37" strokeWidth="3" />
          </g>
        )}

        {club === 'bayern' && (
          <g>
            <line x1="10" y1="36" x2="110" y2="36" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="72" x2="110" y2="72" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
          </g>
        )}

        {club === 'man-city' && (
          <g>
            <circle cx="60" cy="112" r="50" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" />
          </g>
        )}

        {/* Front view badge */}
        {view === 'front' && (
          <g transform="translate(74, 30)">
            <circle cx="6" cy="6" r="6" fill={c.secondary} />
            <circle cx="6" cy="6" r="4.5" fill={c.primary} />
          </g>
        )}
      </g>

      {/* Collar outline */}
      <path d="M40 6C44 14 52 18 60 18C68 18 76 14 80 6" stroke={c.secondary} strokeWidth="3" fill="none" />

      {/* Back View: Player Name and Number */}
      {view === 'back' && (
        <g>
          {name && (
            <text
              x="60"
              y="40"
              textAnchor="middle"
              fontFamily="'Anybody Variable', sans-serif"
              fontWeight="800"
              fontSize="10"
              letterSpacing="0.1em"
              fill={textColor}
            >
              {name.toUpperCase()}
            </text>
          )}
          {number !== undefined && (
            <text
              x="60"
              y="82"
              textAnchor="middle"
              fontFamily="'Anybody Variable', sans-serif"
              fontWeight="900"
              fontSize="38"
              fill={textColor}
              stroke={c.textDark ? '#ffffff' : '#0a100d'}
              strokeWidth="0.8"
            >
              {number}
            </text>
          )}
        </g>
      )}

      {/* Front View: Center squad number */}
      {view === 'front' && number !== undefined && (
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fontFamily="'Anybody Variable', sans-serif"
          fontWeight="900"
          fontSize="26"
          fill={textColor}
          opacity="0.85"
        >
          {number}
        </text>
      )}
    </svg>
  )
}
