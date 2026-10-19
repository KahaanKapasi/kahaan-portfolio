import '@fontsource-variable/saira/wght.css'
import '@fontsource-variable/onest'
import '@fontsource-variable/bodoni-moda/wght-italic.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import { useMeta } from '../shared/meta'
import SiteNav from '../shared/SiteNav'
import Hero from './Hero'
import Credibility from './Credibility'
import Work from './Work'
import Experience from './Experience'
import { Contact, Services, Stack } from './Rest'
import './home.css'

export default function Home() {
  useMeta(
    'Kahaan Kapasi | Developer',
    'Kahaan Kapasi builds web apps, mobile apps, real-time systems and interactive 3D. Shipped work, concept builds and case studies.',
  )

  return (
    <div className="h-home">
      <a className="h-skip" href="#work">
        Skip to work
      </a>
      <SiteNav />
      <main>
        <Hero />
        <Credibility />
        <Work />
        <Experience />
        <Services />
        <Stack />
        <Contact />
      </main>
    </div>
  )
}
