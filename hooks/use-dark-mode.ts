"use client"

import { useCallback, useEffect, useState } from "react"

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = (nextIsDark: boolean) => {
      setIsDark(nextIsDark)
      document.documentElement.classList.toggle("dark", nextIsDark)
    }

    const stored = localStorage.getItem("theme")
    if (stored === "dark" || stored === "light") {
      applyTheme(stored === "dark")
      return
    }

    applyTheme(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return
      applyTheme(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggle = useCallback(() => {
    setIsDark((current) => {
      const nextIsDark = !current
      document.documentElement.classList.toggle("dark", nextIsDark)
      localStorage.setItem("theme", nextIsDark ? "dark" : "light")
      return nextIsDark
    })
  }, [])

  return { isDark, toggle }
}
