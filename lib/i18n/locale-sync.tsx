"use client"

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react"
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
  const lastRefreshKeyRef = useRef<string | null>(null)
  const routeLocale = extractLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
  const isPending = routeLocale !== renderedLocale

  useEffect(() => {
    if (!isPending) {
      lastRefreshKeyRef.current = null
      return
    }

    const refreshKey = `${pathname}:${renderedLocale}->${routeLocale}`
    if (lastRefreshKeyRef.current === refreshKey) return

    lastRefreshKeyRef.current = refreshKey
  }, [isPending, pathname, renderedLocale, routeLocale])

  const value = useMemo(
    () => ({
      renderedLocale,
      routeLocale,
      isPending,
    }),
    [renderedLocale, routeLocale, isPending],
  )

  return <LocaleSyncContext.Provider value={value}>{children}</LocaleSyncContext.Provider>
}

export function useLocaleSync(): LocaleSyncValue {
  const value = useContext(LocaleSyncContext)

  if (!value) {
    throw new Error("useLocaleSync must be used within LocaleSyncProvider")
  }

  return value
}