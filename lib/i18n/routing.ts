import type { AppLocale } from "@/lib/i18n/config"
import { SUPPORTED_LOCALES } from "@/lib/i18n/config"

export function extractLocaleFromPathname(pathname: string): AppLocale | null {
  const segments = pathname.split("/")
  const maybeLocale = segments[1]
  if (!maybeLocale) return null
  return SUPPORTED_LOCALES.includes(maybeLocale as AppLocale) ? (maybeLocale as AppLocale) : null
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = extractLocaleFromPathname(pathname)
  if (!locale) return pathname

  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "")
  return stripped === "" ? "/" : stripped
}

export function withLocalePathname(pathname: string, locale: AppLocale): string {
  const cleanPath = stripLocaleFromPathname(pathname)
  if (cleanPath === "/") return `/${locale}`
  return `/${locale}${cleanPath}`
}

export function withLocaleHref(href: string, locale: AppLocale): string {
  if (href.startsWith("#")) return href
  if (/^https?:\/\//.test(href)) return href

  const [pathAndQuery, hash = ""] = href.split("#")
  const [pathname, query = ""] = pathAndQuery.split("?")
  const localizedPath = withLocalePathname(pathname || "/", locale)
  const withQuery = query ? `${localizedPath}?${query}` : localizedPath
  return hash ? `${withQuery}#${hash}` : withQuery
}
