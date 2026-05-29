import { Clock, Shield, Receipt, Smartphone, ArrowRight } from "lucide-react"
import Link from "next/link"

import { services as allServices } from "@/app/services/data"
import { homeServices } from "@/components/home/home-data"
import type { HomeMessages } from "@/lib/i18n/home"
import { withLocalePathname } from "@/lib/i18n/routing"

const FEATURE_ICONS = [Clock, Shield, Receipt, Smartphone] as const

export function TrustBar({ messages }: { messages: HomeMessages }) {
  return (
    <div className="py-5 bg-slate-900 dark:bg-slate-800 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {messages.trustBar.map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-400/90" />
              <span className="leading-snug">
                <strong className="text-white font-semibold">{item.strong}</strong>{" "}
                <span className="text-white/60">{item.label}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ServicesSection({ messages }: { messages: HomeMessages }) {
  return (
    <section id="services" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.services.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {messages.services.headingPrefix}{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.services.headingHighlight}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            {messages.services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {homeServices.map((service, index) => {
            const Icon = service.icon
            return (
              <Link
                href={withLocalePathname(`/services/${service.slug}`, messages.locale)}
                key={index}
                className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{service.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-amber-700 dark:text-amber-300 font-bold text-sm">{messages.services.pricePrefix} {service.price}</span>
                      <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link href={withLocalePathname("/services", messages.locale)} className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5">
            {messages.services.viewAllPrefix} {allServices.length}+ Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function WhyOrvex({ messages }: { messages: HomeMessages }) {
  return (
    <section id="why-us" className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[min(82vw,50rem)] w-[min(82vw,50rem)] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.why.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            {messages.why.headingPrefix}{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">{messages.why.headingHighlight}</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            {messages.why.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {messages.why.features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] ?? Clock
            return (
              <div
                key={index}
                className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-amber-400/30 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-medium">{feature.stat}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function HowItWorks({ messages }: { messages: HomeMessages }) {
  return (
    <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.how.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {messages.how.headingPrefix} <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.how.headingHighlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.how.steps.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl font-black text-slate-100 dark:text-slate-700 group-hover:text-amber-100 dark:group-hover:text-amber-500/20 transition-colors absolute top-6 right-6">
                {item.step}
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection({ messages }: { messages: HomeMessages }) {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.testimonials.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {messages.testimonials.headingPrefix} <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.testimonials.headingHighlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {messages.testimonials.expectations.map((item, index) => (
            <div
              key={index}
              className="group bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500"
            >
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{item.title}</p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
