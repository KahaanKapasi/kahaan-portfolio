import CaseLayout from '../_shared/CaseLayout'
import { BrowserFrame, ExtIcon, Figure, PlateGrid, Prose, Rows, Section, StackTable, type Shot } from '../_shared/parts'
import { useLightbox } from '../_shared/Lightbox'
import './store.css'

const LIVE = 'https://store.madridonomy.com'
const B = '/work/madridonomy-store/'
const shot = (f: string, w: number, h: number, alt: string, caption: string): Shot => ({ src: `${B}${f}.webp`, width: w, height: h, alt, caption })

const homeD = shot(
  'desktop-home',
  1440,
  900,
  'The Madridonomy Store home page on desktop: a red announcement bar, a light header with the Madridonomy name and Home, Catalog and Contact links, and a full-bleed hero showing two black oversized tees with the headline "The Special One." and the label "Available now".',
  'Home: announcement bar, header and a full-bleed drop hero.',
)
const productD = shot(
  'desktop-product',
  1440,
  900,
  'The product page on desktop: a large photo of the front and back of a black oversized tee on the left, and on the right the breadcrumb, the title, a price with a struck-through compare price, XS to XL size buttons with a Size Guide link, a black Add to Cart button and two collapsed accordions for Details and Fabric and Shipping and Returns.',
  'Product page: sticky gallery, size buttons, price and accordions.',
)
const cartD = shot(
  'desktop-cart',
  1440,
  900,
  'The cart drawer open over the dimmed home page: a white panel on the right headed Your Cart, with the empty state "Nothing here. Your cart is empty." and a Shop Now button.',
  'Cart drawer, shown in its empty state.',
)
const homeM = shot(
  'mobile-home',
  750,
  1624,
  'The home page on a phone: the red announcement bar, a compact header with a menu and a bag icon, and the hero with the headline "The Special One." over the two tees, with a Shop Now button.',
  'Home on a phone.',
)
const productM = shot(
  'mobile-product',
  750,
  1624,
  'The product page on a phone: the end of the photo, then the breadcrumb, the title, the price, five size buttons, a full-width Add to Cart button and two accordions.',
  'Product page on a phone.',
)
const GROUP = [homeD, homeM, productM, productD, cartD]

function HeroShot() {
  const lb = useLightbox()
  return (
    <BrowserFrame url="store.madridonomy.com" className="wsm-frame">
      <button type="button" className="wsm-tap" onClick={() => lb.open(GROUP, 0)} aria-label="Enlarge: the live store home page">
        <img src={homeD.src} width={homeD.width} height={homeD.height} alt={homeD.alt} decoding="async" fetchPriority="high" />
      </button>
    </BrowserFrame>
  )
}

export default function MadridonomyStoreCase() {
  return (
    <CaseLayout
      slug="madridonomy-store"
      title="Madridonomy Store"
      summary="A custom Shopify Online Store 2.0 theme for the Madridonomy football-streetwear store: collections, a product page with size picker, a slide-in cart drawer and a newsletter, written in Liquid with no theme-store base."
      role="Founder, designer and theme developer"
      stack="Shopify OS 2.0, Liquid sections and snippets, JSON templates, Shopify Markets-ready locales, vanilla JS"
      status="Live"
      links={[{ label: 'store.madridonomy.com', href: LIVE, external: true }]}
      accent="#e8300a"
      metaTitle="Madridonomy Store case study | Kahaan Kapasi"
      metaDescription="Case study: Madridonomy Store, a custom Shopify Online Store 2.0 theme for the Madridonomy football-streetwear store. Liquid sections, JSON templates, a cart drawer, size picker and Shopify Markets-ready locale files."
      hero={<HeroShot />}
    >
      <Section id="overview" title="What it is">
        <Prose lead>
          <p>
            Madridonomy sells football streetwear with no badges and no allegiance, so the store had to feel like a fashion label, not a
            fan shop. Madridonomy Store runs on a custom theme: a light, type-led storefront where the product photography does the talking and
            each drop gets its own hero, label and accent colour.
          </p>
          <p>
            It is a hand-written Online Store 2.0 theme. There is no starter theme underneath, which means every section, snippet and
            template is mine and every line of it can be changed without fighting someone else&apos;s defaults.
          </p>
        </Prose>
        <div className="wsm-actions">
          <a className="w-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
            Open live store
            <ExtIcon />
          </a>
          <a className="wsm-code" href={LIVE} target="_blank" rel="noopener noreferrer">
            store.madridonomy.com
          </a>
        </div>
      </Section>

      <Section id="features" title="What it does">
        <Rows
          items={[
            { name: 'Collections and product grid', text: 'Collection pages with type filter pills, 24 products per page with pagination, and available products sorted ahead of sold-out ones. The home page pulls featured collections, each with its own drop label and a Coming Soon state for products not yet live.' },
            { name: 'Product page', text: 'A sticky gallery beside the details. Size buttons update the price and the add-to-cart state without a page reload, a size guide opens in a dialog, and Details and Shipping sit in accordions so the buy button stays in view.' },
            { name: 'Cart drawer', text: 'The bag icon slides a cart in over the page. It reads and updates the cart through Shopify’s Ajax cart API, with quantity controls, remove, a live subtotal and a straight link to checkout.' },
            { name: 'Drops and the announcement bar', text: 'A section-driven hero (image or video), an announcement bar with an optional countdown, and a single accent colour setting so a new drop can be re-coloured from the theme editor.' },
            { name: 'Locales', text: 'Key interface strings (cart, navigation, product and accessibility labels) run through a locale file, so adding a language or a Shopify Markets region starts with translating one file instead of editing templates.' },
            { name: 'Newsletter', text: 'A sign-up block on Shopify’s own customer form, tagging each subscriber as newsletter so the list lands in the store admin, with no third-party script.' },
          ]}
        />
      </Section>

      <Section id="screens" title="The live store" wide>
        <PlateGrid layout="wide-tall">
          <Figure shot={homeD} plate="01" caption="Home on desktop." group={GROUP} eager />
          <Figure shot={homeM} plate="02" caption="Home on a phone." group={GROUP} />
        </PlateGrid>
        <PlateGrid layout="tall-wide">
          <Figure shot={productM} plate="03" caption="Product page on a phone." group={GROUP} />
          <Figure shot={productD} plate="04" caption="Product page on desktop." group={GROUP} />
        </PlateGrid>
        <PlateGrid layout="wide">
          <Figure shot={cartD} plate="05" caption="The cart drawer, empty." group={GROUP} />
        </PlateGrid>
        <p className="wsm-note">
          Screenshots of the live store at store.madridonomy.com. The product artwork belongs to the Madridonomy brand. The cart is
          shown empty on purpose.
        </p>
      </Section>

      <Section id="build" title="How it is built">
        <Prose>
          <p>
            Pages are JSON templates that assemble Liquid sections, so the owner can reorder and re-word the home page in the theme
            editor without touching code. Sections stay small and take their copy, links and images from settings. Styling is one
            stylesheet on CSS custom properties, which is what makes the per-drop accent a one-line override.
          </p>
          <p>
            The JavaScript is plain and dependency-free, and only does what Liquid cannot: the cart drawer, variant picking, accordions
            and the size guide. Everything else is server-rendered, so the page is readable before any script runs.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'Platform', items: 'Shopify Online Store 2.0, Shopify Markets-ready' },
            { name: 'Theme', items: 'Liquid sections and snippets, JSON templates, locale files' },
            { name: 'Front end', items: 'CSS custom properties, vanilla JS, Shopify Ajax cart API' },
            { name: 'Type', items: 'Barlow Condensed and Manrope' },
          ]}
        />
      </Section>
    </CaseLayout>
  )
}
