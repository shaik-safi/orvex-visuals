import { headers } from "next/headers"

import { Hero, FAQSection, CTABanner } from "@/components/home/ClientSections"
import {
  TrustBar,
  ServicesSection,
  WhyOrvex,
  HowItWorks,
  TestimonialsSection,
} from "@/components/home/HomeServerSections"
import { normalizeLocale, resolveLocaleFromAcceptLanguage } from "@/lib/i18n/config"
import { getHomeMessages } from "@/lib/i18n/home"

export default async function Home() {
  const requestHeaders = await headers()
  const headerLocale = requestHeaders.get("x-locale")
  const locale = headerLocale
    ? normalizeLocale(headerLocale)
    : resolveLocaleFromAcceptLanguage(requestHeaders.get("accept-language"))
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
