import { Hero, FAQSection, CTABanner } from "@/components/home/ClientSections"
import {
  TrustBar,
  ServicesSection,
  WhyOrvex,
  HowItWorks,
  TestimonialsSection,
} from "@/components/home/HomeServerSections"

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <ServicesSection />
      <WhyOrvex />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <CTABanner />
    </main>
  )
}