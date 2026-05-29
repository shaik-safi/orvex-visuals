"use client"

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react"
import { usePathname } from "next/navigation"

import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/config"
import { extractLocaleFromPathname } from "@/lib/i18n/routing"

type LocaleSyncValue = {
  renderedLocale: AppLocale
  routeLocale: AppLocale
  isPending: boolean
}

const LocaleSyncContext = createContext<LocaleSyncValue | null>(null)

export function LocaleSyncProvider({
  renderedLocale,
  children,
}: {
  renderedLocale: AppLocale
  children: ReactNode
}) {
  const pathname = usePathname() || "/"
  const routeLocale = extractLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
  const isPending = routeLocale !== renderedLocale

  const value = useMemo(
    () => ({
      renderedLocale,
      routeLocale,
      isPending,
    }),
    [renderedLocale, routeLocale, isPending],
  )

  useEffect(() => {
    console.log("[LocaleSyncProvider]", {
      pathname,
      routeLocale,
      renderedLocale,
      isPending,
      targetLocale: null,
    })
  }, [pathname, routeLocale, renderedLocale, isPending])

  return <LocaleSyncContext.Provider value={value}>{children}</LocaleSyncContext.Provider>
}

export function useLocaleSync(): LocaleSyncValue {
  const value = useContext(LocaleSyncContext)

  if (!value) {
    throw new Error("useLocaleSync must be used within LocaleSyncProvider")
  }

  return value
}