"use client"

import { useSyncExternalStore } from "react"

function getLocalDate() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0]
}

function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange)
  document.addEventListener("visibilitychange", onChange)
  return () => {
    window.removeEventListener("focus", onChange)
    document.removeEventListener("visibilitychange", onChange)
  }
}

// Recheck on renders and when returning to the page, including across midnight.
export function useLocalDate() {
  return useSyncExternalStore(subscribe, getLocalDate, () => "")
}
