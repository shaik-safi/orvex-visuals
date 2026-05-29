import { Hero, FAQSection, CTABanner } from "@/components/home/ClientSections"
import {
  TrustBar,
  ServicesSection,
  WhyOrvex,
  HowItWorks,
  TestimonialsSection,
} from "@/components/home/HomeServerSections"
import { getHomeMessages } from "@/lib/i18n/home"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

export default async function Home() {
  const locale = await resolveRequestLocale()
  const messages = getHomeMessages(locale)

  return (
    <main>
      <Hero messages={messages} />
      <TrustBar messages={messages} />
      <ServicesSection messages={messages} />
      <WhyOrvex messages={messages} />
      <HowItWorks messages={messages} />
      <TestimonialsSection messages={messages} />
      <FAQSection messages={messages} />
      <CTABanner messages={messages} />
    </main>
  )
}
