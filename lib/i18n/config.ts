export const SUPPORTED_LOCALES = ["en", "hi"] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = "en"
export const LOCALE_COOKIE_NAME = "locale"

const LOCALE_TAGS: Record<AppLocale, string> = {
  en: "en-IN",
  hi: "hi-IN",
}

export function getLocaleTag(locale: AppLocale): string {
  return LOCALE_TAGS[locale]
}

export function normalizeLocale(value: string | null | undefined): AppLocale {
  const parsed = parseSupportedLocale(value)
  return parsed ?? DEFAULT_LOCALE
}

export function parseSupportedLocale(value: string | null | undefined): AppLocale | null {
  if (!value) return null
  const base = value.toLowerCase().split("-")[0]
  return SUPPORTED_LOCALES.includes(base as AppLocale) ? (base as AppLocale) : null
}

export function resolveLocaleFromAcceptLanguage(headerValue: string | null): AppLocale {
  if (!headerValue) return DEFAULT_LOCALE

  const entries = headerValue
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter(Boolean)

  for (const entry of entries) {
    const locale = parseSupportedLocale(entry)
    if (locale) {
      return locale
    }
  }

  return DEFAULT_LOCALE
}
