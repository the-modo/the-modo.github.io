import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { Features } from '@/components/Features'
import { Screenshots } from '@/components/Screenshots'
import { RoutingSection } from '@/components/RoutingSection'
import { ContentShieldSection } from '@/components/ContentShieldSection'
import { GuardrailsSection } from '@/components/GuardrailsSection'
import { Workflows } from '@/components/Workflows'
import { OpenSource } from '@/components/OpenSource'
import { Pricing } from '@/components/Pricing'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Nav/>
      <Hero/>
      <Stats/>
      <Features/>
      <RoutingSection/>
      <ContentShieldSection/>
      <GuardrailsSection/>
      <Screenshots/>
      <Workflows/>
      <OpenSource/>
      <Pricing/>
      <Contact/>
      <Footer/>
    </>
  )
}
