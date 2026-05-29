import enHome from "@/lib/i18n/messages/home.en.json"
import hiHome from "@/lib/i18n/messages/home.hi.json"
import { PHOTO_DELIVERY_DAYS, RESPONSE_TIME_PROMISE } from "@/lib/constants"
import type { AppLocale } from "@/lib/i18n/config"
import { getLocaleTag } from "@/lib/i18n/config"

type TrustBarItem = {
  strong: string
  label: string
}

type Step = {
  step: string
  title: string
  desc: string
}

type Feature = {
  title: string
  desc: string
  stat: string
}

type Expectation = {
  title: string
  text: string
}

type FaqItem = {
  q: string
  a: string
}

export type HomeMessages = {
  locale: AppLocale
  localeTag: string
  hero: {
    urgencyTemplate: string
    headingLine1: string
    headingHighlight: string
    description: string
    primaryCta: string
    secondaryCta: string
    whatsappTemplate: string
    stats: { number: string; label: string }[]
  }
  trustBar: TrustBarItem[]
  services: {
    badge: string
    headingPrefix: string
    headingHighlight: string
    description: string
    pricePrefix: string
    viewAllPrefix: string
  }
  why: {
    badge: string
    headingPrefix: string
    headingHighlight: string
    description: string
    features: Feature[]
  }
  how: {
    badge: string
    headingPrefix: string
    headingHighlight: string
    steps: Step[]
  }
  testimonials: {
    badge: string
    headingPrefix: string
    headingHighlight: string
    expectations: Expectation[]
  }
  faq: {
    badge: string
    heading: string
    items: FaqItem[]
  }
  cta: {
    urgencyTemplate: string
    headingLine1: string
    headingLine2: string
    description: string
    whatsappCta: string
    whatsappTemplate: string
    bookingCta: string
  }
}

type HomeMessagePayload = Omit<HomeMessages, "locale" | "localeTag">

const RUNTIME_TOKENS: Record<string, string> = {
  PHOTO_DELIVERY_DAYS: String(PHOTO_DELIVERY_DAYS),
  RESPONSE_TIME_PROMISE,
}

const catalogByLocale: Record<AppLocale, HomeMessagePayload> = {
  en: enHome as HomeMessagePayload,
  hi: hiHome as HomeMessagePayload,
}

function interpolateRuntimeTokens(value: string): string {
  return applyTemplate(value, RUNTIME_TOKENS)
}

function hydrateCatalog<T>(input: T): T {
  if (typeof input === "string") {
    return interpolateRuntimeTokens(input) as T
  }

  if (Array.isArray(input)) {
    return input.map((item) => hydrateCatalog(item)) as T
  }

  if (input && typeof input === "object") {
    const output: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      output[key] = hydrateCatalog(value)
    }
    return output as T
  }

  return input
}

function withLocale(locale: AppLocale, payload: HomeMessagePayload): HomeMessages {
  return {
    locale,
    localeTag: getLocaleTag(locale),
    ...hydrateCatalog(payload),
  }
}

export function getHomeMessages(locale: AppLocale): HomeMessages {
  const payload = catalogByLocale[locale] ?? catalogByLocale.en
  return withLocale(locale, payload)
}

export function applyTemplate(template: string, params: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(params)) {
    result = result.replaceAll(`{${key}}`, value)
  }
  return result
}
