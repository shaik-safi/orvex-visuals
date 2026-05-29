"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { getWhatsAppLink, IMAGES } from "@/lib/constants"
import { buildPricingHandoffHref } from "@/lib/pricing-handoff"
import { applyTemplate, type HomeMessages } from "@/lib/i18n/home"
import { withLocaleHref, withLocalePathname } from "@/lib/i18n/routing"

function getUpcomingMonths(localeTag: string) {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const second = new Date(now.getFullYear(), now.getMonth() + 2, 1)
  const monthName = (date: Date) => date.toLocaleString(localeTag, { month: "long" })
  const withYear = (date: Date) => date.toLocaleString(localeTag, { month: "long", year: "numeric" })
  return {
    next: withYear(first),
    nextTwo: `${monthName(first)} & ${monthName(second)} ${second.getFullYear()}`,
  }
}

export function Hero({ messages }: { messages: HomeMessages }) {
  const heroImage = IMAGES.hero[0]
  const { next } = getUpcomingMonths(messages.localeTag)

  return (
    <section id="home" className="relative flex min-h-svh items-start justify-center overflow-hidden pt-28 pb-20 sm:pt-32 md:pt-36 md:pb-24 lg:items-center lg:pt-40">
      {heroImage ? (
        <Image
          src={heroImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTI5M2IiLz48L3N2Zz4="
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')" }} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-4 text-center sm:px-6">
        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm mb-7 sm:px-5">
          <span className="text-white/85 text-xs font-medium sm:text-sm">
            {applyTemplate(messages.hero.urgencyTemplate, { month: next })}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-[0.92] mb-6 tracking-tight">
          {messages.hero.headingLine1}
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            {messages.hero.headingHighlight}
          </span>
        </h1>

        <p className="text-base text-white/72 mb-8 max-w-2xl mx-auto leading-relaxed sm:text-lg md:text-xl md:mb-10">
          {messages.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={withLocaleHref(buildPricingHandoffHref({ from: "home", source: "Homepage Hero", intent: "availability" }), messages.locale)}
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3.5 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-1 sm:px-8 sm:py-4 sm:text-lg"
          >
            {messages.hero.primaryCta}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={getWhatsAppLink(messages.hero.whatsappTemplate)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-slate-900 px-6 py-3.5 rounded-2xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 sm:px-8 sm:py-4 sm:text-lg"
          >
            <MessageCircle size={20} />
            {messages.hero.secondaryCta}
          </a>
        </div>

        <div className="mt-10 grid max-w-3xl mx-auto grid-cols-1 gap-3 sm:grid-cols-3 md:mt-12">
          {messages.hero.stats.map((stat, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-sm text-left sm:px-5 sm:py-4">
              <div className="text-sm md:text-base font-semibold text-white">{stat.number}</div>
              <div className="text-white/55 text-xs md:text-sm mt-1 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection({ messages }: { messages: HomeMessages }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section id="faq" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.faq.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">{messages.faq.heading}</h2>
        </div>

        <div className="space-y-3">
          {messages.faq.items.map((faq, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-amber-200 dark:hover:border-amber-500/30 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${200 + index * 80}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                <div className={`w-8 h-8 bg-amber-50 dark:bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                  <ChevronDown size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 pb-6 -mt-2">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTABanner({ messages }: { messages: HomeMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const { nextTwo } = getUpcomingMonths(messages.localeTag)

  return (
    <section id="contact" ref={ref} className={`py-20 md:py-28 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
          <div className="w-2 h-2 bg-red-400 rounded-full" />
          <span className="text-white/90 text-sm font-medium">
            {applyTemplate(messages.cta.urgencyTemplate, { months: nextTwo })}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {messages.cta.headingLine1}<br />{messages.cta.headingLine2}
        </h2>
        <p className="text-amber-100 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          {messages.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getWhatsAppLink(messages.cta.whatsappTemplate)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 bg-white text-amber-700 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <MessageCircle size={22} />
            {messages.cta.whatsappCta}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href={withLocaleHref(buildPricingHandoffHref({ from: "home-banner", source: "Homepage CTA", intent: "availability" }), messages.locale)}
            className="inline-flex items-center justify-center border-2 border-white/40 text-white hover:bg-white hover:text-amber-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            {messages.cta.bookingCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
