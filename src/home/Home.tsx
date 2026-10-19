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
import { Contact, Process, Services, Stack } from './Rest'
import './home.css'

export default function Home() {
  useMeta(
    'Kahaan Kapasi | Freelance web developer for business sites, catalogues and web apps',
    'Kahaan Kapasi builds business websites, product catalogues with an editable CMS, real-time web apps and interactive 3D. Direct with the developer. Email kahaankapasi@gmail.com.',
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
        <Process />
        <Stack />
        <Contact />
      </main>
    </div>
  )
}
