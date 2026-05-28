"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  ArrowRight,
  Search,
  Star,
} from "lucide-react"

import { getWhatsAppLink } from "@/lib/constants"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getPageMessages } from "@/lib/i18n/pages"
import { withLocaleHref, withLocalePathname } from "@/lib/i18n/routing"
import { buildPricingHandoffHref } from "@/lib/pricing-handoff"
import { categories, services, type Category } from "./data"

type ServicesPageMessages = ReturnType<typeof getPageMessages>["servicesPage"]

function ServicesHero({ messages }: { messages: ServicesPageMessages }) {
  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          {messages.hero.badgeTemplate.replace("{count}", String(services.length))}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[0.95] mb-6">
          {messages.hero.titleLine1}{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.hero.titleHighlight}</span>
          <br />{messages.hero.titleLine2}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {messages.hero.description}
        </p>
      </div>
    </section>
  )
}

function ServicesGrid({ locale, messages }: { locale: ReturnType<typeof useCurrentLocale>; messages: ServicesPageMessages }) {
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = services.filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category === activeCategory
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryLabel = (id: Category) => messages.categoryLabels[id]

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="relative max-w-md mx-auto mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={messages.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20"
                    : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-500/30"
                    }`}
                >
                  <Icon size={14} />
                  {getCategoryLabel(cat.id)}
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {messages.resultsTemplate.replace("{count}", String(filtered.length))}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service, i) => {
            const Icon = service.icon
            return (
              <Link
                key={service.slug}
                href={withLocalePathname(`/services/${service.slug}`, locale)}
                className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
                style={{ transitionDelay: `${Math.min(i * 60, 500)}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    quality={65}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {service.popular && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                        <Star size={10} className="fill-white" /> {messages.popular}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                      {messages.priceFrom} &#8377;{service.startingPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
                      {getCategoryLabel(service.category)}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                      {messages.viewDetails} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400">{messages.emptyState}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function ServicesCTA({ locale, messages }: { locale: ReturnType<typeof useCurrentLocale>; messages: ServicesPageMessages }) {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.1),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {messages.cta.title}
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          {messages.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={withLocaleHref(buildPricingHandoffHref({ from: "services", source: "Services Page", intent: "custom-package" }), locale)}
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            {messages.cta.build}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={getWhatsAppLink(messages.cta.whatsappTemplate)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            <MessageCircle size={20} />
            {messages.cta.talk}
          </a>
        </div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).servicesPage

  return (
    <main>
      <ServicesHero messages={messages} />
      <ServicesGrid locale={locale} messages={messages} />
      <ServicesCTA locale={locale} messages={messages} />
    </main>
  )
}
