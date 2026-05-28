import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  parseSupportedLocale,
  resolveLocaleFromAcceptLanguage,
  type AppLocale,
} from "@/lib/i18n/config"
import { extractLocaleFromPathname, stripLocaleFromPathname, withLocalePathname } from "@/lib/i18n/routing"

function resolvePreferredLocale(request: NextRequest): AppLocale {
  const cookieLocale = parseSupportedLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value)
  if (cookieLocale) return cookieLocale
  return resolveLocaleFromAcceptLanguage(request.headers.get("accept-language")) || DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const localeInPath = extractLocaleFromPathname(pathname)

  if (localeInPath) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = stripLocaleFromPathname(pathname)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-locale", localeInPath)

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    })

    const currentCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value
    if (currentCookie !== localeInPath) {
      response.cookies.set(LOCALE_COOKIE_NAME, localeInPath, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 })
    }

    return response
  }

  const locale = resolvePreferredLocale(request)
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = withLocalePathname(pathname, locale)

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set(LOCALE_COOKIE_NAME, locale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 })
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.[^/]+$).*)",
  ],
}
