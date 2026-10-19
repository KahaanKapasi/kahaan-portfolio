export type BrandId = 'lamborghini' | 'porsche' | 'bmw'

export type ModelId = 'revuelto' | 'huracan-sto' | '911-gt3' | 'taycan-turbo' | 'm4-csl' | 'i5-m60'

export type AngleId = 'front' | 'rear'

export const ASSET_BASE = '/concepts/autos'

export interface PaintOption {
  id: string
  name: string
  hex: string
  finish: 'Solid' | 'Metallic' | 'Pearl'
  /** Indicative option price in USD. 0 means included. */
  price: number
  /** The colour the car was photographed in. Every other paint is an AI-edited variant of it. */
  base?: boolean
  /** Angles that have an image for this paint. */
  angles: AngleId[]
}

export interface WheelOption {
  id: string
  name: string
  note: string
  price: number
  base?: boolean
}

export interface Hotspot {
  id: string
  label: string
  /** Position on the front photograph, in percent. */
  x: number
  y: number
  text: string
}

export interface GalleryShot {
  /** Photo file name without extension, inside photos/<model>/. */
  file: string
  caption: string
}

export interface CarModel {
  id: ModelId
  brand: BrandId
  name: string
  tagline: string
  summary: string
  specs: { power: string; torque: string; zeroToSixty: string; topSpeed: string; drivetrain: string; engine: string }
  basePrice: number
  paints: PaintOption[]
  wheels: WheelOption[]
  /** Angles that exist as real photographs of the configurable car. */
  angles: AngleId[]
  gallery: GalleryShot[]
  hotspots: Hotspot[]
  /** CSS object-position for the hero crop on narrow screens. */
  focus: string
}

export interface Brand {
  id: BrandId
  name: string
  /** Brand colour for swatches and rules. */
  accent: string
  /** Lightened variant used for text on dark grounds (at least 4.5:1 on the card and page grounds). */
  accentText: string
  town: string
  models: ModelId[]
  /** Car shown on the brand card. */
  lead: ModelId
}

export const BRANDS: Record<BrandId, Brand> = {
  lamborghini: {
    id: 'lamborghini',
    name: 'Lamborghini',
    accent: '#c4a035',
    accentText: '#e8c75f',
    town: 'Sant’Agata Bolognese',
    models: ['revuelto', 'huracan-sto'],
    lead: 'revuelto',
  },
  porsche: {
    id: 'porsche',
    name: 'Porsche',
    accent: '#b12b2b',
    accentText: '#ff8a8a',
    town: 'Stuttgart-Zuffenhausen',
    models: ['911-gt3', 'taycan-turbo'],
    lead: 'taycan-turbo',
  },
  bmw: {
    id: 'bmw',
    name: 'BMW',
    accent: '#1c6ed5',
    accentText: '#86b8ff',
    town: 'Munich',
    models: ['m4-csl', 'i5-m60'],
    lead: 'm4-csl',
  },
}

export const BRAND_IDS = Object.keys(BRANDS) as BrandId[]

const lambo = { solid: 5400, special: 9000, wheel: 6200 }
const porsche = { solid: 0, special: 3310, wheel: 3900 }
const bmw = { solid: 0, special: 1950, wheel: 2400 }

export const MODELS: Record<ModelId, CarModel> = {
  revuelto: {
    id: 'revuelto',
    brand: 'lamborghini',
    name: 'Revuelto',
    tagline: 'V12 hybrid, three electric motors, one low wedge.',
    summary:
      'The first Lamborghini V12 plug-in hybrid. A mid-mounted 6.5-litre engine, three electric motors and a cab-forward cabin that sits right at the front axle.',
    specs: {
      power: '1,001 hp',
      torque: '793 lb-ft',
      zeroToSixty: '2.5 s',
      topSpeed: '217 mph',
      drivetrain: 'AWD',
      engine: '6.5L V12 + 3 motors',
    },
    basePrice: 608358,
    paints: [
      { id: 'arancio', name: 'Arancio Atlas', hex: '#e8570f', finish: 'Solid', price: 0, base: true, angles: ['front', 'rear'] },
      { id: 'blu-cepheus', name: 'Blu Cepheus', hex: '#1f3d78', finish: 'Pearl', price: lambo.special, angles: ['front', 'rear'] },
      { id: 'verde-mantis', name: 'Verde Mantis', hex: '#7cb82f', finish: 'Metallic', price: lambo.special, angles: ['front', 'rear'] },
      { id: 'bianco-isis', name: 'Bianco Isis', hex: '#eeeeea', finish: 'Solid', price: lambo.solid, angles: ['front', 'rear'] },
      { id: 'nero-noctis', name: 'Nero Noctis', hex: '#151517', finish: 'Metallic', price: lambo.special, angles: ['front', 'rear'] },
    ],
    wheels: [
      { id: 'stock', name: 'Factory Black', note: 'As photographed', price: 0, base: true },
      { id: 'bronze', name: 'Forged Bronze', note: 'Satin bronze finish', price: lambo.wheel },
    ],
    angles: ['front', 'rear'],
    gallery: [
      { file: 'front', caption: 'Front three-quarter' },
      { file: 'rear', caption: 'Rear three-quarter' },
    ],
    hotspots: [
      { id: 'light', label: 'Y-signature lights', x: 50, y: 62, text: 'The daytime running light draws a single Y across the nose and doubles as the car’s calling card.' },
      { id: 'wheel', label: 'Wheels and brakes', x: 29, y: 58, text: 'Large-diameter wheels with carbon-ceramic brakes behind them.' },
      { id: 'intake', label: 'Side intake', x: 14, y: 24, text: 'Large side intakes feed air to the mid-mounted V12.' },
      { id: 'cabin', label: 'Cabin', x: 50, y: 12, text: 'A low, wide, cab-forward cabin puts the driver just behind the front axle.' },
    ],
    focus: '48% 50%',
  },
  'huracan-sto': {
    id: 'huracan-sto',
    brand: 'lamborghini',
    name: 'Huracán STO',
    tagline: 'Track-born aerodynamics in a road shell.',
    summary:
      'A rear-wheel-drive V10 that takes its cues from Lamborghini’s one-make racing cars. Carbon bodywork, a roof snorkel and a rear wing that adjusts in three steps.',
    specs: {
      power: '631 hp',
      torque: '417 lb-ft',
      zeroToSixty: '3.0 s',
      topSpeed: '193 mph',
      drivetrain: 'RWD',
      engine: '5.2L V10',
    },
    basePrice: 327838,
    paints: [
      { id: 'celeste', name: 'Celeste Blue', hex: '#3fb0e8', finish: 'Solid', price: 0, base: true, angles: ['front'] },
      { id: 'giallo-inti', name: 'Giallo Inti', hex: '#f2c01c', finish: 'Metallic', price: lambo.special, angles: ['front'] },
      { id: 'verde-mantis', name: 'Verde Mantis', hex: '#7cb82f', finish: 'Metallic', price: lambo.special, angles: ['front'] },
      { id: 'rosso-mars', name: 'Rosso Mars', hex: '#b3161f', finish: 'Metallic', price: lambo.special, angles: ['front'] },
      { id: 'nero-noctis', name: 'Nero Noctis', hex: '#151517', finish: 'Metallic', price: lambo.special, angles: ['front'] },
    ],
    wheels: [
      { id: 'stock', name: 'Factory Black', note: 'As photographed', price: 0, base: true },
      { id: 'bronze', name: 'Forged Bronze', note: 'Satin bronze finish', price: lambo.wheel },
    ],
    angles: ['front'],
    gallery: [
      { file: 'front', caption: 'Front three-quarter' },
      { file: 'alt', caption: 'Another car, same model' },
    ],
    hotspots: [
      { id: 'bonnet', label: 'Carbon bonnet', x: 62, y: 34, text: 'Bonnet and front wings are one carbon-fibre clamshell that tips forward, a layout Lamborghini calls the cofango.' },
      { id: 'splitter', label: 'Front splitter', x: 48, y: 85, text: 'A wide splitter and aero blades push the nose down at speed.' },
      { id: 'wheel', label: 'Wheels and brakes', x: 20, y: 60, text: 'Black forged wheels with carbon-ceramic brakes behind them.' },
      { id: 'light', label: 'Headlights', x: 44, y: 53, text: 'Slim LED headlights cut low into the nose, next to the cooling ducts.' },
    ],
    focus: '50% 50%',
  },
  '911-gt3': {
    id: '911-gt3',
    brand: 'porsche',
    name: '911 GT3',
    tagline: 'Naturally aspirated precision, tuned for the track.',
    summary:
      'A 4.0-litre flat-six that revs to 9,000 rpm, motorsport-derived suspension and a front end shaped for downforce. Built to be driven to the circuit and back.',
    specs: {
      power: '502 hp',
      torque: '346 lb-ft',
      zeroToSixty: '3.2 s',
      topSpeed: '199 mph',
      drivetrain: 'RWD',
      engine: '4.0L flat-six',
    },
    basePrice: 223800,
    paints: [
      { id: 'signal-yellow', name: 'Racing Yellow', hex: '#f1b21a', finish: 'Solid', price: porsche.solid, base: true, angles: ['front'] },
      { id: 'guards-red', name: 'Guards Red', hex: '#c8141c', finish: 'Solid', price: porsche.solid, angles: ['front'] },
      { id: 'gt-silver', name: 'GT Silver', hex: '#b9bcc2', finish: 'Metallic', price: porsche.special, angles: ['front'] },
      { id: 'shark-blue', name: 'Shark Blue', hex: '#1d83b8', finish: 'Metallic', price: porsche.special, angles: ['front'] },
      { id: 'jet-black', name: 'Jet Black', hex: '#17181a', finish: 'Metallic', price: porsche.special, angles: ['front'] },
    ],
    wheels: [
      { id: 'stock', name: 'Factory Graphite', note: 'As photographed', price: 0, base: true },
      { id: 'silver', name: 'Diamond Silver', note: 'Bright diamond-cut finish', price: porsche.wheel },
    ],
    angles: ['front'],
    gallery: [
      { file: 'front', caption: 'Front three-quarter' },
      { file: 'rear', caption: 'Rear, with the fixed swan-neck wing' },
    ],
    hotspots: [
      { id: 'lid', label: 'Front lid', x: 15, y: 53, text: 'Louvres in the front lid let air out of the front radiators and keep the nose planted.' },
      { id: 'light', label: 'Headlights', x: 40, y: 48, text: 'Round LED headlights, the shape every 911 has carried since 1964.' },
      { id: 'wheel', label: 'Wheels', x: 57, y: 63, text: 'Forged lightweight wheels with a centre-lock nut.' },
      { id: 'lip', label: 'Front lip', x: 28, y: 82, text: 'A low front lip, shaped for the same air that cools the radiators.' },
    ],
    focus: '48% 50%',
  },
  'taycan-turbo': {
    id: 'taycan-turbo',
    brand: 'porsche',
    name: 'Taycan Turbo S',
    tagline: 'Instant torque, silent launch.',
    summary:
      'Porsche’s electric four-door, with an 800-volt architecture, two permanent-magnet motors and a two-speed rear gearbox. Quick off the line and calm at a motorway pace.',
    specs: {
      power: '750 hp',
      torque: '774 lb-ft',
      zeroToSixty: '2.6 s',
      topSpeed: '162 mph',
      drivetrain: 'AWD',
      engine: 'Dual permanent-magnet motors',
    },
    basePrice: 209000,
    paints: [
      { id: 'carrara', name: 'Carrara White', hex: '#eceeed', finish: 'Metallic', price: porsche.special, base: true, angles: ['front'] },
      { id: 'jet-black', name: 'Jet Black', hex: '#17181a', finish: 'Metallic', price: porsche.special, angles: ['front'] },
      { id: 'volcano-grey', name: 'Volcano Grey', hex: '#4a4d50', finish: 'Metallic', price: porsche.special, angles: ['front'] },
      { id: 'gentian-blue', name: 'Gentian Blue', hex: '#1f3b66', finish: 'Metallic', price: porsche.special, angles: ['front'] },
      { id: 'cherry', name: 'Cherry', hex: '#7f1220', finish: 'Metallic', price: porsche.special, angles: ['front'] },
    ],
    wheels: [
      { id: 'stock', name: 'Aero Graphite', note: 'As photographed', price: 0, base: true },
      { id: 'bronze', name: 'Forged Bronze', note: 'Satin bronze finish', price: porsche.wheel },
    ],
    angles: ['front'],
    gallery: [
      { file: 'front', caption: 'Front three-quarter' },
      { file: 'rear', caption: 'Rear, with the full-width light bar' },
    ],
    hotspots: [
      { id: 'light', label: 'Headlights', x: 26.5, y: 56, text: 'Four-point LED daytime running lights carry the 911’s round-light idea into an EV.' },
      { id: 'intake', label: 'Cooling intake', x: 28, y: 68, text: 'Active air flaps behind the lower intakes open only when the motors need cooling.' },
      { id: 'wheel', label: 'Aero wheels', x: 46, y: 66, text: 'Wheels shaped to cut drag, part of the car’s range-first aerodynamics.' },
      { id: 'port', label: 'Charge port', x: 54, y: 48, text: 'The charge port sits in the front wing, on each side of the car.' },
    ],
    focus: '48% 55%',
  },
  'm4-csl': {
    id: 'm4-csl',
    brand: 'bmw',
    name: 'M4 CSL',
    tagline: 'Lightweight coupe, M division tuned.',
    summary:
      'The M4 with weight taken out, power added and a rear-drive chassis tuned for the circuit. Carbon fibre in the bonnet and roof, a lighter cabin and a quicker lap time.',
    specs: {
      power: '543 hp',
      torque: '479 lb-ft',
      zeroToSixty: '3.5 s',
      topSpeed: '191 mph',
      drivetrain: 'RWD',
      engine: '3.0L twin-turbo inline-six',
    },
    basePrice: 140895,
    paints: [
      { id: 'brooklyn', name: 'Brooklyn Grey', hex: '#b4b8bb', finish: 'Metallic', price: bmw.special, base: true, angles: ['front', 'rear'] },
      { id: 'portimao', name: 'Portimao Blue', hex: '#1f4fa3', finish: 'Metallic', price: bmw.special, angles: ['front', 'rear'] },
      { id: 'alpine-white', name: 'Alpine White', hex: '#f2f2f0', finish: 'Solid', price: bmw.solid, angles: ['front', 'rear'] },
      { id: 'sao-paulo', name: 'Sao Paulo Yellow', hex: '#f4cf00', finish: 'Solid', price: bmw.solid, angles: ['front', 'rear'] },
      { id: 'toronto-red', name: 'Toronto Red', hex: '#b0121f', finish: 'Metallic', price: bmw.special, angles: ['front', 'rear'] },
    ],
    wheels: [
      { id: 'stock', name: 'Forged Black', note: 'As photographed', price: 0, base: true },
      { id: 'silver', name: 'Diamond Silver', note: 'Bright silver finish', price: bmw.wheel },
    ],
    angles: ['front', 'rear'],
    gallery: [
      { file: 'front', caption: 'Front three-quarter' },
      { file: 'rear', caption: 'Rear three-quarter' },
    ],
    hotspots: [
      { id: 'grille', label: 'Kidney grille', x: 79, y: 62, text: 'The upright double kidney is the M4’s most talked-about feature, outlined here in red.' },
      { id: 'bonnet', label: 'Carbon bonnet', x: 60, y: 33, text: 'A carbon-fibre bonnet with a central stripe helps cut weight over the front axle.' },
      { id: 'light', label: 'Headlights', x: 47, y: 50, text: 'Laser headlights with a yellow daytime signature are a CSL detail.' },
      { id: 'wheel', label: 'Wheels', x: 33, y: 70, text: 'Forged lightweight wheels, wider at the rear than at the front.' },
    ],
    focus: '50% 50%',
  },
  'i5-m60': {
    id: 'i5-m60',
    brand: 'bmw',
    name: 'i5 M60',
    tagline: 'Electric sedan with M calibration.',
    summary:
      'A four-door electric sedan with a motor on each axle, adaptive suspension and a calm, tech-heavy cabin. M tuning makes it the fastest of the i5 range.',
    specs: {
      power: '593 hp',
      torque: '605 lb-ft',
      zeroToSixty: '3.6 s',
      topSpeed: '155 mph',
      drivetrain: 'AWD',
      engine: 'Dual electric motors',
    },
    basePrice: 84100,
    paints: [
      { id: 'fire-red', name: 'Fire Red', hex: '#a3152a', finish: 'Metallic', price: bmw.special, base: true, angles: ['front'] },
      { id: 'mineral-white', name: 'Mineral White', hex: '#e6e7e6', finish: 'Metallic', price: bmw.special, angles: ['front'] },
      { id: 'black-sapphire', name: 'Black Sapphire', hex: '#14151a', finish: 'Metallic', price: bmw.special, angles: ['front'] },
      { id: 'tanzanite', name: 'Tanzanite Blue', hex: '#3a2d70', finish: 'Metallic', price: bmw.special, angles: ['front'] },
      { id: 'brooklyn', name: 'Brooklyn Grey', hex: '#7b8086', finish: 'Metallic', price: bmw.special, angles: ['front'] },
    ],
    wheels: [
      { id: 'stock', name: 'Aero Black', note: 'As photographed', price: 0, base: true },
      { id: 'silver', name: 'Diamond Silver', note: 'Bright silver finish', price: bmw.wheel },
    ],
    angles: ['front'],
    gallery: [
      { file: 'front', caption: 'Front three-quarter' },
      { file: 'alt', caption: 'Same car, a little further back' },
    ],
    hotspots: [
      { id: 'grille', label: 'Kidney grille', x: 20, y: 55, text: 'The grille is closed off, since there is no combustion engine to feed, and carries sensors for driver assistance.' },
      { id: 'light', label: 'Split headlights', x: 42, y: 51, text: 'A slim upper daytime light sits above the main headlight unit.' },
      { id: 'wheel', label: 'Aero wheels', x: 57, y: 73, text: 'Wheels shaped to cut drag and add range.' },
      { id: 'bonnet', label: 'Bonnet', x: 40, y: 38, text: 'Sharp creases run down the bonnet toward the grille.' },
    ],
    focus: '45% 50%',
  },
}

export const ALL_MODEL_IDS = Object.keys(MODELS) as ModelId[]

export function getModel(slug: string | undefined): CarModel | null {
  if (!slug || !(slug in MODELS)) return null
  return MODELS[slug as ModelId]
}

export function formatPrice(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

/** Path (without extension) of a real photograph. Files exist as <path>.webp (1600w) and <path>-800.webp. */
export function photoPath(model: ModelId, file: string): string {
  return `${ASSET_BASE}/photos/${model}/${file}`
}

/** Path (without extension) of the configurator image for a paint, wheel and angle choice. */
export function configPath(model: CarModel, paint: PaintOption, wheel: WheelOption, angle: AngleId): string {
  if (!wheel.base) return `${ASSET_BASE}/variants/${model.id}/${wheel.id}`
  if (paint.base) return photoPath(model.id, angle)
  return `${ASSET_BASE}/variants/${model.id}/${paint.id}${angle === 'rear' ? '__rear' : ''}`
}

/** Identity of the configurator image for a choice; wheel previews only exist in the as-photographed colour, at the front. */
export function imageKey(paint: PaintOption, wheel: WheelOption, angle: AngleId): string {
  return wheel.base ? `${paint.id}:stock:${angle}` : `${paint.id}:${wheel.id}:front`
}

/** Every distinct image the configurator can show for a model, for stacking and preloading. */
export function configImages(model: CarModel): { key: string; path: string }[] {
  const out: { key: string; path: string }[] = []
  const base = model.paints.find((p) => p.base)!
  const stock = model.wheels.find((w) => w.base)!
  for (const p of model.paints) {
    for (const a of p.angles) out.push({ key: imageKey(p, stock, a), path: configPath(model, p, stock, a) })
  }
  for (const w of model.wheels) {
    if (w.base) continue
    out.push({ key: imageKey(base, w, 'front'), path: configPath(model, base, w, 'front') })
  }
  return out
}
