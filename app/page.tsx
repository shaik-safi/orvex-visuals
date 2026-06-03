import { Hero, FAQSection, CTABanner } from "@/components/home/ClientSections"
import {
  TrustBar,
  ServicesSection,
  WhyOrvex,
  HowItWorks,
  TestimonialsSection,
} from "@/components/home/HomeServerSections"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

export default async function Home() {
  const locale = await resolveRequestLocale()

  return (
    <main>
      <Hero />
      <TrustBar locale={locale} className="hidden md:block" />
      <ServicesSection locale={locale} />
      <WhyOrvex locale={locale} />
      <HowItWorks locale={locale} />
      <TestimonialsSection locale={locale} />
      <FAQSection />
      <TrustBar locale={locale} className="md:hidden" />
      <CTABanner />
    </main>
  )
}