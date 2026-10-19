export { EMAIL, LINKEDIN, LINKEDIN_LABEL, MAILTO, EMAIL_HREF } from '../shared/contact'

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const

export const CREDIBILITY = [
  {
    k: '61K',
    text: 'follower football media brand, run solo since December 2023.',
  },
  {
    k: 'EOM',
    text: 'Employee of the Month at Veefin Solutions Ltd, January 2026.',
  },
  {
    k: '8/60',
    text: 'Final 8 of 60 at Ignite IT 8.0, with an emergency SOS app.',
  },
  {
    k: '₹2.5L',
    text: 'Sponsorships raised for Spectrum, about ₹2.25-2.5L, with an 80+ member committee.',
  },
] as const

export type Shot = {
  src: string
  w: number
  h: number
  alt: string
}

export type CaseRow = {
  href: string
  name: string
  /** One line: what it is. */
  what: string
  /** One outcome: a number or a fact. */
  figure: string
  figureLabel: string
  /** Best-effort period. Confirm with Kahaan before launch. */
  year: string
  status: string
  /** Real screenshot for the hover preview; rows without one get a drawn panel. */
  shot?: Shot
  /** Colour of the drawn panel when there is no screenshot. */
  tint: string
}

/** Real case studies, best proof first. */
export const CASES: CaseRow[] = [
  {
    href: '/work/flippr-app',
    name: 'Flippr app',
    what: 'A B2C cricket platform: live scoring, tournaments, auctions and invites on a microservice backend. I own the architecture and backend design.',
    figure: '7',
    figureLabel: 'backend services behind one gateway',
    year: '2026',
    status: 'In development',
    tint: '#1f3fb5',
    shot: {
      src: '/work/flippr-app/screen-live-scoring.webp',
      w: 443,
      h: 960,
      alt: 'Flippr live scoring screen with the score, batters, bowler and a one-handed scoring pad.',
    },
  },
  {
    href: '/work/auction-flippr-live',
    name: 'auction.flippr.live',
    what: 'Live cricket player auctions: operator desk, captain phones, hall stage and a broadcast overlay on the same lot.',
    figure: '4',
    figureLabel: 'screens kept in step in real time',
    year: '2026',
    status: 'Live',
    tint: '#8a5a00',
    shot: {
      src: '/work/auction/stage-desktop.webp',
      w: 1440,
      h: 900,
      alt: 'Auction stage screen: the player on the block, current bid and team boards for a live cricket auction.',
    },
  },
  {
    href: '/work/flippr-live',
    name: 'flippr.live',
    what: 'The marketing site for the Flippr app, and the host that opens match and invite links in the app.',
    figure: '2',
    figureLabel: 'app stores, one page',
    year: '2026',
    status: 'Live',
    tint: '#2447d6',
  },
  {
    href: '/work/madridonomy-store',
    name: 'Madridonomy Store',
    what: 'A custom Shopify theme for the Madridonomy football-streetwear store: collections, size picker, cart drawer and locales, in Liquid.',
    figure: '16',
    figureLabel: 'hand-written Liquid sections, no starter theme',
    year: '2025',
    status: 'Live',
    tint: '#e8300a',
    shot: {
      src: '/work/madridonomy-store/desktop-product.webp',
      w: 1440,
      h: 900,
      alt: 'Madridonomy Store product page: a black oversized tee, size buttons, price and an Add to Cart button.',
    },
  },
  {
    href: '/work/madridonomy',
    name: 'madridonomy.com',
    what: 'Real Madrid news, stats and daily games, with an admin CMS and an AI article pipeline. Founded and built solo.',
    figure: '61K+',
    figureLabel: 'followers on the brand behind it',
    year: '2023-now',
    status: 'Live',
    tint: '#8d1d2c',
  },
  {
    href: '/work/footonomy',
    name: 'Footonomy',
    what: 'A football companion web app: live scores, match centre, standings and a following feed. Built with a team of three.',
    figure: '5',
    figureLabel: 'daily games inside the app',
    year: '2025',
    status: 'College project',
    tint: '#5a34b8',
    shot: {
      src: '/work/footonomy/matches-feed.webp',
      w: 1232,
      h: 770,
      alt: 'Footonomy matches feed with live and upcoming fixtures grouped by league.',
    },
  },
  {
    href: '/work/content-studio',
    name: 'Content Studio',
    what: 'A private content tool for Madridonomy: topic discovery, articles, carousels, video engines and Genjutsu, with every cost tracked.',
    figure: '520+',
    figureLabel: 'automated backend tests',
    year: '2026',
    status: 'Private tool',
    tint: '#0f6b4f',
  },
  {
    href: '/work/chatspace',
    name: 'ChatSpace',
    what: 'Real-time team chat with rooms, presence, in-chat tasks and an AI helper. A college full-stack project.',
    figure: '26',
    figureLabel: 'automated server tests',
    year: '2025',
    status: 'College project',
    tint: '#3d4fd8',
  },
]

export type ConceptKey = 'footonomy' | 'autos' | 'architecture' | 'fintech'

export type Concept = {
  key: ConceptKey
  href: string
  name: string
  line: string
  note: string
}

/** Fictional or unofficial builds. Never client work. */
export const CONCEPTS: Concept[] = [
  {
    key: 'footonomy',
    href: '/concepts/footonomy',
    name: 'Footonomy',
    line: '3D players, a stadium fly-through, a kick game and a tactics board.',
    note: 'What the app could be. Unofficial.',
  },
  {
    key: 'autos',
    href: '/concepts/autos',
    name: 'Strada Motors',
    line: 'A multi-brand showroom with a 3D configurator and exploded view.',
    note: 'Not affiliated with any car maker.',
  },
  {
    key: 'architecture',
    href: '/concepts/architecture',
    name: 'Aldermoor Studio',
    line: 'An architecture studio site built around daylight and a sun study.',
    note: 'Fictional studio.',
  },
  {
    key: 'fintech',
    href: '/concepts/fintech',
    name: 'Pollen',
    line: 'A money app for freelancers and creators: multi-currency accounts, payment links, instant payouts and a tax pot.',
    note: 'Fictional product.',
  },
]

export const SERVICES = [
  {
    name: 'Websites',
    text: 'Marketing and content sites, built to load fast and read well on a phone.',
  },
  {
    name: 'Web apps',
    text: 'Operator tools, dashboards, live rooms and admin consoles. Real-time when it needs to be, boring and reliable when it does not.',
  },
  {
    name: 'Mobile apps',
    text: 'Cross-platform apps with a backend that is designed as part of the same build, not bolted on later.',
  },
  {
    name: 'AI content tools',
    text: 'Pipelines that draft, cluster and produce. A person still approves. Built for operators who cannot sit in the feed all day.',
  },
] as const

export const STACK = [
  {
    name: 'Interface',
    items: ['React', 'TypeScript', 'Vite', 'Flutter', 'HTMX', 'Alpine.js'],
  },
  {
    name: 'Servers',
    items: ['Spring Boot', 'Node', 'Express', 'Flask', 'FastAPI'],
  },
  {
    name: 'Data',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Neon'],
  },
  {
    name: 'Realtime',
    items: ['STOMP', 'Socket.io', 'WebSockets', 'Firebase Messaging'],
  },
  {
    name: '3D',
    items: ['three.js', 'react-three-fiber'],
  },
  {
    name: 'Ship',
    items: ['Docker', 'AWS EC2', 'Vercel'],
  },
] as const
