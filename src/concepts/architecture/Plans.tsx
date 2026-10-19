const INK = '#e8e6df'

function Dim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <path d={`M${x1} ${y}H${x2}M${x1} ${y - 5}v10M${x2} ${y - 5}v10`} />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" className="ca-dimtxt">
        {label}
      </text>
    </g>
  )
}

function PlanA() {
  return (
    <svg viewBox="0 0 520 330" role="img" aria-labelledby="pa-t">
      <title id="pa-t">Ground floor plan of the House at the Quarry Edge: a long gallery with slot windows, living room, kitchen and three bedrooms.</title>
      <defs>
        <pattern id="ca-hatch-a" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.8" />
        </pattern>
      </defs>
      <g fill="none" stroke={INK} strokeWidth="1.1">
        <rect x="40" y="70" width="440" height="190" />
        <rect x="46" y="76" width="428" height="178" />
        <path d="M46 150H474M46 192H250M330 192H474M200 76V150M200 150V254M330 192V254" />
        {/* slot windows */}
        {[84, 124, 164, 244, 284, 324, 404, 444].map((x) => (
          <g key={x}>
            <path d={`M${x} 70v6M${x + 14} 70v6`} strokeWidth="3" stroke="#0b0c0d" />
            <path d={`M${x} 70h14`} />
          </g>
        ))}
        {/* door swings */}
        <path d="M200 120a24 24 0 0124 -24M200 120V96h24" />
        <path d="M250 192a22 22 0 00-22 22M250 192v22h-22" />
        <path d="M330 220a22 22 0 0122 22M330 220v22h22" />
        <path d="M420 150a22 22 0 0122 -22M420 150v-22h22" />
        <path d="M46 150h0" />
      </g>
      <rect x="40" y="70" width="6" height="190" fill="url(#ca-hatch-a)" />
      <rect x="474" y="70" width="6" height="190" fill="url(#ca-hatch-a)" />
      <g className="ca-dim" stroke={INK} fill="none" strokeWidth="1">
        <Dim x1={40} x2={200} y={46} label="5,200" />
        <Dim x1={200} x2={330} y={46} label="4,100" />
        <Dim x1={330} x2={480} y={46} label="4,600" />
      </g>
      <g className="ca-roomtxt" fill={INK}>
        <text x="120" y="118">GALLERY</text>
        <text x="250" y="118">STUDY</text>
        <text x="370" y="118">LIVING</text>
        <text x="110" y="225">BED 1</text>
        <text x="266" y="228">BATH</text>
        <text x="366" y="228">KITCHEN</text>
      </g>
      <g stroke={INK} strokeWidth="1" fill="none">
        <path d="M500 296l8-28 8 28-8-6z" />
        <text x="508" y="262" textAnchor="middle" className="ca-dimtxt" stroke="none" fill={INK}>
          N
        </text>
      </g>
    </svg>
  )
}

function SectionB() {
  const arches = [96, 196, 296, 396]
  return (
    <svg viewBox="0 0 520 330" role="img" aria-labelledby="pb-t">
      <title id="pb-t">Cross section of the Cloister Library: a tall reading hall with shelves on one side, an arcade of arched windows on the other, and sun entering through the arches.</title>
      <defs>
        <pattern id="ca-hatch-b" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.8" />
        </pattern>
      </defs>
      <g fill="none" stroke={INK} strokeWidth="1.1">
        <path d="M70 280V80L260 22L450 80V280" />
        <path d="M40 280H480" strokeWidth="1.6" />
        <path d="M70 80H450" strokeDasharray="2 4" />
        {/* shelves */}
        {[110, 140, 170, 200, 230, 260].map((y) => (
          <path key={y} d={`M70 ${y}H122`} />
        ))}
        <path d="M122 100V280" />
        {/* trusses */}
        <path d="M70 80L260 22L450 80M150 80L260 22M370 80L260 22M260 22V80" strokeWidth="0.8" />
        {/* arcade, right side (seen in elevation behind the cut) */}
        {arches.map((x) => (
          <path key={x} d={`M${x + 120 - 24} 280V220a24 24 0 0148 0V280`} transform="translate(-0 0)" />
        ))}
        {/* sun rays */}
        <g strokeDasharray="5 6" stroke="#e5a21a" strokeWidth="1.2">
          <path d="M470 200L110 270" />
          <path d="M470 150L250 255" />
        </g>
        {/* reader at table */}
        <path d="M250 280V250h60V280M265 250v-10h30v10" />
        <circle cx="280" cy="226" r="5" />
      </g>
      <rect x="62" y="80" width="8" height="200" fill="url(#ca-hatch-b)" />
      <rect x="450" y="80" width="8" height="200" fill="url(#ca-hatch-b)" />
      <g className="ca-dim" stroke={INK} fill="none" strokeWidth="1">
        <Dim x1={70} x2={450} y={304} label="7,600" />
        <path d="M486 280V22M480 280h12M480 22h12" />
      </g>
      <text x="498" y="160" className="ca-dimtxt" fill={INK} stroke="none" transform="rotate(90 498 160)">
        8,400
      </text>
    </svg>
  )
}

function ElevC() {
  const cols = ['#2c2e2d', '#34373a', '#2c2e2d', '#34373a']
  return (
    <svg viewBox="0 0 520 330" role="img" aria-labelledby="pc-t">
      <title id="pc-t">Front elevation of Lowmarket Terrace: four narrow houses with a regular grid of windows, entrance doors and stepped parapets.</title>
      <defs>
        <pattern id="ca-brick" width="10" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 5H10M5 0V5" stroke={INK} strokeWidth="0.4" fill="none" opacity="0.5" />
        </pattern>
      </defs>
      <g fill="none" stroke={INK} strokeWidth="1.1">
        <path d="M30 280H490" strokeWidth="1.6" />
        {[0, 1, 2, 3].map((i) => {
          const x = 50 + i * 106
          const top = [88, 74, 88, 66][i]
          return (
            <g key={i}>
              <rect x={x} y={top} width="102" height={280 - top} fill={cols[i]} />
              <rect x={x} y={top} width="102" height={280 - top} fill="url(#ca-brick)" />
              <path d={`M${x - 3} ${top}h108`} strokeWidth="2" />
              {[0, 1].map((c) =>
                [0, 1, 2].map((r) => (
                  <rect key={`${c}${r}`} x={x + 14 + c * 46} y={top + 14 + r * 50} width="28" height="38" />
                )),
              )}
              <rect x={x + 38} y="238" width="26" height="42" />
              <path d={`M${x + 32} 280h38`} strokeWidth="1.6" />
            </g>
          )
        })}
        <g stroke="#b3321a" strokeWidth="1">
          {[[280, '+0.00'], [230, '+3.10'], [180, '+6.20'], [130, '+9.30']].map(([y, l]) => (
            <g key={String(l)}>
              <path d={`M18 ${y}h26`} />
              <path d={`M26 ${Number(y) - 6}l6 6l6-6`} />
              <text x="46" y={Number(y) - 4} className="ca-dimtxt" fill="#e87a5c" stroke="none">
                {String(l)}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}

export default function Plans() {
  const sheets = [
    { n: 'A-101', t: 'House at the Quarry Edge', s: 'Ground floor plan', el: <PlanA /> },
    { n: 'A-301', t: 'Cloister Library', s: 'Cross section', el: <SectionB /> },
    { n: 'A-201', t: 'Lowmarket Terrace', s: 'Front elevation', el: <ElevC /> },
  ]
  return (
    <div className="ca-sheets">
      {sheets.map((s) => (
        <figure key={s.n} className="ca-sheet">
          <div className="ca-sheet__draw" tabIndex={0} role="group" aria-label={`Drawing ${s.n}: ${s.t}, ${s.s}. Scrolls sideways on narrow screens.`}>
            {s.el}
          </div>
          <figcaption>
            <span className="ca-sheet__no">{s.n}</span>
            <span>
              <b>{s.t}</b>
              <br />
              {s.s}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
