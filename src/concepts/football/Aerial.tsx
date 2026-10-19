/** Static top-down view of the arena. Used when WebGL is off or motion is reduced. */
const dots: { x: number; y: number; c: string; r: number }[] = []
{
  let s = 11
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  for (let ring = 0; ring < 9; ring++) {
    const rx = 560 + ring * 26
    const ry = 330 + ring * 22
    const n = 70 + ring * 12
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.04
      const left = Math.cos(a) < -0.45
      const right = Math.cos(a) > 0.45
      // Left side: Real Madrid (white / gold / navy); Right side: Barcelona (blaugrana / gold); Neutral stands
      const pal = left
        ? ['#f4f6ee', '#ffffff', '#d4af37', '#111827']
        : right
          ? ['#a50044', '#004d98', '#edbb00', '#111827']
          : ['#3a4540', '#59655f', '#f4f6ee', '#232b27']
      dots.push({
        x: 800 + Math.cos(a) * rx,
        y: 500 + Math.sin(a) * ry,
        c: pal[Math.floor(rnd() * pal.length)],
        r: 5 + rnd() * 1.5,
      })
    }
  }
}

export function Aerial() {
  const stripes = Array.from({ length: 14 }, (_, i) => i)
  return (
    <svg className="cf-aerial" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="cf-aer-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#1d5a31" />
          <stop offset="0.6" stopColor="#0a1a10" />
          <stop offset="1" stopColor="#050b08" />
        </radialGradient>
        <radialGradient id="cf-aer-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f2ffe9" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#d4ff3c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#d4ff3c" stopOpacity="0" />
        </radialGradient>
        <clipPath id="cf-aer-pitch">
          <rect x="520" y="340" width="560" height="320" rx="6" />
        </clipPath>
      </defs>
      <rect width="1600" height="1000" fill="url(#cf-aer-glow)" />
      <ellipse cx="800" cy="500" rx="820" ry="520" fill="#0c1511" />
      <ellipse cx="800" cy="500" rx="640" ry="400" fill="#121b16" stroke="#26342d" strokeWidth="2" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity="0.9" />
      ))}
      <ellipse cx="800" cy="500" rx="800" ry="500" fill="none" stroke="#d4ff3c" strokeWidth="3" opacity="0.7" />
      <ellipse cx="800" cy="500" rx="420" ry="250" fill="#0a140e" />
      <g clipPath="url(#cf-aer-pitch)">
        {stripes.map((i) => (
          <rect key={i} x={520 + i * 40} y="340" width="41" height="320" fill={i % 2 ? '#1a6531' : '#217438'} />
        ))}
      </g>
      <g fill="none" stroke="#f4f6ee" strokeWidth="2.5" opacity="0.92">
        <rect x="522" y="342" width="556" height="316" />
        <path d="M800 342v316" />
        <circle cx="800" cy="500" r="48" />
        <rect x="522" y="414" width="86" height="172" />
        <rect x="992" y="414" width="86" height="172" />
        <rect x="522" y="456" width="29" height="88" />
        <rect x="1049" y="456" width="29" height="88" />
      </g>
      {[
        [90, 70],
        [1510, 70],
        [1510, 930],
        [90, 930],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="130" fill="url(#cf-aer-lamp)" />
      ))}
    </svg>
  )
}
