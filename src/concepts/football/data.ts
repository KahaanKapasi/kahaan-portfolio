/* Footonomy concept build: Real clubs, real players, and tactical data.
   Unofficial concept build; all club names, crest motifs, and player details belong to their respective owners. */

export type ClubId = 'real-madrid' | 'barcelona' | 'man-city' | 'liverpool' | 'arsenal' | 'bayern' | 'psg'

export interface Player {
  n: number
  name: string
  displayName: string
  pos: 'GK' | 'RB' | 'CB' | 'LB' | 'DM' | 'CM' | 'AM' | 'RW' | 'ST' | 'LW'
  role: string
  country: string
  foot: 'Right' | 'Left' | 'Both'
  height: string
  rating: number
  trait: string
}

export interface Club {
  id: ClubId
  name: string
  short: string
  nickname: string
  league: string
  primary: string
  secondary: string
  accent: string
  shorts: string
  socks: string
  textDark?: boolean
  stadium: string
  city: string
  manager: string
  founded: number
  kitNote: string
  kitPattern: 'plain' | 'stripes' | 'sleeves' | 'band' | 'sash'
  xi: Player[]
  bench: Player[]
}

export const CLUBS: Record<ClubId, Club> = {
  'real-madrid': {
    id: 'real-madrid',
    name: 'Real Madrid CF',
    short: 'RMA',
    nickname: 'Los Blancos',
    league: 'La Liga',
    primary: '#fbfbfb',
    secondary: '#111827',
    accent: '#d4af37',
    shorts: '#ffffff',
    socks: '#ffffff',
    textDark: true,
    stadium: 'Estadio Santiago Bernabéu',
    city: 'Madrid, Spain',
    manager: 'Carlo Ancelotti',
    founded: 1902,
    kitNote: 'All-white jersey with golden ochre trim and charcoal detailing',
    kitPattern: 'plain',
    xi: [
      { n: 1, name: 'Thibaut Courtois', displayName: 'COURTOIS', pos: 'GK', role: 'Goalkeeper', country: 'Belgium', foot: 'Left', height: '200 cm', rating: 89, trait: 'Elite reach & commanding aerial dominance' },
      { n: 2, name: 'Dani Carvajal', displayName: 'CARVAJAL', pos: 'RB', role: 'Right back', country: 'Spain', foot: 'Right', height: '173 cm', rating: 86, trait: 'Relentless overlaps & veteran aggression' },
      { n: 3, name: 'Éder Militão', displayName: 'MILITÃO', pos: 'CB', role: 'Centre back', country: 'Brazil', foot: 'Right', height: '186 cm', rating: 85, trait: 'Recovery sprint pace & vertical leap' },
      { n: 22, name: 'Antonio Rüdiger', displayName: 'RÜDIGER', pos: 'CB', role: 'Centre back', country: 'Germany', foot: 'Right', height: '190 cm', rating: 88, trait: 'Intimidating physical duels & long carries' },
      { n: 23, name: 'Ferland Mendy', displayName: 'MENDY', pos: 'LB', role: 'Left back', country: 'France', foot: 'Left', height: '180 cm', rating: 83, trait: 'Lockdown 1v1 defensive isolation' },
      { n: 14, name: 'Aurélien Tchouaméni', displayName: 'TCHOUAMÉNI', pos: 'DM', role: 'Defensive midfield', country: 'France', foot: 'Right', height: '187 cm', rating: 85, trait: 'Ball recovery engine & positional shield' },
      { n: 8, name: 'Federico Valverde', displayName: 'VALVERDE', pos: 'CM', role: 'Central midfield', country: 'Uruguay', foot: 'Right', height: '182 cm', rating: 88, trait: 'Box-to-box stamina & rocket long shots' },
      { n: 5, name: 'Jude Bellingham', displayName: 'BELLINGHAM', pos: 'AM', role: 'Attacking midfield', country: 'England', foot: 'Right', height: '186 cm', rating: 90, trait: 'Late box-crashing & clutch finishing' },
      { n: 11, name: 'Rodrygo Silva', displayName: 'RODRYGO', pos: 'RW', role: 'Right wing', country: 'Brazil', foot: 'Right', height: '174 cm', rating: 86, trait: 'Silky first touch & tight-space link-up' },
      { n: 9, name: 'Kylian Mbappé', displayName: 'MBAPPÉ', pos: 'ST', role: 'Striker', country: 'France', foot: 'Right', height: '178 cm', rating: 91, trait: 'Blistering acceleration & lethal near-post finish' },
      { n: 7, name: 'Vinícius Júnior', displayName: 'VINI JR.', pos: 'LW', role: 'Left wing', country: 'Brazil', foot: 'Right', height: '176 cm', rating: 90, trait: 'Explosive 1v1 dribbling & outside-boot trivela' },
    ],
    bench: [
      { n: 13, name: 'Andriy Lunin', displayName: 'LUNIN', pos: 'GK', role: 'Goalkeeper', country: 'Ukraine', foot: 'Right', height: '191 cm', rating: 81, trait: 'Reflex shot-stopping on line' },
      { n: 6, name: 'Eduardo Camavinga', displayName: 'CAMAVINGA', pos: 'CM', role: 'Central midfield', country: 'France', foot: 'Left', height: '182 cm', rating: 84, trait: 'Elastic dribbling & sliding tackles' },
      { n: 10, name: 'Luka Modrić', displayName: 'MODRIĆ', pos: 'CM', role: 'Central midfield', country: 'Croatia', foot: 'Right', height: '172 cm', rating: 86, trait: 'Playmaking vision & signature trivela passes' },
      { n: 15, name: 'Arda Güler', displayName: 'GÜLER', pos: 'AM', role: 'Attacking midfield', country: 'Turkey', foot: 'Left', height: '175 cm', rating: 78, trait: 'Deceptive feints & curler technique' },
      { n: 16, name: 'Endrick', displayName: 'ENDRICK', pos: 'ST', role: 'Striker', country: 'Brazil', foot: 'Left', height: '173 cm', rating: 77, trait: 'Raw power strikes & low centre of gravity' },
      { n: 21, name: 'Brahim Díaz', displayName: 'BRAHIM', pos: 'RW', role: 'Right wing', country: 'Morocco', foot: 'Both', height: '171 cm', rating: 82, trait: 'Ambidextrous slaloming runs' },
    ],
  },

  barcelona: {
    id: 'barcelona',
    name: 'FC Barcelona',
    short: 'BAR',
    nickname: 'Blaugrana',
    league: 'La Liga',
    primary: '#a50044',
    secondary: '#004d98',
    accent: '#edbb00',
    shorts: '#004d98',
    socks: '#a50044',
    stadium: 'Estadi Olímpic / Spotify Camp Nou',
    city: 'Barcelona, Spain',
    manager: 'Hansi Flick',
    founded: 1899,
    kitNote: 'Iconic Blaugrana vertical garnet and deep blue stripes',
    kitPattern: 'stripes',
    xi: [
      { n: 1, name: 'Marc-André ter Stegen', displayName: 'TER STEGEN', pos: 'GK', role: 'Goalkeeper', country: 'Germany', foot: 'Right', height: '187 cm', rating: 88, trait: 'Sweeper-keeper distribution & reactions' },
      { n: 23, name: 'Jules Koundé', displayName: 'KOUNDÉ', pos: 'RB', role: 'Right back', country: 'France', foot: 'Right', height: '180 cm', rating: 85, trait: 'Defensive tenacity & hybrid crossing' },
      { n: 2, name: 'Pau Cubarsí', displayName: 'CUBARSÍ', pos: 'CB', role: 'Centre back', country: 'Spain', foot: 'Right', height: '184 cm', rating: 81, trait: 'Laser line-breaking vertical passes' },
      { n: 5, name: 'Iñigo Martínez', displayName: 'I. MARTÍNEZ', pos: 'CB', role: 'Centre back', country: 'Spain', foot: 'Left', height: '182 cm', rating: 82, trait: 'Offside-trap leader & aerial presence' },
      { n: 3, name: 'Alejandro Balde', displayName: 'BALDE', pos: 'LB', role: 'Left back', country: 'Spain', foot: 'Left', height: '175 cm', rating: 82, trait: 'Electric flank sprint recovery' },
      { n: 17, name: 'Marc Casadó', displayName: 'CASADÓ', pos: 'DM', role: 'Defensive midfield', country: 'Spain', foot: 'Right', height: '172 cm', rating: 80, trait: 'High-press interception & rhythm tempo' },
      { n: 8, name: 'Pedri González', displayName: 'PEDRI', pos: 'CM', role: 'Central midfield', country: 'Spain', foot: 'Right', height: '174 cm', rating: 87, trait: 'Turn of pace & 360-degree spatial awareness' },
      { n: 20, name: 'Dani Olmo', displayName: 'OLMO', pos: 'AM', role: 'Attacking midfield', country: 'Spain', foot: 'Right', height: '179 cm', rating: 85, trait: 'Between-the-lines half-turn shots' },
      { n: 19, name: 'Lamine Yamal', displayName: 'L. YAMAL', pos: 'RW', role: 'Right wing', country: 'Spain', foot: 'Left', height: '180 cm', rating: 88, trait: 'Generational inside curlers & body feints' },
      { n: 9, name: 'Robert Lewandowski', displayName: 'LEWANDOWSKI', pos: 'ST', role: 'Striker', country: 'Poland', foot: 'Right', height: '185 cm', rating: 89, trait: 'World-class penalty-box positioning' },
      { n: 11, name: 'Raphinha Dias', displayName: 'RAPHINHA', pos: 'LW', role: 'Left wing', country: 'Brazil', foot: 'Left', height: '176 cm', rating: 87, trait: 'Counter-pressing energy & curling strikes' },
    ],
    bench: [
      { n: 13, name: 'Iñaki Peña', displayName: 'IÑAKI PEÑA', pos: 'GK', role: 'Goalkeeper', country: 'Spain', foot: 'Right', height: '184 cm', rating: 77, trait: 'Quick off-line claiming' },
      { n: 4, name: 'Ronald Araújo', displayName: 'ARAÚJO', pos: 'CB', role: 'Centre back', country: 'Uruguay', foot: 'Right', height: '188 cm', rating: 86, trait: 'Dominant aerial recovery & physical power' },
      { n: 6, name: 'Gavi Páez', displayName: 'GAVI', pos: 'CM', role: 'Central midfield', country: 'Spain', foot: 'Right', height: '173 cm', rating: 84, trait: 'Fearless duel winning & high press' },
      { n: 21, name: 'Frenkie de Jong', displayName: 'DE JONG', pos: 'CM', role: 'Central midfield', country: 'Netherlands', foot: 'Right', height: '180 cm', rating: 87, trait: 'Deep-lying progressive ball carries' },
      { n: 16, name: 'Fermín López', displayName: 'FERMÍN', pos: 'AM', role: 'Attacking midfield', country: 'Spain', foot: 'Right', height: '174 cm', rating: 80, trait: 'Direct vertical surges into penalty box' },
      { n: 7, name: 'Ferran Torres', displayName: 'FERRAN', pos: 'ST', role: 'Striker', country: 'Spain', foot: 'Right', height: '184 cm', rating: 81, trait: 'Blindside diagonal runs behind defence' },
    ],
  },

  'man-city': {
    id: 'man-city',
    name: 'Manchester City',
    short: 'MCI',
    nickname: 'Cityzens',
    league: 'Premier League',
    primary: '#6cabdd',
    secondary: '#ffffff',
    accent: '#1c2c5b',
    shorts: '#ffffff',
    socks: '#6cabdd',
    stadium: 'Etihad Stadium',
    city: 'Manchester, England',
    manager: 'Pep Guardiola',
    founded: 1894,
    kitNote: 'Sky blue jersey with white trim and navy crest accents',
    kitPattern: 'plain',
    xi: [
      { n: 31, name: 'Ederson Moraes', displayName: 'EDERSON', pos: 'GK', role: 'Goalkeeper', country: 'Brazil', foot: 'Left', height: '188 cm', rating: 88, trait: '70-metre pinpoint left-boot passes' },
      { n: 82, name: 'Rico Lewis', displayName: 'LEWIS', pos: 'RB', role: 'Right back', country: 'England', foot: 'Right', height: '169 cm', rating: 79, trait: 'Inverted midfield pivot progression' },
      { n: 25, name: 'Manuel Akanji', displayName: 'AKANJI', pos: 'CB', role: 'Centre back', country: 'Switzerland', foot: 'Right', height: '187 cm', rating: 84, trait: 'Tactical intelligence & multi-role poise' },
      { n: 3, name: 'Rúben Dias', displayName: 'RÚBEN', pos: 'CB', role: 'Centre back', country: 'Portugal', foot: 'Right', height: '187 cm', rating: 88, trait: 'Defensive general & last-ditch blocks' },
      { n: 24, name: 'Joško Gvardiol', displayName: 'GVARDIOL', pos: 'LB', role: 'Left back', country: 'Croatia', foot: 'Left', height: '185 cm', rating: 85, trait: 'Left-foot curled screamers & wide overlaps' },
      { n: 16, name: 'Rodri Cascante', displayName: 'RODRI', pos: 'DM', role: 'Defensive midfield', country: 'Spain', foot: 'Right', height: '191 cm', rating: 91, trait: 'Ballon dOr midfield control & match rhythm' },
      { n: 8, name: 'Mateo Kovačić', displayName: 'KOVAČIĆ', pos: 'CM', role: 'Central midfield', country: 'Croatia', foot: 'Right', height: '177 cm', rating: 83, trait: 'Press-resistant escape dribbling' },
      { n: 17, name: 'Kevin De Bruyne', displayName: 'DE BRUYNE', pos: 'AM', role: 'Attacking midfield', country: 'Belgium', foot: 'Right', height: '181 cm', rating: 90, trait: 'Telepathic passing arches & long-range power' },
      { n: 20, name: 'Bernardo Silva', displayName: 'BERNARDO', pos: 'RW', role: 'Right wing', country: 'Portugal', foot: 'Left', height: '173 cm', rating: 88, trait: 'Glue-like ball retention & tireless pressing' },
      { n: 9, name: 'Erling Haaland', displayName: 'HAALAND', pos: 'ST', role: 'Striker', country: 'Norway', foot: 'Left', height: '195 cm', rating: 91, trait: 'Acrobatic aerial reach & devastating finishing' },
      { n: 47, name: 'Phil Foden', displayName: 'FODEN', pos: 'LW', role: 'Left wing', country: 'England', foot: 'Left', height: '171 cm', rating: 88, trait: 'Sharp half-space turns & precision curlers' },
    ],
    bench: [
      { n: 18, name: 'Stefan Ortega', displayName: 'ORTEGA', pos: 'GK', role: 'Goalkeeper', country: 'Germany', foot: 'Right', height: '185 cm', rating: 80, trait: 'High-pressure 1v1 shot stopping' },
      { n: 2, name: 'Kyle Walker', displayName: 'WALKER', pos: 'RB', role: 'Right back', country: 'England', foot: 'Right', height: '183 cm', rating: 84, trait: 'Electrifying recovery speed against counters' },
      { n: 5, name: 'John Stones', displayName: 'STONES', pos: 'CB', role: 'Centre back', country: 'England', foot: 'Right', height: '188 cm', rating: 85, trait: 'Hybrid defender-to-midfielder playmaker' },
      { n: 27, name: 'Matheus Nunes', displayName: 'NUNES', pos: 'CM', role: 'Central midfield', country: 'Portugal', foot: 'Right', height: '183 cm', rating: 80, trait: 'Dynamic driving runs through transition' },
      { n: 26, name: 'Savinho', displayName: 'SAVINHO', pos: 'RW', role: 'Right wing', country: 'Brazil', foot: 'Left', height: '176 cm', rating: 82, trait: 'Unpredictable isolated wing take-ons' },
      { n: 10, name: 'Jack Grealish', displayName: 'GREALISH', pos: 'LW', role: 'Left wing', country: 'England', foot: 'Right', height: '175 cm', rating: 84, trait: 'Foul-drawing magnet & controlled tempo' },
    ],
  },

  liverpool: {
    id: 'liverpool',
    name: 'Liverpool FC',
    short: 'LIV',
    nickname: 'The Reds',
    league: 'Premier League',
    primary: '#c8102e',
    secondary: '#ffffff',
    accent: '#00b2a9',
    shorts: '#c8102e',
    socks: '#c8102e',
    stadium: 'Anfield',
    city: 'Liverpool, England',
    manager: 'Arne Slot',
    founded: 1892,
    kitNote: 'All-red home strip with teal and white collars',
    kitPattern: 'plain',
    xi: [
      { n: 1, name: 'Alisson Becker', displayName: 'ALISSON', pos: 'GK', role: 'Goalkeeper', country: 'Brazil', foot: 'Right', height: '193 cm', rating: 89, trait: 'Calculated 1v1 spread saves & rapid launches' },
      { n: 66, name: 'Trent Alexander-Arnold', displayName: 'TRENT', pos: 'RB', role: 'Right back', country: 'England', foot: 'Right', height: '175 cm', rating: 87, trait: 'Quarterback crossing & free-kick bend' },
      { n: 5, name: 'Ibrahima Konaté', displayName: 'KONATÉ', pos: 'CB', role: 'Centre back', country: 'France', foot: 'Right', height: '194 cm', rating: 84, trait: 'Overpowering strength & recovery slide tackles' },
      { n: 4, name: 'Virgil van Dijk', displayName: 'VAN DIJK', pos: 'CB', role: 'Centre back', country: 'Netherlands', foot: 'Right', height: '195 cm', rating: 89, trait: 'Aura of calm, aerial dominance & long diagonals' },
      { n: 26, name: 'Andrew Robertson', displayName: 'ROBERTSON', pos: 'LB', role: 'Left back', country: 'Scotland', foot: 'Left', height: '178 cm', rating: 84, trait: 'Aggressive touchline overlap deliveries' },
      { n: 38, name: 'Ryan Gravenberch', displayName: 'GRAVENBERCH', pos: 'DM', role: 'Defensive midfield', country: 'Netherlands', foot: 'Right', height: '190 cm', rating: 83, trait: 'Glide-through pivot & press-breaking stride' },
      { n: 10, name: 'Alexis Mac Allister', displayName: 'MAC ALLISTER', pos: 'CM', role: 'Central midfield', country: 'Argentina', foot: 'Right', height: '176 cm', rating: 86, trait: 'Tidy combinations & midfield tactical grit' },
      { n: 8, name: 'Dominik Szoboszlai', displayName: 'SZOBOSZLAI', pos: 'AM', role: 'Attacking midfield', country: 'Hungary', foot: 'Right', height: '186 cm', rating: 84, trait: 'Thunderous dipping shots & set-piece delivery' },
      { n: 11, name: 'Mohamed Salah', displayName: 'SALAH', pos: 'RW', role: 'Right wing', country: 'Egypt', foot: 'Left', height: '175 cm', rating: 89, trait: 'Egyptian King inside-cut finishes & incisive passes' },
      { n: 9, name: 'Darwin Núñez', displayName: 'DARWIN', pos: 'ST', role: 'Striker', country: 'Uruguay', foot: 'Right', height: '187 cm', rating: 83, trait: 'Chaos-inducing pace & direct channel runs' },
      { n: 7, name: 'Luis Díaz', displayName: 'LUIS DÍAZ', pos: 'LW', role: 'Left wing', country: 'Colombia', foot: 'Right', height: '178 cm', rating: 85, trait: 'Electric stepovers & far-post curlers' },
    ],
    bench: [
      { n: 62, name: 'Caoimhín Kelleher', displayName: 'KELLEHER', pos: 'GK', role: 'Goalkeeper', country: 'Ireland', foot: 'Right', height: '188 cm', rating: 80, trait: 'Cup penalty specialist & calm footwork' },
      { n: 2, name: 'Joe Gomez', displayName: 'GOMEZ', pos: 'CB', role: 'Centre back', country: 'England', foot: 'Right', height: '188 cm', rating: 80, trait: 'Versatile defensive cover across backline' },
      { n: 17, name: 'Curtis Jones', displayName: 'JONES', pos: 'CM', role: 'Central midfield', country: 'England', foot: 'Right', height: '185 cm', rating: 81, trait: 'Tight ball protection & late surges' },
      { n: 18, name: 'Cody Gakpo', displayName: 'GAKPO', pos: 'LW', role: 'Left wing', country: 'Netherlands', foot: 'Right', height: '193 cm', rating: 83, trait: 'Cutting in from left with heavy low strikes' },
      { n: 20, name: 'Diogo Jota', displayName: 'JOTA', pos: 'ST', role: 'Striker', country: 'Portugal', foot: 'Right', height: '178 cm', rating: 85, trait: 'Ruthless box poacher & heading accuracy' },
      { n: 84, name: 'Conor Bradley', displayName: 'BRADLEY', pos: 'RB', role: 'Right back', country: 'Northern Ireland', foot: 'Right', height: '180 cm', rating: 78, trait: 'Fearless forward overlapping drives' },
    ],
  },

  arsenal: {
    id: 'arsenal',
    name: 'Arsenal FC',
    short: 'ARS',
    nickname: 'The Gunners',
    league: 'Premier League',
    primary: '#db0007',
    secondary: '#ffffff',
    accent: '#9c824a',
    shorts: '#ffffff',
    socks: '#db0007',
    stadium: 'Emirates Stadium',
    city: 'London, England',
    manager: 'Mikel Arteta',
    founded: 1886,
    kitNote: 'Classic Highbury red body with pristine white sleeves',
    kitPattern: 'sleeves',
    xi: [
      { n: 22, name: 'David Raya', displayName: 'RAYA', pos: 'GK', role: 'Goalkeeper', country: 'Spain', foot: 'Right', height: '183 cm', rating: 85, trait: 'Golden Glove cross-claiming & brave sweeps' },
      { n: 4, name: 'Ben White', displayName: 'WHITE', pos: 'RB', role: 'Right back', country: 'England', foot: 'Right', height: '186 cm', rating: 84, trait: 'Underlapping synergy & psychological edge' },
      { n: 2, name: 'William Saliba', displayName: 'SALIBA', pos: 'CB', role: 'Centre back', country: 'France', foot: 'Right', height: '192 cm', rating: 88, trait: 'Immaculate positioning & zero-foul tackling' },
      { n: 6, name: 'Gabriel Magalhães', displayName: 'GABRIEL', pos: 'CB', role: 'Centre back', country: 'Brazil', foot: 'Left', height: '190 cm', rating: 86, trait: 'Corner-kick aerial bullet headers' },
      { n: 12, name: 'Jurriën Timber', displayName: 'TIMBER', pos: 'LB', role: 'Left back', country: 'Netherlands', foot: 'Right', height: '179 cm', rating: 82, trait: 'Tenacious aggressive duels & inverted play' },
      { n: 5, name: 'Thomas Partey', displayName: 'PARTEY', pos: 'DM', role: 'Defensive midfield', country: 'Ghana', foot: 'Right', height: '185 cm', rating: 83, trait: 'Line-breaking swivel turns in deep build-up' },
      { n: 41, name: 'Declan Rice', displayName: 'RICE', pos: 'CM', role: 'Central midfield', country: 'England', foot: 'Right', height: '188 cm', rating: 88, trait: 'Incredible ground coverage & set-piece whipped balls' },
      { n: 8, name: 'Martin Ødegaard', displayName: 'ØDEGAARD', pos: 'AM', role: 'Attacking midfield', country: 'Norway', foot: 'Left', height: '178 cm', rating: 89, trait: 'Maestro disguised through-balls & pressing captain' },
      { n: 7, name: 'Bukayo Saka', displayName: 'SAKA', pos: 'RW', role: 'Right wing', country: 'England', foot: 'Left', height: '178 cm', rating: 88, trait: 'Starboy cut-inside curlers & pinpoint deliveries' },
      { n: 29, name: 'Kai Havertz', displayName: 'HAVERTZ', pos: 'ST', role: 'Striker', country: 'Germany', foot: 'Left', height: '193 cm', rating: 84, trait: 'Tactical target man, duel winner & space finder' },
      { n: 11, name: 'Gabriel Martinelli', displayName: 'MARTINELLI', pos: 'LW', role: 'Left wing', country: 'Brazil', foot: 'Right', height: '178 cm', rating: 84, trait: 'Pure direct sprint speed & relentless tracking' },
    ],
    bench: [
      { n: 32, name: 'Neto Murara', displayName: 'NETO', pos: 'GK', role: 'Goalkeeper', country: 'Brazil', foot: 'Right', height: '190 cm', rating: 78, trait: 'Veteran shot stopping presence' },
      { n: 33, name: 'Riccardo Calafiori', displayName: 'CALAFIORI', pos: 'CB', role: 'Centre back', country: 'Italy', foot: 'Left', height: '188 cm', rating: 83, trait: 'Gliding ball-carrying defender with venom strike' },
      { n: 17, name: 'Oleksandr Zinchenko', displayName: 'ZINCHENKO', pos: 'LB', role: 'Left back', country: 'Ukraine', foot: 'Left', height: '175 cm', rating: 81, trait: 'Inverted playmaking technician' },
      { n: 23, name: 'Mikel Merino', displayName: 'MERINO', pos: 'CM', role: 'Central midfield', country: 'Spain', foot: 'Left', height: '188 cm', rating: 84, trait: 'European champion duel monster & box arrival' },
      { n: 19, name: 'Leandro Trossard', displayName: 'TROSSARD', pos: 'LW', role: 'Left wing', country: 'Belgium', foot: 'Right', height: '172 cm', rating: 83, trait: 'Two-footed laser finishing in high pressure' },
      { n: 9, name: 'Gabriel Jesus', displayName: 'JESUS', pos: 'ST', role: 'Striker', country: 'Brazil', foot: 'Right', height: '175 cm', rating: 82, trait: 'Dazzling samba dribbling & link-up play' },
    ],
  },

  bayern: {
    id: 'bayern',
    name: 'FC Bayern München',
    short: 'BAY',
    nickname: 'Die Roten',
    league: 'Bundesliga',
    primary: '#dc052d',
    secondary: '#ffffff',
    accent: '#0066b2',
    shorts: '#dc052d',
    socks: '#dc052d',
    stadium: 'Allianz Arena',
    city: 'Munich, Germany',
    manager: 'Vincent Kompany',
    founded: 1900,
    kitNote: 'Bavarian red with crisp white and diamond accents',
    kitPattern: 'plain',
    xi: [
      { n: 1, name: 'Manuel Neuer', displayName: 'NEUER', pos: 'GK', role: 'Goalkeeper', country: 'Germany', foot: 'Right', height: '193 cm', rating: 87, trait: 'The archetype sweeper-keeper & historic presence' },
      { n: 27, name: 'Konrad Laimer', displayName: 'LAIMER', pos: 'RB', role: 'Right back', country: 'Austria', foot: 'Right', height: '180 cm', rating: 81, trait: 'High-octane pressing terrier & overlap lung power' },
      { n: 2, name: 'Dayot Upamecano', displayName: 'UPAMECANO', pos: 'CB', role: 'Centre back', country: 'France', foot: 'Right', height: '186 cm', rating: 84, trait: 'Explosive forward recovery bursts & physical wall' },
      { n: 3, name: 'Kim Min-jae', displayName: 'KIM', pos: 'CB', role: 'Centre back', country: 'South Korea', foot: 'Right', height: '190 cm', rating: 84, trait: 'Aggressive step-up interceptions & aerial control' },
      { n: 19, name: 'Alphonso Davies', displayName: 'DAVIES', pos: 'LB', role: 'Left back', country: 'Canada', foot: 'Left', height: '185 cm', rating: 85, trait: 'Roadrunner 36.5 km/h sprint velocity' },
      { n: 6, name: 'Joshua Kimmich', displayName: 'KIMMICH', pos: 'DM', role: 'Defensive midfield', country: 'Germany', foot: 'Right', height: '177 cm', rating: 88, trait: 'Surgical chipped passes & tactical metronome' },
      { n: 45, name: 'Aleksandar Pavlović', displayName: 'PAVLOVIĆ', pos: 'CM', role: 'Central midfield', country: 'Germany', foot: 'Right', height: '186 cm', rating: 81, trait: 'Bavarian academy prodigy, smooth distribution' },
      { n: 42, name: 'Jamal Musiala', displayName: 'MUSIALA', pos: 'AM', role: 'Attacking midfield', country: 'Germany', foot: 'Right', height: '184 cm', rating: 89, trait: 'Snake-like balance & slaloming slalom dribbling' },
      { n: 17, name: 'Michael Olise', displayName: 'OLISE', pos: 'RW', role: 'Right wing', country: 'France', foot: 'Left', height: '184 cm', rating: 85, trait: 'Effortless wand of a left foot & disguised whipped crosses' },
      { n: 9, name: 'Harry Kane', displayName: 'KANE', pos: 'ST', role: 'Striker', country: 'England', foot: 'Right', height: '188 cm', rating: 90, trait: 'World-class drop-deep playmaker & clinical finisher' },
      { n: 7, name: 'Serge Gnabry', displayName: 'GNABRY', pos: 'LW', role: 'Left wing', country: 'Germany', foot: 'Right', height: '176 cm', rating: 83, trait: 'Diagonal burst into half spaces & fierce strikes' },
    ],
    bench: [
      { n: 26, name: 'Sven Ulreich', displayName: 'ULREICH', pos: 'GK', role: 'Goalkeeper', country: 'Germany', foot: 'Right', height: '192 cm', rating: 76, trait: 'Dependable backup guardian' },
      { n: 22, name: 'Raphaël Guerreiro', displayName: 'GUERREIRO', pos: 'LB', role: 'Left back', country: 'Portugal', foot: 'Left', height: '170 cm', rating: 82, trait: 'Playmaking inverted technician' },
      { n: 16, name: 'João Palhinha', displayName: 'PALHINHA', pos: 'DM', role: 'Defensive midfield', country: 'Portugal', foot: 'Right', height: '190 cm', rating: 85, trait: 'European premier tackle-winning specialist' },
      { n: 25, name: 'Thomas Müller', displayName: 'MÜLLER', pos: 'AM', role: 'Attacking midfield', country: 'Germany', foot: 'Right', height: '185 cm', rating: 84, trait: 'The original Raumdeuter: master of space' },
      { n: 10, name: 'Leroy Sané', displayName: 'SANÉ', pos: 'RW', role: 'Right wing', country: 'Germany', foot: 'Left', height: '183 cm', rating: 85, trait: 'Devastating speed transition & dipping long shots' },
      { n: 11, name: 'Kingsley Coman', displayName: 'COMAN', pos: 'LW', role: 'Left wing', country: 'France', foot: 'Right', height: '180 cm', rating: 84, trait: 'Championship-winning 1v1 winger' },
    ],
  },

  psg: {
    id: 'psg',
    name: 'Paris Saint-Germain',
    short: 'PSG',
    nickname: 'Les Parisiens',
    league: 'Ligue 1',
    primary: '#004170',
    secondary: '#da291c',
    accent: '#ffffff',
    shorts: '#004170',
    socks: '#004170',
    stadium: 'Parc des Princes',
    city: 'Paris, France',
    manager: 'Luis Enrique',
    founded: 1970,
    kitNote: 'Midnight navy jersey with central red and white Hechter band',
    kitPattern: 'band',
    xi: [
      { n: 1, name: 'Gianluigi Donnarumma', displayName: 'DONNARUMMA', pos: 'GK', role: 'Goalkeeper', country: 'Italy', foot: 'Right', height: '196 cm', rating: 88, trait: 'Colossal frame & point-blank reaction stops' },
      { n: 2, name: 'Achraf Hakimi', displayName: 'HAKIMI', pos: 'RB', role: 'Right back', country: 'Morocco', foot: 'Right', height: '181 cm', rating: 86, trait: 'Flying wing-back speed & attacking goals' },
      { n: 5, name: 'Marquinhos Corrêa', displayName: 'MARQUINHOS', pos: 'CB', role: 'Centre back', country: 'Brazil', foot: 'Right', height: '183 cm', rating: 87, trait: 'Captain & read-the-game anticipation' },
      { n: 51, name: 'Willian Pacho', displayName: 'PACHO', pos: 'CB', role: 'Centre back', country: 'Ecuador', foot: 'Left', height: '187 cm', rating: 82, trait: 'Aggressive front-foot defending & strength' },
      { n: 25, name: 'Nuno Mendes', displayName: 'NUNO MENDES', pos: 'LB', role: 'Left back', country: 'Portugal', foot: 'Left', height: '176 cm', rating: 84, trait: 'Blistering acceleration & whipped low crosses' },
      { n: 17, name: 'Vitinha Ferreira', displayName: 'VITINHA', pos: 'DM', role: 'Defensive midfield', country: 'Portugal', foot: 'Right', height: '172 cm', rating: 86, trait: 'Tempo control, quick pirouettes & press evasion' },
      { n: 87, name: 'João Neves', displayName: 'JOÃO NEVES', pos: 'CM', role: 'Central midfield', country: 'Portugal', foot: 'Right', height: '174 cm', rating: 83, trait: 'Tenacious box-to-box engine & visionary assist creator' },
      { n: 33, name: 'Warren Zaïre-Emery', displayName: 'ZAÏRE-EMERY', pos: 'AM', role: 'Attacking midfield', country: 'France', foot: 'Right', height: '178 cm', rating: 82, trait: 'Teenage powerhouse driving through challenges' },
      { n: 10, name: 'Ousmane Dembélé', displayName: 'DEMBÉLÉ', pos: 'RW', role: 'Right wing', country: 'France', foot: 'Both', height: '178 cm', rating: 86, trait: 'Two-footed ambidextrous chance creator' },
      { n: 9, name: 'Gonçalo Ramos', displayName: 'RAMOS', pos: 'ST', role: 'Striker', country: 'Portugal', foot: 'Right', height: '185 cm', rating: 82, trait: 'Aggressive pressing frontman & first-time strikes' },
      { n: 29, name: 'Bradley Barcola', displayName: 'BARCOLA', pos: 'LW', role: 'Left wing', country: 'France', foot: 'Right', height: '186 cm', rating: 83, trait: 'Silky progressive carries & Thierry Henry style curlers' },
    ],
    bench: [
      { n: 39, name: 'Matvey Safonov', displayName: 'SAFONOV', pos: 'GK', role: 'Goalkeeper', country: 'Russia', foot: 'Right', height: '192 cm', rating: 79, trait: 'Solid aerial collection & reflexes' },
      { n: 35, name: 'Lucas Beraldo', displayName: 'BERALDO', pos: 'CB', role: 'Centre back', country: 'Brazil', foot: 'Left', height: '186 cm', rating: 79, trait: 'Sleek ball-playing Brazilian defender' },
      { n: 8, name: 'Fabián Ruiz', displayName: 'FABIÁN', pos: 'CM', role: 'Central midfield', country: 'Spain', foot: 'Left', height: '189 cm', rating: 83, trait: 'Euro 2024 star with gliding long shots' },
      { n: 19, name: 'Lee Kang-in', displayName: 'LEE', pos: 'RW', role: 'Right wing', country: 'South Korea', foot: 'Left', height: '173 cm', rating: 81, trait: 'Low centre-of-gravity left foot master' },
      { n: 11, name: 'Marco Asensio', displayName: 'ASENSIO', pos: 'AM', role: 'Attacking midfield', country: 'Spain', foot: 'Left', height: '182 cm', rating: 81, trait: 'Thunderous dipping curlers from distance' },
      { n: 23, name: 'Randal Kolo Muani', displayName: 'KOLO MUANI', pos: 'ST', role: 'Striker', country: 'France', foot: 'Right', height: '187 cm', rating: 81, trait: 'Powerful direct running in transition' },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* Tactics board data: Pitch units are metres (105 x 68).             */
/* Team attacks left-to-right (x = 0 to 105).                         */
/* ------------------------------------------------------------------ */

export type Pt = [number, number]

export const FORMATIONS: Record<string, { label: string; desc: string; pts: Pt[] }> = {
  '4-3-3': {
    label: '4-3-3 Attacking',
    desc: 'High wingers, single pivot, and dynamic number 8s for maximum width and counter-pressing.',
    pts: [[7, 34], [30, 58], [25, 43], [25, 25], [30, 10], [42, 34], [56, 46], [56, 22], [80, 58], [88, 34], [80, 10]],
  },
  '4-2-3-1': {
    label: '4-2-3-1 Modern',
    desc: 'Double pivot platform with an advanced playmaker behind a dynamic lone striker.',
    pts: [[7, 34], [30, 58], [25, 43], [25, 25], [30, 10], [40, 44], [40, 24], [62, 34], [74, 58], [89, 34], [74, 10]],
  },
  '3-5-2': {
    label: '3-5-2 Wing-Back',
    desc: 'Three physical centre backs with lung-busting wingbacks and a complementary striker duo.',
    pts: [[7, 34], [54, 62], [26, 46], [26, 22], [54, 6], [28, 34], [48, 46], [48, 22], [60, 34], [86, 26], [86, 42]],
  },
}

/** Ghosted opposition team on the tactics board. */
export const OPPOSITION: Pt[] = [
  [98, 34], [80, 10], [82, 27], [82, 41], [80, 58], [64, 12], [64, 28], [64, 40], [64, 56], [48, 26], [48, 42],
]

export interface Play {
  id: string
  name: string
  blurb: string
  duration: number
  /** Waypoints per player slot: [time s, dx, dy] relative to starting spot */
  runs: Record<number, [number, number, number][]>
  /** Ball moves: from player -> to player (-1 means target goal) */
  passes: { from: number; to: number; at: number; flight: number; arc: number; target?: Pt }[]
}

export const PLAYS: Play[] = [
  {
    id: 'overlap',
    name: 'Overlapping Full-Back Cross',
    blurb: 'Left back bursts outside the inverted winger, receives the layoff, and whips a driven cross to the far post.',
    duration: 6.2,
    runs: {
      4: [[0, 0, 0], [1.4, 0, 0], [3.4, 34, -3], [4.2, 38, -3]],
      10: [[0, 0, 0], [1.6, 0, 0], [3.0, 8, 9]],
      9: [[0, 0, 0], [2.4, -3, 2], [4.4, 5, -1], [5.2, 9, 3]],
      7: [[0, 0, 0], [3.2, -6, -6]],
      8: [[0, 0, 0], [4.0, 12, -10], [5.0, 16, -12]],
      5: [[0, 0, 0], [2, 4, 0]],
    },
    passes: [
      { from: 3, to: 5, at: 0.3, flight: 0.7, arc: 0.4 },
      { from: 5, to: 10, at: 1.3, flight: 0.9, arc: 0.6 },
      { from: 10, to: 4, at: 3.15, flight: 0.7, arc: 0.3 },
      { from: 4, to: 9, at: 4.25, flight: 0.95, arc: 3.2 },
      { from: 9, to: -1, at: 5.3, flight: 0.55, arc: 0.8, target: [105, 31.5] },
    ],
  },
  {
    id: 'through',
    name: 'Surgical Inside Through-Ball',
    blurb: 'Attacking midfielder drops deep to draw the centre-back, turning to thread a diagonal ball behind the defence.',
    duration: 5.4,
    runs: {
      9: [[0, 0, 0], [1.5, -5, 2], [2.6, 4, 0], [3.6, 17, -3]],
      7: [[0, 0, 0], [3.2, 17, -2]],
      8: [[0, 0, 0], [3.2, 19, 4]],
      10: [[0, 0, 0], [2, -7, 0]],
      6: [[0, 0, 0], [3, 6, 0]],
    },
    passes: [
      { from: 5, to: 7, at: 0.2, flight: 0.7, arc: 0.3 },
      { from: 7, to: 10, at: 1.3, flight: 0.7, arc: 0.2 },
      { from: 10, to: 9, at: 2.5, flight: 1.1, arc: 0.7 },
      { from: 9, to: -1, at: 4.2, flight: 0.55, arc: 0.4, target: [105, 36.2] },
    ],
  },
  {
    id: 'counter',
    name: 'Rapid Transition Counter-Attack',
    blurb: 'Keeper collects and launches quickly to the winger, triggering an explosive three-man sprint into the box.',
    duration: 6.0,
    runs: {
      8: [[0, 0, 0], [2.0, 12, -3], [3.6, 18, -3]],
      9: [[0, 0, 0], [3.2, 12, 0], [4.4, 16, 2]],
      10: [[0, 0, 0], [3.4, 26, 6]],
      7: [[0, 0, 0], [3.4, 24, -3]],
      5: [[0, 0, 0], [3.2, 14, 0]],
    },
    passes: [
      { from: 0, to: 8, at: 0.3, flight: 1.5, arc: 7 },
      { from: 8, to: 7, at: 2.0, flight: 0.8, arc: 0.4 },
      { from: 7, to: 9, at: 3.2, flight: 0.8, arc: 0.3 },
      { from: 9, to: -1, at: 4.5, flight: 0.5, arc: 0.4, target: [105, 30.8] },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Matchday event timeline (Real Madrid vs Barcelona El Clásico)      */
/* ------------------------------------------------------------------ */

export interface MatchEvent {
  min: number
  club: ClubId
  kind: 'goal' | 'yellow' | 'ht' | 'ft'
  player?: string
  note?: string
}

export const MATCH_EVENTS: MatchEvent[] = [
  { min: 14, club: 'real-madrid', kind: 'goal', player: 'Vinícius Júnior', note: 'Assist: Jude Bellingham trivela' },
  { min: 28, club: 'barcelona', kind: 'yellow', player: 'Marc Casadó', note: 'Tactical foul breaking counter' },
  { min: 38, club: 'barcelona', kind: 'goal', player: 'Robert Lewandowski', note: 'Header from Lamine Yamal cross' },
  { min: 45, club: 'real-madrid', kind: 'ht', note: 'Half time in El Clásico' },
  { min: 56, club: 'real-madrid', kind: 'goal', player: 'Kylian Mbappé', note: 'Near-post rocket finish' },
  { min: 67, club: 'barcelona', kind: 'goal', player: 'Raphinha Dias', note: 'Curled rebound into top corner' },
  { min: 78, club: 'real-madrid', kind: 'yellow', player: 'Eduardo Camavinga', note: 'Late sliding interception' },
  { min: 89, club: 'real-madrid', kind: 'goal', player: 'Jude Bellingham', note: 'Stoppage-time winner from close range' },
  { min: 90, club: 'real-madrid', kind: 'ft', note: 'Full time: Santiago Bernabéu roars' },
]

export const MATCH = {
  competition: 'Footonomy Showcase',
  round: 'El Clásico Showpiece',
  venue: 'Santiago Bernabéu',
  capacity: '84,744',
  date: 'Matchday Spotlight',
  kickoff: '21:00 CET',
  home: 'real-madrid' as ClubId,
  away: 'barcelona' as ClubId,
}

/** A club accent that stays readable as text on the dark Footonomy panels (AA, 4.5:1). Dark kit colours are lifted toward white. */
export function legibleAccent(hex: string): string {
  const h = hex.replace('#', '')
  const base = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  const lum = (c: number[]) => {
    const f = (v: number) => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
  }
  const bg = lum([8, 19, 13]) // --bg-2
  for (let t = 0; t <= 1; t += 0.05) {
    const c = base.map((v) => Math.round(v + (255 - v) * t))
    if ((lum(c) + 0.05) / (bg + 0.05) >= 4.5) return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
  }
  return '#ffffff'
}
