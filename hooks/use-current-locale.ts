"use client"

import { usePathname } from "next/navigation"

import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/config"
import { extractLocaleFromPathname } from "@/lib/i18n/routing"

export function useCurrentLocale(): AppLocale {
  const pathname = usePathname() || "/"
  return extractLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
}
