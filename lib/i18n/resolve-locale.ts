import { headers } from "next/headers"

import { normalizeLocale, resolveLocaleFromAcceptLanguage, type AppLocale } from "@/lib/i18n/config"

export async function resolveRequestLocale(): Promise<AppLocale> {
  const requestHeaders = await headers()
  const headerLocale = requestHeaders.get("x-locale")

  if (headerLocale) {
    return normalizeLocale(headerLocale)
  }

  return resolveLocaleFromAcceptLanguage(requestHeaders.get("accept-language"))
}
