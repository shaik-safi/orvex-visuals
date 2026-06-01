"use client"

import { CheckCircle2, MessageCircle, Shield } from "lucide-react"

import { getWhatsAppLink } from "@/lib/constants"
import type { AppLocale } from "@/lib/i18n/config"
import { getPageMessages } from "@/lib/i18n/pages"
import { withLocalePathname } from "@/lib/i18n/routing"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

type PricingMessages = ReturnType<typeof getPageMessages>["pricingPage"]

export function PricingHero({ messages }: { messages: PricingMessages }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04),transparent_70%)]" />

      <div ref={ref} className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/15 rounded-full px-5 py-2.5 mb-8">
          <Shield size={14} className="text-amber-500 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300/90 text-sm font-medium tracking-wide">{messages.hero.tagline}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          {messages.hero.titlePrefix}{" "}
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
            {messages.hero.titleHighlight}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          {messages.hero.description}
        </p>

        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-5 py-4 mb-8 shadow-sm">
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {messages.hero.subDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {messages.hero.trustTags.map((tag) => (
            <span key={tag} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
              <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400/80" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ComparisonSection({ messages }: { messages: PricingMessages }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const comparisons = messages.comparisonSection.rows

  return (
    <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">{messages.comparisonSection.badge}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {messages.comparisonSection.title}
          </h2>
        </div>

        <div className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "80ms" }}>
          <div className="hidden md:grid md:grid-cols-3 bg-slate-100 dark:bg-slate-900">
            <div className="p-4 md:p-5 text-xs font-medium text-slate-500 uppercase tracking-wider">{messages.comparisonSection.columns.feature}</div>
            <div className="p-4 md:p-5 text-xs font-medium text-amber-500 dark:text-amber-400 text-center uppercase tracking-wider">{messages.comparisonSection.columns.orvex}</div>
            <div className="p-4 md:p-5 text-xs font-medium text-slate-400 dark:text-slate-600 text-center uppercase tracking-wider">{messages.comparisonSection.columns.others}</div>
          </div>

          {comparisons.map((row, index) => (
            <div
              key={index}
              className={`border-t border-slate-200 dark:border-slate-800/60 ${index % 2 === 0 ? "bg-white dark:bg-slate-900/30" : "bg-slate-50 dark:bg-transparent"}`}
            >
              <div className="grid gap-3 p-4 md:grid-cols-3 md:gap-0 md:p-0">
                <div className="md:p-5">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 md:hidden">{messages.comparisonSection.columns.feature}</p>
                  <div className="text-sm text-slate-700 dark:text-slate-300">{row.feature}</div>
                </div>
                <div className="md:p-5 md:text-center">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-amber-500 dark:text-amber-400 md:hidden">{messages.comparisonSection.columns.orvex}</p>
                  <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400/90 font-medium md:justify-center">
                    <CheckCircle2 size={13} />
                    {row.orvex}
                  </div>
                </div>
                <div className="md:p-5 md:text-center">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-600 md:hidden">{messages.comparisonSection.columns.others}</p>
                  <div className="text-sm text-slate-400 dark:text-slate-600">{row.competitor}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingCTA({ locale, messages }: { locale: AppLocale; messages: PricingMessages }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className={`py-24 md:py-32 relative overflow-hidden transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-7">
          <span className="text-white/80 text-sm">{messages.cta.urgency}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
          {messages.cta.title}
        </h2>
        <p className="text-amber-100/80 text-lg mb-10 max-w-md mx-auto">
          {messages.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`${withLocalePathname("/pricing", locale)}#calculator`}
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300"
          >
            {messages.cta.build}
          </a>
          <a
            href={getWhatsAppLink(messages.cta.whatsappTemplate)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white hover:text-amber-700 px-8 py-4 rounded-xl font-bold transition-all duration-300"
          >
            <MessageCircle size={18} />
            {messages.cta.chat}
          </a>
        </div>
      </div>
    </section>
  )
}