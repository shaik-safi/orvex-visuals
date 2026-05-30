"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// saveQuote is only called from /book — pricing page sends estimates only
import { BOOKING_PLAN_STORAGE_KEY, PACKAGES, SERVICE_RATES, EVENT_ADDONS, GLOBAL_ADDONS, getWhatsAppLink, WA_MESSAGES, PHONE_NUMBER, computePackagePrice } from "@/lib/constants"
import {
  Camera,
  Video,
  Sparkles,
  Plane,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  Minus,
  Plus,
  Calculator,
  Zap,
  Crown,
  Star,
  Gift,
  Clock,
  Shield,
  Image,
  Film,
  BookOpen,
  MapPin,
  Calendar,
} from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getPageMessages } from "@/lib/i18n/pages"
import { applyTemplate } from "@/lib/i18n/home"
import { withLocalePathname } from "@/lib/i18n/routing"

// ============ DATA ============

const PACKAGE_MESSAGE_KEYS = {
  Starter: "starter",
  Signature: "signature",
  Grand: "grand",
} as const

const TEMPLATE_MESSAGE_KEYS = {
  "Hindu (South Indian)": "hinduSouthIndian",
  "Hindu (North Indian)": "hinduNorthIndian",
  "Muslim Wedding": "muslimWedding",
  "Christian Wedding": "christianWedding",
  "Sikh Wedding": "sikhWedding",
  Engagement: "engagement",
  "Pre-Wedding Shoot": "preWeddingShoot",
  "Baby / Maternity": "babyMaternity",
  "Birthday / Event": "birthdayEvent",
  Housewarming: "housewarming",
  "Corporate Event": "corporateEvent",
} as const

type BuilderPrefillRequest =
  | {
    key: string
    type: "package"
    packageName: string
    sourceLabel: string
    scrollToBuilder?: boolean
  }
  | {
    key: string
    type: "template"
    templateName: string
    sourceLabel: string
    scrollToBuilder?: boolean
  }
  | {
    key: string
    type: "service"
    serviceSlug: string
    serviceName: string
    sourceLabel: string
    scrollToBuilder?: boolean
  }

interface PricingHandoffContext {
  sourceLabel: string
  from: string
  headline: string
  description: string
  prefillLabel?: string
  prefill: BuilderPrefillRequest | null
  prefillKey: string
}

interface ServicePrefillPreset {
  label: string
  events: EventPreset[]
  globalAddOns: Record<string, number>
}

function sanitizeLabel(value: string | null, fallback: string) {
  if (!value) return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed.slice(0, 120) : fallback
}

type PricingMessages = ReturnType<typeof getPageMessages>["pricingPage"]

interface StartingPointState {
  label: string
  type: "package" | "setup"
}

interface SelectedOptionalItem {
  key: string
  label: string
  price: number
}

type PackageIdentifier = keyof typeof PACKAGE_MESSAGE_KEYS

function getServicePrefill(serviceSlug: string, serviceName: string, messages: PricingMessages): ServicePrefillPreset | null {
  const lookup = `${serviceSlug} ${serviceName}`.toLowerCase()
  const label = applyTemplate(messages.handoff.suggestedSetup, { service: serviceName })

  if (lookup.includes("pre-wedding") || lookup.includes("post-wedding") || lookup.includes("engagement") || lookup.includes("anniversary")) {
    return {
      label,
      events: [
        {
          name: serviceName,
          duration: "Half Day" as const,
          services: { "candid-photo": 1 },
          addOns: lookup.includes("pre-wedding") || lookup.includes("post-wedding") ? { drone: 1 } : {},
        },
      ],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("baby") || lookup.includes("maternity") || lookup.includes("newborn")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Half Day" as const, services: { "candid-photo": 1 }, addOns: {} }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("corporate") || lookup.includes("conference") || lookup.includes("seminar") || lookup.includes("award")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Full Day" as const, services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("housewarming")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Half Day" as const, services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("birthday") || lookup.includes("naming") || lookup.includes("cradle") || lookup.includes("haldi") || lookup.includes("mehendi") || lookup.includes("sangeet") || lookup.includes("event")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Half Day" as const, services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("cinematic") || lookup.includes("videography") || lookup.includes("video")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Half Day" as const, services: { [lookup.includes("cinematic") ? "cinematic-video" : "traditional-video"]: 1 }, addOns: {} }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("drone")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Half Day" as const, services: { "candid-photo": 1 }, addOns: { drone: 1 } }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("portrait") || lookup.includes("portfolio") || lookup.includes("studio") || lookup.includes("product")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Half Day" as const, services: { "traditional-photo": 1 }, addOns: {} }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  if (lookup.includes("wedding")) {
    return {
      label,
      events: [{ name: serviceName, duration: "Full Day" as const, services: { "traditional-photo": 1, "candid-photo": 1 }, addOns: {} }],
      globalAddOns: {} as Record<string, number>,
    }
  }

  return null
}

function getPricingHandoff(searchParams: ReturnType<typeof useSearchParams>, messages: PricingMessages): PricingHandoffContext | null {
  const from = searchParams.get("from")
  if (!from) return null

  const sourceLabel = sanitizeLabel(searchParams.get("source"), messages.handoff.defaultSource)
  const intent = searchParams.get("intent") || "availability"
  const packageName = searchParams.get("package")
  const templateName = searchParams.get("template")
  const serviceSlug = searchParams.get("service")
  const eventTemplates = getEventTemplates(messages)

  let prefill: BuilderPrefillRequest | null = null
  let prefillLabel = ""

  if (packageName && PACKAGES.some((pkg) => pkg.name === packageName)) {
    prefill = {
      key: `package:${packageName}`,
      type: "package",
      packageName,
      sourceLabel,
      scrollToBuilder: false,
    }
    prefillLabel = applyTemplate(messages.handoff.packageSelected, {
      name: getPackageContent(packageName as PackageIdentifier, messages).name,
    })
  } else if (templateName && templateName in eventTemplates) {
    prefill = {
      key: `template:${templateName}`,
      type: "template",
      templateName,
      sourceLabel,
      scrollToBuilder: false,
    }
    prefillLabel = applyTemplate(messages.handoff.templateSelected, { name: eventTemplates[templateName].label })
  } else if (serviceSlug) {
    prefill = {
      key: `service:${serviceSlug}:${sourceLabel}`,
      type: "service",
      serviceSlug,
      serviceName: sourceLabel,
      sourceLabel,
      scrollToBuilder: false,
    }
    const servicePreset = getServicePrefill(serviceSlug, sourceLabel, messages)
    if (servicePreset) prefillLabel = servicePreset.label
  }

  const descriptions: Record<string, string> = {
    booking: messages.handoff.descriptionBooking,
    availability: messages.handoff.descriptionAvailability,
    "custom-package": messages.handoff.descriptionCustom,
    style: messages.handoff.descriptionStyle,
    quote: messages.handoff.descriptionQuote,
  }

  return {
    from,
    sourceLabel,
    headline: prefill ? messages.handoff.headlineReady : messages.handoff.headlineChoose,
    description: descriptions[intent] || descriptions.availability,
    prefillLabel: prefillLabel || undefined,
    prefill,
    prefillKey: `${from}:${sourceLabel}:${intent}:${packageName || ""}:${templateName || ""}:${serviceSlug || ""}`,
  }
}

function PricingHandoffBanner({ handoff, messages }: { handoff: PricingHandoffContext; messages: PricingMessages }) {
  return (
    <section className="pt-2 pb-10 md:pt-14 md:pb-14 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-200/70 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/5 p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
              <MapPin size={12} />
              {applyTemplate(messages.handoff.basedOn, { source: handoff.sourceLabel })}
            </span>
            {handoff.prefillLabel && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                <Sparkles size={12} />
                {handoff.prefillLabel}
              </span>
            )}
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">{handoff.headline}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{handoff.description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:opacity-90"
            >
              {messages.handoff.jumpToBuilder} <ArrowRight size={15} />
            </a>
            <a
              href="#packages"
              className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
            >
              {messages.handoff.seePackagesFirst}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ HERO ============
function PricingHero({ messages }: { messages: PricingMessages }) {
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

// ============ PACKAGES SECTION ============
function PackagesSection({ onCustomize, messages }: { onCustomize?: (packageName: string) => void; messages: PricingMessages }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const packages = getPricingPackages(messages)

  return (
    <section id="packages" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">{messages.packagesSection.badge}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {messages.packagesSection.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-md mx-auto">
            {messages.packagesSection.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon
            return (
              <div
                key={i}
                className={`relative group rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${pkg.popular
                  ? "bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 border border-amber-300 dark:border-amber-500/30 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/5"
                  : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${80 + i * 60}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-amber-500 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {messages.packagesSection.mostPopular}
                    </span>
                  </div>
                )}

                <div className="p-7 md:p-8">
                  <div className="mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${pkg.popular ? "bg-amber-100 dark:bg-amber-500/15" : "bg-slate-100 dark:bg-slate-800"
                      }`}>
                      <Icon className={`w-5 h-5 ${pkg.popular ? "text-amber-500 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pkg.name}</h3>
                    <p className="text-sm text-slate-500">{pkg.subtitle}</p>
                  </div>

                  <div className="mb-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        &#8377;{pkg.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-slate-500">{messages.packagesSection.onwards}</span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">{messages.packagesSection.gstInclusive}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature: string, j: number) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? "text-amber-500 dark:text-amber-400/80" : "text-emerald-500 dark:text-emerald-500/70"}`} />
                        <span className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => onCustomize?.(pkg.id)}
                      className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${pkg.popular
                        ? "bg-amber-500 text-white dark:text-slate-900 hover:bg-amber-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                        }`}
                    >
                      {applyTemplate(messages.packagesSection.startWith, { name: pkg.name })} →
                    </button>
                    <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">{messages.packagesSection.changeAny}</p>
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

// ============ EVENT-BASED PRICING DATA ============

interface ServiceRate {
  id: string
  name: string
  description: string
  icon: any
  ratePerDay: number
  ratePerHalfDay: number
  maxQty: number
  premium?: boolean
}

interface EventAddOn {
  id: string
  name: string
  price: number
  description: string
  icon: any
  perEvent: boolean
  maxQty: number
  premium?: boolean
}

interface EventBlock {
  id: string
  name: string
  duration: "Half Day" | "Full Day"
  services: Record<string, number>
  addOns: Record<string, number>
}

// Pre-fill recommendations per event — services: Record<serviceId, qty>, addOns: Record<addonId, qty>
interface EventPreset {
  name: string
  duration: "Half Day" | "Full Day"
  services: Record<string, number>
  addOns: Record<string, number>
}

interface EventTemplateDefinition {
  label: string
  presets: EventPreset[]
}

function getDisplayLocale(locale: ReturnType<typeof useCurrentLocale>) {
  return locale === "hi" ? "hi-IN" : "en-IN"
}

function formatCurrencyValue(value: number, locale: ReturnType<typeof useCurrentLocale>) {
  return value.toLocaleString(getDisplayLocale(locale))
}

function getPackageContent(packageName: PackageIdentifier, messages: PricingMessages) {
  return messages.packagesSection.items[PACKAGE_MESSAGE_KEYS[packageName]]
}

function getPricingPackages(messages: PricingMessages) {
  return PACKAGES.map((pkg) => {
    const content = getPackageContent(pkg.name as PackageIdentifier, messages)

    return {
      ...pkg,
      id: pkg.name,
      name: content.name,
      subtitle: content.subtitle,
      features: content.features,
      builderPreset: {
        ...pkg.builderPreset,
        events: pkg.builderPreset.events.map((event) => ({
          ...event,
          name: event.name === "Your Event" ? messages.builder.defaultPackageEventName : event.name,
        })),
      },
      price: computePackagePrice(pkg),
      icon: pkg.name === "Starter" ? Star : pkg.name === "Signature" ? Crown : Gift,
      popular: pkg.name === "Signature",
    }
  })
}

function getDurationLabel(duration: EventBlock["duration"], messages: PricingMessages) {
  return duration === "Full Day" ? messages.builder.fullDay : messages.builder.halfDay
}

function getServiceRates(messages: PricingMessages): ServiceRate[] {
  return [
    { id: "traditional-photo", name: messages.builder.serviceCatalog.traditionalPhoto.name, description: messages.builder.serviceCatalog.traditionalPhoto.description, icon: Camera, ratePerDay: SERVICE_RATES["traditional-photo"].ratePerDay, ratePerHalfDay: SERVICE_RATES["traditional-photo"].ratePerHalfDay, maxQty: 3 },
    { id: "candid-photo", name: messages.builder.serviceCatalog.candidPhoto.name, description: messages.builder.serviceCatalog.candidPhoto.description, icon: Camera, ratePerDay: SERVICE_RATES["candid-photo"].ratePerDay, ratePerHalfDay: SERVICE_RATES["candid-photo"].ratePerHalfDay, maxQty: 3 },
    { id: "traditional-video", name: messages.builder.serviceCatalog.traditionalVideo.name, description: messages.builder.serviceCatalog.traditionalVideo.description, icon: Video, ratePerDay: SERVICE_RATES["traditional-video"].ratePerDay, ratePerHalfDay: SERVICE_RATES["traditional-video"].ratePerHalfDay, maxQty: 3 },
    { id: "cinematic-video", name: messages.builder.serviceCatalog.cinematicVideo.name, description: messages.builder.serviceCatalog.cinematicVideo.description, icon: Film, ratePerDay: SERVICE_RATES["cinematic-video"].ratePerDay, ratePerHalfDay: SERVICE_RATES["cinematic-video"].ratePerHalfDay, maxQty: 2, premium: true },
  ]
}

function getEventAddOns(messages: PricingMessages): EventAddOn[] {
  return [
    { id: "drone", name: messages.builder.eventAddOnCatalog.drone.name, price: EVENT_ADDONS.drone.price, description: messages.builder.eventAddOnCatalog.drone.description, icon: Plane, perEvent: true, maxQty: 1, premium: true },
    { id: "led-wall", name: messages.builder.eventAddOnCatalog.ledWall.name, price: EVENT_ADDONS["led-wall"].price, description: messages.builder.eventAddOnCatalog.ledWall.description, icon: Sparkles, perEvent: true, maxQty: 2 },
    { id: "same-day-edit", name: messages.builder.eventAddOnCatalog.sameDayEdit.name, price: EVENT_ADDONS["same-day-edit"].price, description: messages.builder.eventAddOnCatalog.sameDayEdit.description, icon: Zap, perEvent: true, maxQty: 1, premium: true },
    { id: "live-stream", name: messages.builder.eventAddOnCatalog.liveStream.name, price: EVENT_ADDONS["live-stream"].price, description: messages.builder.eventAddOnCatalog.liveStream.description, icon: Video, perEvent: true, maxQty: 1 },
  ]
}

function getGlobalAddOns(messages: PricingMessages): EventAddOn[] {
  return [
    { id: "album-25", name: messages.builder.globalAddOnCatalog.album25.name, price: GLOBAL_ADDONS["album-25"].price, description: messages.builder.globalAddOnCatalog.album25.description, icon: BookOpen, perEvent: false, maxQty: 5 },
    { id: "album-40", name: messages.builder.globalAddOnCatalog.album40.name, price: GLOBAL_ADDONS["album-40"].price, description: messages.builder.globalAddOnCatalog.album40.description, icon: BookOpen, perEvent: false, maxQty: 5 },
  ]
}

function getEventTemplates(messages: PricingMessages): Record<string, EventTemplateDefinition> {
  const templateMessages = messages.builder.templates

  return {
    "Hindu (South Indian)": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Hindu (South Indian)"]].label,
      presets: [
        { name: templateMessages.hinduSouthIndian.events.pellikuthuru, duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.hinduSouthIndian.events.haldiPasupu, duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
        { name: templateMessages.hinduSouthIndian.events.sangeeth, duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.hinduSouthIndian.events.muhurtham, duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
        { name: templateMessages.hinduSouthIndian.events.reception, duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
    "Hindu (North Indian)": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Hindu (North Indian)"]].label,
      presets: [
        { name: templateMessages.hinduNorthIndian.events.roka, duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
        { name: templateMessages.hinduNorthIndian.events.haldi, duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
        { name: templateMessages.hinduNorthIndian.events.mehendi, duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.hinduNorthIndian.events.sangeet, duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.hinduNorthIndian.events.baraatWedding, duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
        { name: templateMessages.hinduNorthIndian.events.reception, duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
    "Muslim Wedding": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Muslim Wedding"]].label,
      presets: [
        { name: templateMessages.muslimWedding.events.haldiUbtan, duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
        { name: templateMessages.muslimWedding.events.mehendi, duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.muslimWedding.events.nikah, duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
        { name: templateMessages.muslimWedding.events.walimaReception, duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
    "Christian Wedding": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Christian Wedding"]].label,
      presets: [
        { name: templateMessages.christianWedding.events.engagement, duration: "Half Day", services: { "candid-photo": 1, "traditional-photo": 1 }, addOns: {} },
        { name: templateMessages.christianWedding.events.churchCeremony, duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
        { name: templateMessages.christianWedding.events.receptionParty, duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
    "Sikh Wedding": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Sikh Wedding"]].label,
      presets: [
        { name: templateMessages.sikhWedding.events.mehendi, duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.sikhWedding.events.anandKaraj, duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
        { name: templateMessages.sikhWedding.events.reception, duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
    Engagement: {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS.Engagement].label,
      presets: [
        { name: templateMessages.engagement.events.ringCeremony, duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.engagement.events.cocktailAfterParty, duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
      ],
    },
    "Pre-Wedding Shoot": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Pre-Wedding Shoot"]].label,
      presets: [
        { name: templateMessages.preWeddingShoot.events.preWeddingPhotoshoot, duration: "Half Day", services: { "candid-photo": 1 }, addOns: { drone: 1 } },
      ],
    },
    "Baby / Maternity": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Baby / Maternity"]].label,
      presets: [
        { name: templateMessages.babyMaternity.events.photoshootSession, duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
      ],
    },
    "Birthday / Event": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Birthday / Event"]].label,
      presets: [
        { name: templateMessages.birthdayEvent.events.eventCoverage, duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
    Housewarming: {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS.Housewarming].label,
      presets: [
        { name: templateMessages.housewarming.events.housewarming, duration: "Half Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
    "Corporate Event": {
      label: templateMessages[TEMPLATE_MESSAGE_KEYS["Corporate Event"]].label,
      presets: [
        { name: templateMessages.corporateEvent.events.conferenceSeminar, duration: "Full Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
        { name: templateMessages.corporateEvent.events.awardCeremony, duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      ],
    },
  }
}

// Package-to-builder presets are now sourced from PACKAGES[].builderPreset in constants.ts

function generateEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ============ INTERACTIVE PRICE CALCULATOR ============
function PriceCalculator({
  prefill,
  handoff,
  locale,
  messages,
}: {
  prefill?: BuilderPrefillRequest | null
  handoff?: PricingHandoffContext | null
  locale: ReturnType<typeof useCurrentLocale>
  messages: PricingMessages
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const router = useRouter()
  const serviceRates = getServiceRates(messages)
  const eventAddOns = getEventAddOns(messages)
  const globalAddOns = getGlobalAddOns(messages)
  const eventTemplates = getEventTemplates(messages)
  const packages = getPricingPackages(messages)
  const [events, setEvents] = useState<EventBlock[]>([])
  const [globalAddOnQty, setGlobalAddOnQty] = useState<Record<string, number>>({})
  const [showTemplates, setShowTemplates] = useState(false)
  const [showGlobalAddOns, setShowGlobalAddOns] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<string[]>([])
  const [expandedEventAddOns, setExpandedEventAddOns] = useState<string[]>([])
  // Track active package — when set, we show the package's fixed price
  const [activePackage, setActivePackage] = useState<string | null>(null)
  const [startingPoint, setStartingPoint] = useState<StartingPointState | null>(null)

  // Event metadata
  const [eventDate, setEventDate] = useState("")
  const [eventCity, setEventCity] = useState("")
  const [venueName, setVenueName] = useState("")

  // Customer info
  const [isSubmitting, setIsSubmitting] = useState(false)

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0]

  const calculatorRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const applyEventPresets = (
    presets: EventPreset[],
    globalAddOns: Record<string, number> = {},
    packageName?: string | null,
    scrollToBuilder = false,
    nextStartingPoint?: StartingPointState | null,
  ) => {
    const newEvents = presets.map((preset) => ({
      id: generateEventId(),
      name: preset.name,
      duration: preset.duration as "Half Day" | "Full Day",
      services: { ...preset.services } as Record<string, number>,
      addOns: { ...preset.addOns } as Record<string, number>,
    }))
    setEvents(newEvents)
    setExpandedEvents(newEvents[0] ? [newEvents[0].id] : [])
    setExpandedEventAddOns([])
    setGlobalAddOnQty({ ...globalAddOns })
    setShowGlobalAddOns(false)
    setActivePackage(packageName || null)
    setStartingPoint(nextStartingPoint ?? (packageName ? { label: packageName, type: "package" } : null))
    setShowTemplates(false)
    if (scrollToBuilder) {
      setTimeout(() => calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    }
  }

  // Pre-fill from pricing handoff or package clicks.
  useEffect(() => {
    if (!prefill) return

    if (prefill.type === "package") {
      const pkg = packages.find((item) => item.id === prefill.packageName)
      if (!pkg || !pkg.builderPreset) return
      applyEventPresets(
        pkg.builderPreset.events,
        pkg.builderPreset.globalAddOns as Record<string, number>,
        pkg.id,
        prefill.scrollToBuilder,
        { label: pkg.name, type: "package" }
      )
      return
    }

    if (prefill.type === "template") {
      const templateDefinition = eventTemplates[prefill.templateName]
      if (!templateDefinition) return
      applyEventPresets(templateDefinition.presets, {}, null, prefill.scrollToBuilder, { label: templateDefinition.label, type: "setup" })
      return
    }

    if (prefill.type === "service") {
      const servicePreset = getServicePrefill(prefill.serviceSlug, prefill.serviceName, messages)
      if (!servicePreset) return
      applyEventPresets(servicePreset.events, servicePreset.globalAddOns, null, prefill.scrollToBuilder, {
        label: prefill.serviceName,
        type: "setup",
      })
    }
  }, [eventTemplates, packages, prefill, messages])

  const addEvent = (name: string) => {
    const newEvent: EventBlock = {
      id: generateEventId(),
      name,
      duration: "Full Day",
      services: {},
      addOns: {},
    }
    setEvents((prev) => [...prev, newEvent])
    setExpandedEvents([newEvent.id])
    setExpandedEventAddOns([])
    setShowTemplates(false)
    setActivePackage(null)
    if (events.length === 0) setStartingPoint(null)
  }

  const addFromTemplate = (templateName: string) => {
    const templateDefinition = eventTemplates[templateName]
    if (!templateDefinition) return
    applyEventPresets(templateDefinition.presets, {}, null, false, { label: templateDefinition.label, type: "setup" })
  }

  const removeEvent = (id: string) => {
    const remainingEvents = events.filter((event) => event.id !== id)
    setEvents(remainingEvents)
    setExpandedEvents((prev) => {
      const nextExpanded = prev.filter((eid) => eid !== id && remainingEvents.some((event) => event.id === eid))
      return nextExpanded.length > 0 ? nextExpanded : remainingEvents[0] ? [remainingEvents[0].id] : []
    })
    setExpandedEventAddOns((prev) => prev.filter((eid) => eid !== id))
    if (remainingEvents.length === 0) {
      setShowTemplates(true)
      setShowGlobalAddOns(false)
      setStartingPoint(null)
    }
    setActivePackage(null)
  }

  const updateEventName = (id: string, name: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, name } : e)))
  }

  const updateEventDuration = (id: string, duration: "Half Day" | "Full Day") => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, duration } : e)))
    setActivePackage(null)
  }

  const updateEventService = (eventId: string, serviceId: string, delta: number) => {
    const service = serviceRates.find((s) => s.id === serviceId)
    if (!service) return
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const current = e.services[serviceId] || 0
        const next = Math.max(0, Math.min(service.maxQty, current + delta))
        const newServices = { ...e.services }
        if (next === 0) delete newServices[serviceId]
        else newServices[serviceId] = next
        return { ...e, services: newServices }
      })
    )
    setActivePackage(null)
  }

  const updateEventAddOn = (eventId: string, addOnId: string, delta: number) => {
    const addon = eventAddOns.find((a) => a.id === addOnId)
    if (!addon) return
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const current = e.addOns[addOnId] || 0
        const next = Math.max(0, Math.min(addon.maxQty, current + delta))
        const newAddOns = { ...e.addOns }
        if (next === 0) delete newAddOns[addOnId]
        else newAddOns[addOnId] = next
        return { ...e, addOns: newAddOns }
      })
    )
    setActivePackage(null)
  }

  const updateGlobalAddOn = (id: string, delta: number) => {
    const addon = globalAddOns.find((a) => a.id === id)
    if (!addon) return
    setGlobalAddOnQty((prev) => {
      const current = prev[id] || 0
      const next = Math.max(0, Math.min(addon.maxQty, current + delta))
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
    setActivePackage(null)
  }

  const toggleExpandEvent = (id: string) => {
    setExpandedEvents((prev) => (prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]))
  }

  const toggleEventAddOns = (id: string) => {
    setExpandedEventAddOns((prev) => (prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]))
  }

  const getEventPrice = (event: EventBlock) => {
    let total = 0
    for (const [serviceId, qty] of Object.entries(event.services)) {
      const service = serviceRates.find((s) => s.id === serviceId)
      if (!service) continue
      const rate = event.duration === "Full Day" ? service.ratePerDay : service.ratePerHalfDay
      total += rate * qty
    }
    for (const [addOnId, qty] of Object.entries(event.addOns)) {
      const addon = eventAddOns.find((a) => a.id === addOnId)
      if (!addon) continue
      total += addon.price * qty
    }
    return total
  }

  const eventsTotal = events.reduce((sum, event) => sum + getEventPrice(event), 0)
  const globalAddOnTotal = Object.entries(globalAddOnQty).reduce((sum, [id, qty]) => {
    const addon = globalAddOns.find((a) => a.id === id)
    return sum + (addon?.price || 0) * qty
  }, 0)
  const totalPrice = eventsTotal + globalAddOnTotal

  // Active package data (for badge display — price is always computed from rates)
  const activePackageData = activePackage ? packages.find((p) => p.id === activePackage) : null
  const hasContent = events.length > 0

  const configuredEvents = events.filter((e) => Object.keys(e.services).length > 0)
  const hasConfiguredEvents = configuredEvents.length > 0
  const selectedGlobalAddOnCount = Object.values(globalAddOnQty).filter((qty) => qty > 0).length
  const selectedOptionalItems: SelectedOptionalItem[] = [
    ...events
      .flatMap((event) =>
        Object.entries(event.addOns)
          .filter(([, qty]) => qty > 0)
          .map(([id, qty]) => {
            const addon = eventAddOns.find((item) => item.id === id)
            return addon
              ? {
                key: `${event.id}:${id}`,
                label: `${event.name}: ${addon.name}${qty > 1 ? ` ×${qty}` : ""}`,
                price: addon.price * qty,
              }
              : null
          })
      )
      .filter((item): item is SelectedOptionalItem => item !== null),
    ...Object.entries(globalAddOnQty)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const addon = globalAddOns.find((item) => item.id === id)
        return addon
          ? {
            key: `global:${id}`,
            label: `${addon.name}${qty > 1 ? ` ×${qty}` : ""}`,
            price: addon.price * qty,
          }
          : null
      })
      .filter((item): item is SelectedOptionalItem => item !== null),
  ]
  const selectedOptionalCount = selectedOptionalItems.length
  const visibleOptionalItems = selectedOptionalItems.slice(0, 3)
  const hiddenOptionalCount = Math.max(0, selectedOptionalItems.length - visibleOptionalItems.length)
  const summaryTrustSignals = [
    { icon: Shield, text: messages.builder.trustSignals[0] },
    { icon: CheckCircle2, text: messages.builder.trustSignals[2] },
  ]
  const selectedStartingPointText = startingPoint
    ? applyTemplate(
      startingPoint.type === "package"
        ? messages.builder.selectedStartingPointPackage
        : messages.builder.selectedStartingPointSetup,
      { name: startingPoint.label }
    )
    : null

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString(getDisplayLocale(locale), { day: "numeric", month: "short", year: "numeric" })
  }

  const generateWhatsAppMessage = () => {
    if (!hasConfiguredEvents) return ""

    const lines: string[] = []
    lines.push(messages.builder.whatsapp.start)
    lines.push("")
    if (activePackage) {
      lines.push(applyTemplate(messages.builder.whatsapp.packageLine, {
        name: activePackageData?.name || activePackage,
        total: formatCurrencyValue(totalPrice, locale),
      }))
    } else {
      lines.push(messages.builder.whatsapp.eventsIntro)
    }
    lines.push("")

    if (eventDate) lines.push(applyTemplate(messages.builder.whatsapp.date, { value: formatDate(eventDate) }))
    if (eventCity) {
      lines.push(
        applyTemplate(messages.builder.whatsapp.location, {
          value: `${eventCity}${venueName ? ` - ${venueName}` : ""}`,
        })
      )
    }
    if (eventDate || eventCity) lines.push("")

    configuredEvents.forEach((event, idx) => {
      lines.push(
        applyTemplate(messages.builder.whatsapp.eventLine, {
          index: String(idx + 1),
          name: event.name,
          duration: getDurationLabel(event.duration, messages),
        })
      )
      for (const [sid, qty] of Object.entries(event.services)) {
        const s = serviceRates.find((sr) => sr.id === sid)
        if (s) {
          lines.push(
            applyTemplate(messages.builder.whatsapp.selectionLine, {
              name: s.name,
              qty: String(qty),
            })
          )
        }
      }
      for (const [aid, qty] of Object.entries(event.addOns)) {
        const a = eventAddOns.find((ao) => ao.id === aid)
        if (a) {
          lines.push(
            applyTemplate(messages.builder.whatsapp.selectionLine, {
              name: a.name,
              qty: String(qty),
            })
          )
        }
      }
      lines.push(
        applyTemplate(messages.builder.whatsapp.subtotal, {
          value: formatCurrencyValue(getEventPrice(event), locale),
        })
      )
      lines.push("")
    })

    const globalLines = Object.entries(globalAddOnQty)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const a = globalAddOns.find((ao) => ao.id === id)
        return a
          ? applyTemplate(messages.builder.whatsapp.extraLine, {
            name: a.name,
            qty: qty > 1 ? ` x${qty}` : "",
            value: formatCurrencyValue(a.price * qty, locale),
          })
          : null
      })
      .filter(Boolean)

    if (globalLines.length > 0) {
      lines.push(messages.builder.whatsapp.extrasTitle)
      lines.push(...(globalLines as string[]))
      lines.push("")
    }

    lines.push(applyTemplate(messages.builder.whatsapp.total, { value: formatCurrencyValue(totalPrice, locale) }))
    lines.push("")

    lines.push(messages.builder.whatsapp.confirm)

    return encodeURIComponent(lines.join("\n"))
  }

  const buildBookingPlan = () => {
    return {
      services: configuredEvents.map((event) => ({
        name: event.name,
        coverage: event.duration,
        price: getEventPrice(event),
        selections: [
          ...Object.entries(event.services)
            .filter(([, qty]) => qty > 0)
            .map(([id, qty]) => {
              const s = serviceRates.find((item) => item.id === id)
              if (!s) return null
              const unitPrice = event.duration === "Full Day" ? s.ratePerDay : s.ratePerHalfDay
              return { name: s.name, qty, unitPrice }
            })
            .filter(Boolean),
          ...Object.entries(event.addOns)
            .filter(([, qty]) => qty > 0)
            .map(([id, qty]) => {
              const a = eventAddOns.find((item) => item.id === id)
              return a ? { name: a.name, qty, unitPrice: a.price } : null
            })
            .filter(Boolean),
        ],
      })),
      addOns: Object.entries(globalAddOnQty)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const addon = globalAddOns.find((a) => a.id === id)
          return { name: addon?.name, qty, price: (addon?.price || 0) * qty }
        }),
      total: totalPrice,
      packageName: activePackage || undefined,
      date: eventDate,
      city: eventCity,
      venue: venueName,
    }
  }

  const handleProceedToBook = () => {
    if (!hasConfiguredEvents) return

    const plan = buildBookingPlan()
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(BOOKING_PLAN_STORAGE_KEY, JSON.stringify(plan))
    }
    router.push(withLocalePathname("/book", locale))
  }

  const handleSendEstimate = () => {
    if (!hasConfiguredEvents) return
    setIsSubmitting(true)
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${generateWhatsAppMessage()}`, '_blank')
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  const renderMobileEstimateAnchor = () => {
    if (!hasContent) return null

    return (
      <div className="lg:hidden">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">{messages.builder.summaryTitle}</p>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">₹{formatCurrencyValue(totalPrice, locale)}</div>
              <p className="text-[11px] text-emerald-500 dark:text-emerald-400/80 mt-1">{messages.builder.gstInclusive}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Calculator size={16} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/70 px-3 py-1 text-[11px] text-slate-500 dark:text-slate-400">
              {applyTemplate(messages.builder.summaryEventCount, { count: String(events.length) })}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/70 px-3 py-1 text-[11px] text-slate-500 dark:text-slate-400">
              {selectedOptionalCount > 0
                ? applyTemplate(messages.builder.summaryOptionalSelected, { count: String(selectedOptionalCount) })
                : messages.builder.summaryOptionalNone}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{messages.builder.summaryLiveLabel}</p>
        </div>
      </div>
    )
  }

  return (
    <section id="calculator" ref={calculatorRef} className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[min(82vw,50rem)] w-[min(82vw,50rem)] bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">{messages.builder.badge}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {messages.builder.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
            {messages.builder.description}
          </p>
          {handoff && (
            <div className="mt-6 max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-left shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400 mb-2">{messages.builder.suggestedTitle}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{applyTemplate(messages.builder.suggestedDescription, { source: handoff.sourceLabel })}</p>
              {handoff.prefillLabel && (
                <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">{applyTemplate(messages.builder.suggestedLabelSuffix, { label: handoff.prefillLabel })}</p>
              )}
            </div>
          )}
          {hasContent && selectedStartingPointText && (
            <div className="mt-6 max-w-2xl mx-auto rounded-2xl border border-amber-200/70 dark:border-amber-500/20 bg-white dark:bg-slate-900 px-5 py-4 text-left shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400 mb-2">{messages.builder.selectedStartingPointLabel}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedStartingPointText}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{messages.builder.selectedStartingPointHint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplates((prev) => !prev)}
                  className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  {showTemplates ? messages.builder.hideStartingPointOptions : messages.builder.changeStartingPoint}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Event Builder */}
          <div className="lg:col-span-2 space-y-8">

            {/* Event Details */}
            <div className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "60ms" }}>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">{messages.builder.eventDetailsTitle}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{messages.builder.eventDetailsHint}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={eventDate}
                    min={todayStr}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white focus:border-amber-500/50 focus:outline-none transition-colors dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                    placeholder={messages.builder.placeholders.city}
                  />
                </div>
                <div className="relative sm:col-span-2">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                    placeholder={messages.builder.placeholders.venue}
                  />
                </div>
              </div>
            </div>

            {renderMobileEstimateAnchor()}

            {/* Step 1: Add Events */}
            <div className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "100ms" }}>
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{messages.builder.yourEvents}</p>
                <div className="flex items-center gap-3">
                  {events.length > 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">{applyTemplate(messages.builder.eventCount, { count: String(events.length) })}</span>
                  )}
                  {events.length > 0 && !selectedStartingPointText && (
                    <button
                      type="button"
                      onClick={() => setShowTemplates((prev) => !prev)}
                      className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {showTemplates ? messages.builder.hideStartingPointOptions : messages.builder.changeStartingPoint}
                    </button>
                  )}
                </div>
              </div>

              {/* Template selector */}
              <div className="mb-4">
                {!hasContent && (
                  <button
                    type="button"
                    onClick={() => setShowTemplates((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-amber-400 dark:hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                  >
                    <Sparkles size={14} />
                    {messages.builder.pickEventType}
                    <ChevronDown size={12} className={`transition-transform ${showTemplates ? "rotate-180" : ""}`} />
                  </button>
                )}

                {showTemplates && (
                  <div className={`mt-3 ${hasContent ? "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4" : ""}`}>
                    {hasContent && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{messages.builder.changeEventType}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{messages.builder.replaceSelectionHint}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(eventTemplates).map(([template, definition]) => (
                        <button
                          key={template}
                          onClick={() => addFromTemplate(template)}
                          className="px-3.5 py-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                        >
                          <span className="text-xs font-medium block">{definition.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{applyTemplate(messages.builder.templateCount, { count: String(definition.presets.length) })}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add custom event */}
              <button
                onClick={() => addEvent(messages.builder.newEventName)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-400 dark:hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all text-sm font-medium"
              >
                <Plus size={14} />
                {messages.builder.addEventDay}
              </button>
            </div>

            {/* Event Blocks */}
            {events.length > 0 && (
              <div className="space-y-3">
                {events.map((event, eventIndex) => {
                  const isExpanded = expandedEvents.includes(event.id)
                  const isAddOnsExpanded = expandedEventAddOns.includes(event.id)
                  const eventPrice = getEventPrice(event)
                  const serviceCount = Object.values(event.services).reduce((a, b) => a + b, 0)
                  const eventAddOnCount = Object.values(event.addOns).filter((qty) => qty > 0).length

                  return (
                    <div key={event.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/50">
                      {/* Event Header */}
                      <div className="flex items-center gap-3 px-5 py-4">
                        <button
                          onClick={() => toggleExpandEvent(event.id)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {eventIndex + 1}
                          </span>
                          <div className="flex-1 min-w-0 text-left">
                            <span className="text-sm font-medium text-slate-900 dark:text-white block truncate">{event.name}</span>
                            <span className="text-xs text-slate-500">
                              {getDurationLabel(event.duration, messages)} - {serviceCount > 0 ? applyTemplate(messages.builder.servicesCount, { count: String(serviceCount) }) : messages.builder.noServicesYet}
                              {eventPrice > 0 && ` - ₹${(eventPrice / 1000).toFixed(0)}K`}
                            </span>
                          </div>
                          <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 text-sm"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Event Detail (expanded) */}
                      {isExpanded && (
                        <div className="px-5 pb-6 space-y-5 border-t border-slate-100 dark:border-slate-800/60 pt-5">
                          {/* Event name + duration */}
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                              type="text"
                              value={event.name}
                              onChange={(e) => updateEventName(event.id, e.target.value)}
                              className="w-full flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-white focus:border-amber-500/50 focus:outline-none transition-colors"
                              placeholder={messages.builder.placeholders.eventName}
                            />
                            <div className="w-full sm:w-auto">
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{messages.builder.coverage}</p>
                              <div className="grid w-full grid-cols-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 sm:flex sm:w-auto md:min-w-[220px]">
                                {([messages.builder.halfDay, messages.builder.fullDay] as const).map((d, index) => (
                                  <button
                                    key={d}
                                    onClick={() => updateEventDuration(event.id, index === 0 ? "Half Day" : "Full Day")}
                                    className={`px-3.5 py-2.5 text-xs font-medium transition-colors md:min-w-[110px] ${event.duration === (index === 0 ? "Half Day" : "Full Day")
                                      ? "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                      : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                      }`}
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Services */}
                          <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{messages.builder.servicesTitle}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">{messages.builder.servicesHint}</p>
                            <div className="space-y-2">
                              {serviceRates.map((service) => {
                                const Icon = service.icon
                                const qty = event.services[service.id] || 0
                                const rate = event.duration === "Full Day" ? service.ratePerDay : service.ratePerHalfDay
                                return (
                                  <div
                                    key={service.id}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${qty > 0
                                      ? "bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15"
                                      : "bg-slate-50 dark:bg-slate-800/30 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                                      }`}
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${qty > 0 ? "bg-amber-100 dark:bg-amber-500/15 text-amber-500 dark:text-amber-400" : "bg-slate-200 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500"
                                      }`}>
                                      <Icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className={`text-sm font-medium block ${qty > 0 ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                        {service.name}
                                        {service.premium && <span className="ml-1.5 text-[10px] text-amber-500 dark:text-amber-400/70 font-normal">{messages.builder.premium}</span>}
                                        {qty > 0 && <span className="ml-1.5 text-[10px] text-emerald-500 dark:text-emerald-400/80 font-normal">{messages.builder.added}</span>}
                                      </span>
                                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block">{service.description}</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">₹{formatCurrencyValue(rate, locale)} / {event.duration === "Full Day" ? messages.builder.rateDay : messages.builder.rateHalfDay}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => updateEventService(event.id, service.id, -1)}
                                        disabled={qty === 0}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                                      >
                                        <Minus size={11} />
                                      </button>
                                      <span className={`w-5 text-center text-sm font-semibold ${qty > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-300 dark:text-slate-600"}`}>{qty}</span>
                                      <button
                                        onClick={() => updateEventService(event.id, service.id, 1)}
                                        disabled={qty >= service.maxQty}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                                      >
                                        <Plus size={11} />
                                      </button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Event-specific add-ons */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleEventAddOns(event.id)}
                              className="w-full flex items-start justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 text-left hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                            >
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{messages.builder.extrasTitle}</p>
                                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                                  {eventAddOnCount > 0
                                    ? applyTemplate(messages.builder.selectedCount, { count: String(eventAddOnCount) })
                                    : messages.builder.optionalClosed}
                                  {" · "}
                                  {messages.builder.eventExtrasHint}
                                </p>
                              </div>
                              <ChevronDown size={14} className={`mt-0.5 text-slate-400 dark:text-slate-500 transition-transform ${isAddOnsExpanded ? "rotate-180" : ""}`} />
                            </button>
                            {isAddOnsExpanded && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {eventAddOns.map((addon) => {
                                  const qty = event.addOns[addon.id] || 0
                                  const Icon = addon.icon
                                  return (
                                    <button
                                      key={addon.id}
                                      onClick={() => updateEventAddOn(event.id, addon.id, qty > 0 ? -1 : 1)}
                                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${qty > 0
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                                        : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                                        }`}
                                    >
                                      <Icon size={12} />
                                      {addon.name}
                                      <span className="opacity-60">₹{(addon.price / 1000).toFixed(0)}K</span>
                                      {qty > 0 && <CheckCircle2 size={11} />}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {events.length > 0 && renderMobileEstimateAnchor()}

            {/* Global Add-ons */}
            {events.length > 0 && (
              <div className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "140ms" }}>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() => setShowGlobalAddOns((prev) => !prev)}
                    className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{messages.builder.globalExtrasTitle}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                        {selectedGlobalAddOnCount > 0
                          ? applyTemplate(messages.builder.selectedCount, { count: String(selectedGlobalAddOnCount) })
                          : messages.builder.optionalClosed}
                        {" · "}
                        {messages.builder.globalExtrasClosedHint}
                      </p>
                    </div>
                    <ChevronDown size={14} className={`mt-1 text-slate-400 dark:text-slate-500 transition-transform ${showGlobalAddOns ? "rotate-180" : ""}`} />
                  </button>
                  {showGlobalAddOns && (
                    <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60">
                      <p className="px-5 pt-4 text-xs text-slate-400 dark:text-slate-500">{messages.builder.globalExtrasHint}</p>
                      {globalAddOns.map((addon) => {
                        const Icon = addon.icon
                        const qty = globalAddOnQty[addon.id] || 0
                        const isSelected = qty > 0
                        return (
                          <div key={addon.id} className={`flex items-center gap-3 px-5 py-4 transition-colors ${isSelected ? "bg-emerald-50/50 dark:bg-emerald-500/[0.03]" : ""}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500"
                              }`}>
                              <Icon size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-medium block ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                {addon.name}
                                {addon.premium && <span className="ml-1.5 text-[10px] text-amber-500 dark:text-amber-400/70 font-normal">{messages.builder.premium}</span>}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500">{addon.description} · ₹{(addon.price / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateGlobalAddOn(addon.id, -1)}
                                disabled={qty === 0}
                                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                              >
                                <Minus size={11} />
                              </button>
                              <span className={`w-5 text-center text-sm font-semibold ${isSelected ? "text-emerald-500 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`}>{qty}</span>
                              <button
                                onClick={() => updateGlobalAddOn(addon.id, 1)}
                                disabled={qty >= addon.maxQty}
                                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Summary Sidebar */}
          <div className="lg:col-span-1" ref={summaryRef}>
            <div className={`sticky top-28 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "120ms" }}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">{messages.builder.summaryTitle}</h3>

                {!hasContent ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Camera size={20} className="text-slate-400 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm">{messages.builder.emptySummaryTitle}</p>
                    <p className="text-slate-400 dark:text-slate-600 text-xs mt-2">{messages.builder.emptySummaryHint}</p>
                  </div>
                ) : (
                  <>
                    {/* Events breakdown */}
                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-medium">{messages.builder.summaryCoverageTitle}</p>
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/70 px-2.5 py-1 text-[10px] text-slate-500 dark:text-slate-400">
                          {applyTemplate(messages.builder.summaryEventCount, { count: String(events.length) })}
                        </span>
                      </div>
                      {events.map((event) => {
                        const price = getEventPrice(event)
                        const selectedServices = Object.entries(event.services)
                          .filter(([, qty]) => qty > 0)
                          .map(([sid, qty]) => {
                            const service = serviceRates.find((sr) => sr.id === sid)
                            return service ? { key: sid, label: `${service.name} ×${qty}` } : null
                          })
                          .filter((item): item is { key: string; label: string } => item !== null)
                        const visibleServices = selectedServices.slice(0, 2)
                        const hiddenServiceCount = Math.max(0, selectedServices.length - visibleServices.length)
                        return (
                          <div key={event.id} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 px-4 py-3">
                            <div className="flex justify-between items-start gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{event.name}</p>
                                  <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{getDurationLabel(event.duration, messages)}</span>
                                </div>
                                {visibleServices.length > 0 ? (
                                  <div className="mt-2 space-y-1">
                                    {visibleServices.map((service) => (
                                      <p key={service.key} className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{service.label}</p>
                                    ))}
                                    {hiddenServiceCount > 0 && (
                                      <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed">
                                        {applyTemplate(messages.builder.summaryMoreServices, { count: String(hiddenServiceCount) })}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="mt-2 text-slate-400 dark:text-slate-500 text-[11px]">{messages.builder.noServicesYet}</p>
                                )}
                              </div>
                              <span className={`text-sm font-semibold ml-3 ${price > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-slate-600 italic text-xs"}`}>
                                {price > 0 ? `₹${(price / 1000).toFixed(0)}K` : messages.builder.summaryPending}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Selected optional additions in summary */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-medium">{messages.builder.summaryOptionalTitle}</p>
                        {selectedOptionalCount > 0 && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/70 px-2.5 py-1 text-[10px] text-slate-500 dark:text-slate-400">
                            {applyTemplate(messages.builder.selectedCount, { count: String(selectedOptionalCount) })}
                          </span>
                        )}
                      </div>
                      {selectedOptionalItems.length > 0 ? (
                        <>
                          {visibleOptionalItems.map((item) => (
                            <div key={item.key} className="flex justify-between items-start gap-3 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/25">
                              <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{item.label}</span>
                              <span className="text-emerald-500 dark:text-emerald-400/80 text-[11px] font-medium whitespace-nowrap">+₹{(item.price / 1000).toFixed(0)}K</span>
                            </div>
                          ))}
                          {hiddenOptionalCount > 0 && (
                            <p className="px-1 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                              {applyTemplate(messages.builder.summaryOptionalMore, { count: String(hiddenOptionalCount) })}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/25 text-sm text-slate-500 dark:text-slate-400">
                          {messages.builder.summaryOptionalNone}
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mb-6">
                      {activePackageData && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg">
                            {applyTemplate(messages.builder.packageBadge, { name: activePackageData.name })}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          {activePackageData ? messages.builder.packageTotal : messages.builder.estimatedTotal}
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            &#8377;{formatCurrencyValue(totalPrice, locale)}
                          </div>
                          <span className="text-emerald-500 dark:text-emerald-400/70 text-[11px]">{messages.builder.gstInclusive}</span>
                        </div>
                      </div>
                      <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 px-4 py-3">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          <Calculator size={12} className="text-amber-500 dark:text-amber-400" />
                          {messages.builder.summaryLiveLabel}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                          {messages.builder.computedNote}
                        </p>
                      </div>
                    </div>



                    {/* CTA Buttons */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{messages.builder.nextStepLabel}</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{hasConfiguredEvents ? messages.builder.nextStepHint : messages.builder.addServiceHint}</p>
                      <div className="mt-4 space-y-2.5">
                        <button
                          type="button"
                          onClick={handleProceedToBook}
                          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${hasConfiguredEvents
                            ? "bg-amber-500 text-white dark:text-slate-900 hover:bg-amber-400 active:scale-[0.98]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                            }`}
                          disabled={!hasConfiguredEvents}
                        >
                          {messages.builder.proceedToBook}
                          <ArrowRight size={13} />
                        </button>
                        <button
                          onClick={handleSendEstimate}
                          disabled={!hasConfiguredEvents || isSubmitting}
                          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm transition-all duration-300 ${hasConfiguredEvents
                            ? "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                            : "border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                            }`}
                        >
                          <MessageCircle size={14} />
                          {isSubmitting ? messages.builder.openingWhatsapp : messages.builder.sendEstimate}
                        </button>
                      </div>
                      <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{messages.builder.estimateNote}</p>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid gap-2">
                      {summaryTrustSignals.map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                          <Icon size={12} className="text-emerald-500 dark:text-emerald-500/60" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ COMPARISON TABLE ============
function ComparisonSection({ messages }: { messages: PricingMessages }) {
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
          {/* Header */}
          <div className="hidden md:grid md:grid-cols-3 bg-slate-100 dark:bg-slate-900">
            <div className="p-4 md:p-5 text-xs font-medium text-slate-500 uppercase tracking-wider">{messages.comparisonSection.columns.feature}</div>
            <div className="p-4 md:p-5 text-xs font-medium text-amber-500 dark:text-amber-400 text-center uppercase tracking-wider">{messages.comparisonSection.columns.orvex}</div>
            <div className="p-4 md:p-5 text-xs font-medium text-slate-400 dark:text-slate-600 text-center uppercase tracking-wider">{messages.comparisonSection.columns.others}</div>
          </div>

          {/* Rows */}
          {comparisons.map((row, i) => (
            <div
              key={i}
              className={`border-t border-slate-200 dark:border-slate-800/60 ${i % 2 === 0 ? "bg-white dark:bg-slate-900/30" : "bg-slate-50 dark:bg-transparent"
                }`}
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

// ============ CTA ============
function PricingCTA({ locale, messages }: { locale: ReturnType<typeof useCurrentLocale>; messages: PricingMessages }) {
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

// ============ MAIN ============
export default function PricingPage() {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).pricingPage
  const searchParams = useSearchParams()
  const handoff = getPricingHandoff(searchParams, messages)
  const [prefillRequest, setPrefillRequest] = useState<BuilderPrefillRequest | null>(handoff?.prefill || null)

  useEffect(() => {
    setPrefillRequest(handoff?.prefill || null)
  }, [handoff?.prefillKey])

  return (
    <main>
      <PricingHero messages={messages} />
      {handoff && <PricingHandoffBanner handoff={handoff} messages={messages} />}
      <PackagesSection
        messages={messages}
        onCustomize={(pkg) =>
          setPrefillRequest({
            key: `manual-package:${pkg}:${Date.now()}`,
            type: "package",
            packageName: pkg,
            sourceLabel: messages.packagesSection.title,
            scrollToBuilder: true,
          })
        }
      />
      <PriceCalculator prefill={prefillRequest} handoff={handoff} locale={locale} messages={messages} />
      <ComparisonSection messages={messages} />
      <PricingCTA locale={locale} messages={messages} />
    </main>
  )
}