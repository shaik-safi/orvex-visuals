"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  ArrowRight,
  Check,
  Star,
  Shield,
  Clock,
  MapPin,
  ChevronDown,
  Calculator,
} from "lucide-react"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import type { AppLocale } from "@/lib/i18n/config"
import { useLocaleSync } from "@/lib/i18n/locale-sync"
import { getLocalizedServiceDetail, getLocalizedServiceName, getServiceClassification, type ServiceDetail, type ServiceClassification } from "../data"
import { PACKAGES, computePackagePrice, PHOTO_DELIVERY_DAYS, getWhatsAppLink } from "@/lib/constants"
import { resolvePresetCoverageProfile, COVERAGE_PROFILES } from "@/lib/pricing-presets"
import { applyTemplate } from "@/lib/i18n/home"
import { getPageMessages } from "@/lib/i18n/pages"
import { withLocaleHref, withLocalePathname } from "@/lib/i18n/routing"
import { buildPricingHandoffHref } from "@/lib/pricing-handoff"

type ServiceDetailMessages = ReturnType<typeof getPageMessages>["serviceDetailPage"]

function ServiceHero({ service, routeLocale, messages, classification }: { service: ServiceDetail; routeLocale: AppLocale; messages: ServiceDetailMessages; classification: ServiceClassification }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const Icon = service.icon

  return (
    <section className="relative pt-28 pb-12 sm:pt-32 md:pt-36 md:pb-16 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={service.heroImage} alt={service.name} fill className="object-cover" sizes="100vw" priority quality={75} placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTI5M2IiLz48L3N2Zz4=" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
      </div>

      <div ref={ref} className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
          <Link href={withLocalePathname("/", routeLocale)} className="hover:text-white transition-colors">{messages.breadcrumbs.home}</Link>
          <span>/</span>
          <Link href={withLocalePathname("/services", routeLocale)} className="hover:text-white transition-colors">{messages.breadcrumbs.services}</Link>
          <span>/</span>
          <span className="text-amber-400">{service.name}</span>
        </div>

        <div className="w-16 h-16 bg-amber-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
          <Icon className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.95] mb-4">
          {service.name}
        </h1>
        <p className="text-lg md:text-xl text-amber-300 font-medium mb-3">{service.tagline}</p>
        <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg">{service.description}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {classification.role === "parent" && (
            <>
              <Link
                href={withLocaleHref(buildPricingHandoffHref({ from: "service", source: service.name, service: service.slug, intent: "availability", scrollToBuilder: true }), routeLocale)}
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5"
              >
                {messages.hero.checkPricing}
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#coverage"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white/10 px-7 py-3.5 rounded-2xl font-semibold transition-colors duration-300"
              >
                {messages.hero.viewPackages} <ArrowRight size={16} />
              </a>
            </>
          )}
          {classification.role === "variant" && (classification.parentSlugs?.length ?? 0) === 1 && (
            <>
              <Link
                href={withLocalePathname(`/services/${classification.parentSlugs![0]}`, routeLocale)}
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5"
              >
                {messages.discovery.viewCoverageTemplate.replace("{name}", getLocalizedServiceName(classification.parentSlugs![0], routeLocale))}
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={withLocaleHref(buildPricingHandoffHref({ from: "service", source: service.name, service: classification.parentSlugs![0], intent: "availability", scrollToBuilder: true }), routeLocale)}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white/10 px-7 py-3.5 rounded-2xl font-semibold transition-colors duration-300"
              >
                {messages.hero.checkPricing} <ArrowRight size={16} />
              </Link>
            </>
          )}
          {classification.role === "variant" && (classification.parentSlugs?.length ?? 0) > 1 && (
            <>
              <a
                href="#coverage-options"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5"
              >
                {messages.discovery.viewRelatedCoverage}
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href={getWhatsAppLink(applyTemplate(messages.cta.whatsappTemplate, { service: service.name }))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white/10 px-7 py-3.5 rounded-2xl font-semibold transition-colors duration-300"
              >
                <MessageCircle size={16} /> {messages.cta.whatsapp}
              </a>
            </>
          )}
          {classification.role === "ancillary" && (
            <>
              <a
                href={getWhatsAppLink(applyTemplate(messages.discovery.ancillaryWhatsappTemplate, { service: service.name }))}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5"
              >
                <MessageCircle size={18} /> {messages.cta.whatsapp}
              </a>
              <Link
                href={withLocalePathname("/contact", routeLocale)}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white/10 px-7 py-3.5 rounded-2xl font-semibold transition-colors duration-300"
              >
                {messages.discovery.contactUs} <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
          <span className="flex items-center gap-1.5"><Shield size={14} className="text-green-400" /> {messages.hero.badgeGst}</span>
          {classification.role !== "ancillary" && (
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> {messages.hero.badgeDeliveryTemplate.replace("{PHOTO_DELIVERY_DAYS}", String(PHOTO_DELIVERY_DAYS))}</span>
          )}
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-400" /> {messages.hero.badgeArea}</span>
          {classification.role !== "ancillary" && (
            <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400" /> {messages.hero.badgeSummary}</span>
          )}
        </div>
      </div>
    </section>
  )
}

function OverviewSection({ service, messages }: { service: ServiceDetail; messages: ServiceDetailMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 items-start lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              {messages.overview.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {messages.overview.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
              {service.longDescription}
            </p>

            <div className="space-y-3">
              {service.includes.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/5 p-4 text-sm text-slate-600 dark:text-slate-300">
              {messages.overview.note}
            </div>
            {service.gallery.map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 h-48" : "h-32"}`}>
                <Image src={img} alt={applyTemplate(messages.overview.galleryAltTemplate, { service: service.name, index: String(i + 1) })} width={i === 0 ? 600 : 300} height={i === 0 ? 400 : 200} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" sizes="(max-width: 640px) 100vw, 50vw" loading="lazy" quality={75} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CoverageEstimatesSection({ service, routeLocale, messages }: { service: ServiceDetail; routeLocale: AppLocale; messages: ServiceDetailMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const coverageProfileMessages = getPageMessages(routeLocale).pricingPage.coverageProfiles
  return (
    <section id="coverage" ref={ref} className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.coverageEstimates.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {messages.coverageEstimates.titleTemplate.replace("{service}", service.name)}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {messages.coverageEstimates.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg) => {
            const total = computePackagePrice(pkg)
            const profileId = resolvePresetCoverageProfile(pkg.builderPreset.events)
            const profile = profileId ? COVERAGE_PROFILES[profileId] : null
            const profileCopy = profile ? coverageProfileMessages[profile.messageKey as keyof typeof coverageProfileMessages] : null
            return (
              <div
                key={pkg.name}
                className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                  pkg.popular
                    ? "bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/15"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-amber-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {messages.packages.mostPopular}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  {profileCopy && (
                    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${pkg.popular ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                      {profileCopy.label}
                    </span>
                  )}
                  <h3 className={`text-lg font-bold mb-1 ${pkg.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${pkg.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      &#8377;{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {profileCopy ? (
                    <>
                      <p className={`text-sm mt-2 leading-relaxed ${pkg.popular ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                        {profileCopy.summary}
                      </p>
                      <p className={`text-xs mt-1 font-medium ${pkg.popular ? "text-white/70" : "text-slate-400 dark:text-slate-500"}`}>
                        {profileCopy.crewLabel}
                      </p>
                    </>
                  ) : (
                    <p className={`text-sm mt-2 leading-relaxed ${pkg.popular ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                      {pkg.name}
                    </p>
                  )}
                </div>

                <Link
                  href={withLocaleHref(buildPricingHandoffHref({ from: "service", source: service.name, service: service.slug, packageName: pkg.name, intent: "availability", scrollToBuilder: true }), routeLocale)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-colors duration-300 ${
                    pkg.popular
                      ? "bg-white text-amber-600 hover:bg-amber-50"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }`}
                >
                  <Calculator size={14} />
                  {messages.coverageEstimates.getEstimate}
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{messages.coverageEstimates.customizeNote}</p>
          <Link
            href={withLocaleHref(buildPricingHandoffHref({ from: "service", source: service.name, service: service.slug, intent: "custom-package", scrollToBuilder: true }), routeLocale)}
            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            {messages.coverageEstimates.buildCustom} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function VariantDiscoverySection({
  service,
  routeLocale,
  messages,
  classification,
}: {
  service: ServiceDetail
  routeLocale: AppLocale
  messages: ServiceDetailMessages
  classification: ServiceClassification
}) {
  const { ref, isVisible } = useScrollReveal()
  const parentSlugs = classification.parentSlugs ?? []
  const isSingleParent = parentSlugs.length === 1

  return (
    <section
      id="coverage-options"
      ref={ref}
      className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          {messages.discovery.variantBadge}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {isSingleParent ? messages.discovery.variantBridgeTitle : messages.discovery.multiParentBridgeTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10">
          {isSingleParent
            ? messages.discovery.variantBridgeNote.replace("{parent}", getLocalizedServiceName(parentSlugs[0], routeLocale))
            : messages.discovery.multiParentBridgeNote}
        </p>
        <div className={`grid gap-4 ${isSingleParent ? "max-w-sm mx-auto" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {parentSlugs.map((parentSlug) => {
            const parentName = getLocalizedServiceName(parentSlug, routeLocale)
            return (
              <Link
                key={parentSlug}
                href={withLocalePathname(`/services/${parentSlug}`, routeLocale)}
                className="group flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-left">
                  {messages.discovery.viewCoverageTemplate.replace("{name}", parentName)}
                </span>
                <ArrowRight size={16} className="text-amber-500 flex-shrink-0 ml-3" />
              </Link>
            )
          })}
        </div>
        {isSingleParent && (
          <div className="mt-8">
            <Link
              href={withLocaleHref(
                buildPricingHandoffHref({ from: "service", source: service.name, service: parentSlugs[0], intent: "availability", scrollToBuilder: true }),
                routeLocale
              )}
              className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              {messages.packages.buildCustom} <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function AncillaryCTASection({
  service,
  routeLocale,
  messages,
}: {
  service: ServiceDetail
  routeLocale: AppLocale
  messages: ServiceDetailMessages
}) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section
      ref={ref}
      className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          {messages.discovery.ancillaryBadge}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {messages.discovery.ancillaryBridgeTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {messages.discovery.ancillaryBridgeNote}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getWhatsAppLink(applyTemplate(messages.discovery.ancillaryWhatsappTemplate, { service: service.name }))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5"
          >
            <MessageCircle size={18} /> {messages.cta.whatsapp}
          </a>
          <Link
            href={withLocalePathname("/contact", routeLocale)}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-amber-300 dark:hover:border-amber-500/40 px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            {messages.discovery.contactUs} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProcessSection({ service, messages }: { service: ServiceDetail; messages: ServiceDetailMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.process.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            {messages.process.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {service.process.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 h-full">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-2">{step.step}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection({ service, messages }: { service: ServiceDetail; messages: ServiceDetailMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.faq.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            {messages.faq.title}
          </h2>
        </div>

        <div className="space-y-3">
          {service.faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-slate-900 dark:text-white font-medium pr-4">{faq.q}</span>
                <ChevronDown size={18} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedServices({ service, routeLocale, messages }: { service: ServiceDetail; routeLocale: AppLocale; messages: ServiceDetailMessages }) {
  const { ref, isVisible } = useScrollReveal()

  const relatedNames = service.relatedSlugs.map((slug) => ({
    slug,
    name: getLocalizedServiceName(slug, routeLocale),
  }))

  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          {messages.related.title}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {relatedNames.map((related) => (
            <Link
              key={related.slug}
              href={withLocalePathname(`/services/${related.slug}`, routeLocale)}
              className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-center"
            >
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {related.name}
              </h3>
              <span className="flex items-center justify-center gap-1 text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">
                {messages.related.learnMore} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCTA({ service, routeLocale, messages, classification }: { service: ServiceDetail; routeLocale: AppLocale; messages: ServiceDetailMessages; classification: ServiceClassification }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 md:py-20 relative overflow-hidden transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.1),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {classification.role === "ancillary"
            ? messages.discovery.ancillaryCtaTitleTemplate.replace("{service}", service.name)
            : messages.cta.titleTemplate.replace("{service}", service.name)}
        </h2>
        <p className="text-slate-400 text-base md:text-lg mb-7 max-w-xl mx-auto leading-relaxed">
          {classification.role === "ancillary" ? messages.discovery.ancillaryCtaDescription : messages.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {(classification.role === "parent" || (classification.role === "variant" && (classification.parentSlugs?.length ?? 0) === 1)) && (
            <Link
              href={withLocaleHref(buildPricingHandoffHref({
                from: "service",
                source: service.name,
                service: classification.role === "parent" ? service.slug : classification.parentSlugs![0],
                intent: "availability",
                scrollToBuilder: true,
              }), routeLocale)}
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5"
            >
              {messages.cta.checkPricing}
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
          <a
            href={getWhatsAppLink(applyTemplate(
              classification.role === "ancillary" ? messages.discovery.ancillaryWhatsappTemplate : messages.cta.whatsappTemplate,
              { service: service.name }
            ))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-7 py-3.5 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle size={18} /> {messages.cta.whatsapp}
          </a>
          {classification.role === "ancillary" && (
            <Link
              href={withLocalePathname("/contact", routeLocale)}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-7 py-3.5 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {messages.discovery.contactUs} <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { routeLocale } = useLocaleSync()
  const messages = getPageMessages(routeLocale).serviceDetailPage
  const { slug } = use(params)
  const service = getLocalizedServiceDetail(slug, routeLocale)
  const classification = getServiceClassification(slug)

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Orvex Visuals",
      url: "https://orvexvisuals.com",
    },
    areaServed: {
      "@type": "City",
      name: routeLocale === "hi" ? "बेंगलुरु" : "Bangalore",
    },
    image: service.heroImage,
    url: `https://orvexvisuals.com${withLocalePathname(`/services/${slug}`, routeLocale)}`,
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServiceHero service={service} routeLocale={routeLocale} messages={messages} classification={classification} />
      <OverviewSection service={service} messages={messages} />
      {classification.role === "parent"
        ? <CoverageEstimatesSection service={service} routeLocale={routeLocale} messages={messages} />
        : classification.role === "variant"
        ? <VariantDiscoverySection service={service} routeLocale={routeLocale} messages={messages} classification={classification} />
        : <AncillaryCTASection service={service} routeLocale={routeLocale} messages={messages} />}
      <ProcessSection service={service} messages={messages} />
      <FAQSection service={service} messages={messages} />
      <RelatedServices service={service} routeLocale={routeLocale} messages={messages} />
      <ServiceCTA service={service} routeLocale={routeLocale} messages={messages} classification={classification} />
    </main>
  )
}
