"use client"

import Link from "next/link"
import { Camera, ArrowLeft, Home } from "lucide-react"

import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getPageMessages } from "@/lib/i18n/pages"
import { withLocalePathname } from "@/lib/i18n/routing"

export default function NotFound() {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).system.notFound

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/20">
          <Camera size={36} className="text-white" />
        </div>

        <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {messages.title}
        </h2>

        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
          {messages.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={withLocalePathname("/", locale)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
          >
            <Home size={18} /> {messages.backHome}
          </Link>
          <Link
            href={withLocalePathname("/services", locale)}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} /> {messages.viewServices}
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400 mb-3">{messages.popular}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              ["Services", "/services"],
              ["Pricing", "/pricing"],
              ["Gallery", "/gallery"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link key={label} href={withLocalePathname(href, locale)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
