"use client"

import { useEffect } from "react"

import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getPageMessages } from "@/lib/i18n/pages"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).system.error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-svh flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {messages.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
          {messages.description}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
        >
          {messages.tryAgain}
        </button>
      </div>
    </div>
  )
}
