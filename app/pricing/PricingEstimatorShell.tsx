"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// saveQuote is only called from /book — pricing page sends estimates only
import { BOOKING_PLAN_STORAGE_KEY, PACKAGES, SERVICE_RATES, EVENT_ADDONS, GLOBAL_ADDONS, PHONE_NUMBER, computePackagePrice, getWhatsAppLink } from "@/lib/constants"
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
  Shield,
  Film,
  BookOpen,
  MapPin,
  Calendar,
} from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getPageMessages } from "@/lib/i18n/pages"
import { applyTemplate } from "@/lib/i18n/home"
import { handleWhatsAppHandoff } from "@/lib/popup-handoff"
import { withLocalePathname } from "@/lib/i18n/routing"
import type { AppLocale } from "@/lib/i18n/config"
import { EVENT_TEMPLATE_PRESETS, resolveServiceEntryPreset, resolvePresetCoverageProfile, COVERAGE_PROFILES, type CoverageProfileId } from "@/lib/pricing-presets"

// ============ DATA ============

const PACKAGE_MESSAGE_KEYS = {
  Starter: "starter",
  Signature: "signature",
  Grand: "grand",
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
type PricingHandoffParams = { get(name: string): string | null }
type PricingBuilderMessages = PricingMessages["builder"] & { storageError?: string }

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
  const preset = resolveServiceEntryPreset(serviceSlug, serviceName)
  if (!preset) return null
  return {
    label: applyTemplate(messages.handoff.suggestedSetup, { service: serviceName }),
    events: [{ name: serviceName, duration: preset.duration, services: { ...preset.services }, addOns: { ...preset.addOns } }],
    globalAddOns: {} as Record<string, number>,
  }
}

function getPricingHandoff(
  searchParams: PricingHandoffParams,
  messages: PricingMessages,
  resolvedServiceLabel?: string | null,
  locale?: AppLocale,
): PricingHandoffContext | null {
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
      key: `package:${packageName}:${locale ?? "en"}`,
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
      key: `template:${templateName}:${locale ?? "en"}`,
      type: "template",
      templateName,
      sourceLabel,
      scrollToBuilder: false,
    }
    prefillLabel = applyTemplate(messages.handoff.templateSelected, { name: eventTemplates[templateName].label })
  } else if (serviceSlug) {
    const resolvedServiceName = resolvedServiceLabel || sourceLabel
    prefill = {
      key: `service:${serviceSlug}:${sourceLabel}:${locale ?? "en"}`,
      type: "service",
      serviceSlug,
      serviceName: resolvedServiceName,
      sourceLabel,
      scrollToBuilder: false,
    }
    const servicePreset = getServicePrefill(serviceSlug, resolvedServiceName, messages)
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
    // When the handoff carries a service slug, use the server-resolved locale-correct
    // label for the banner attribution instead of the raw URL param value, which may
    // carry the originating page's locale (e.g. EN source on HI pricing page).
    sourceLabel: (serviceSlug && resolvedServiceLabel) ? resolvedServiceLabel : sourceLabel,
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
                    {pkg.coverageProfileId && (() => {
                      const profile = COVERAGE_PROFILES[pkg.coverageProfileId]
                      const profileCopy = messages.coverageProfiles[profile.messageKey as keyof typeof messages.coverageProfiles]
                      return (
                        <span className={`inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${pkg.popular ? "bg-amber-400/20 text-amber-900 dark:bg-amber-500/25 dark:text-amber-200" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                          {profileCopy.label}
                        </span>
                      )
                    })()}
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

function getDisplayLocale(locale: AppLocale) {
  return locale === "hi" ? "hi-IN" : "en-IN"
}

function formatCurrencyValue(value: number, locale: AppLocale) {
  return value.toLocaleString(getDisplayLocale(locale))
}

function getPackageContent(packageName: PackageIdentifier, messages: PricingMessages) {
  return messages.packagesSection.items[PACKAGE_MESSAGE_KEYS[packageName]]
}

function getPricingPackages(messages: PricingMessages) {
  return PACKAGES.map((pkg) => {
    const content = getPackageContent(pkg.name as PackageIdentifier, messages)

    return {
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
      popular: pkg.popular ?? false,
      coverageProfileId: resolvePresetCoverageProfile(pkg.builderPreset.events),
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
  const tm = messages.builder.templates
  return {
    "Hindu (South Indian)": {
      label: tm.hinduSouthIndian.label,
      presets: EVENT_TEMPLATE_PRESETS["Hindu (South Indian)"].events.map((e) => ({
        name: tm.hinduSouthIndian.events[e.eventKey as keyof typeof tm.hinduSouthIndian.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Hindu (North Indian)": {
      label: tm.hinduNorthIndian.label,
      presets: EVENT_TEMPLATE_PRESETS["Hindu (North Indian)"].events.map((e) => ({
        name: tm.hinduNorthIndian.events[e.eventKey as keyof typeof tm.hinduNorthIndian.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Muslim Wedding": {
      label: tm.muslimWedding.label,
      presets: EVENT_TEMPLATE_PRESETS["Muslim Wedding"].events.map((e) => ({
        name: tm.muslimWedding.events[e.eventKey as keyof typeof tm.muslimWedding.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Christian Wedding": {
      label: tm.christianWedding.label,
      presets: EVENT_TEMPLATE_PRESETS["Christian Wedding"].events.map((e) => ({
        name: tm.christianWedding.events[e.eventKey as keyof typeof tm.christianWedding.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Sikh Wedding": {
      label: tm.sikhWedding.label,
      presets: EVENT_TEMPLATE_PRESETS["Sikh Wedding"].events.map((e) => ({
        name: tm.sikhWedding.events[e.eventKey as keyof typeof tm.sikhWedding.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    Engagement: {
      label: tm.engagement.label,
      presets: EVENT_TEMPLATE_PRESETS.Engagement.events.map((e) => ({
        name: tm.engagement.events[e.eventKey as keyof typeof tm.engagement.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Pre-Wedding Shoot": {
      label: tm.preWeddingShoot.label,
      presets: EVENT_TEMPLATE_PRESETS["Pre-Wedding Shoot"].events.map((e) => ({
        name: tm.preWeddingShoot.events[e.eventKey as keyof typeof tm.preWeddingShoot.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Baby / Maternity": {
      label: tm.babyMaternity.label,
      presets: EVENT_TEMPLATE_PRESETS["Baby / Maternity"].events.map((e) => ({
        name: tm.babyMaternity.events[e.eventKey as keyof typeof tm.babyMaternity.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Birthday / Event": {
      label: tm.birthdayEvent.label,
      presets: EVENT_TEMPLATE_PRESETS["Birthday / Event"].events.map((e) => ({
        name: tm.birthdayEvent.events[e.eventKey as keyof typeof tm.birthdayEvent.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    Housewarming: {
      label: tm.housewarming.label,
      presets: EVENT_TEMPLATE_PRESETS.Housewarming.events.map((e) => ({
        name: tm.housewarming.events[e.eventKey as keyof typeof tm.housewarming.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
    "Corporate Event": {
      label: tm.corporateEvent.label,
      presets: EVENT_TEMPLATE_PRESETS["Corporate Event"].events.map((e) => ({
        name: tm.corporateEvent.events[e.eventKey as keyof typeof tm.corporateEvent.events],
        duration: e.duration, services: { ...e.services }, addOns: { ...e.addOns },
      })),
    },
  }
}

// Package-to-builder presets are now sourced from PACKAGES[].builderPreset in constants.ts

function generateEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function PricingHandoffBridge({
  messages,
  resolvedServiceLabel,
  onHandoffChange,
}: {
  messages: PricingMessages
  resolvedServiceLabel?: string | null
  onHandoffChange: (handoff: PricingHandoffContext | null) => void
}) {
  const searchParams = useSearchParams()
  const searchParamsKey = searchParams.toString()
  const locale = useCurrentLocale()
  const handoff = useMemo(
    () => getPricingHandoff(searchParams, messages, resolvedServiceLabel, locale),
    [messages, resolvedServiceLabel, searchParamsKey, locale],
  )

  useEffect(() => {
    onHandoffChange(handoff)
  }, [handoff, onHandoffChange])

  return handoff ? <PricingHandoffBanner handoff={handoff} messages={messages} /> : null
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
  locale: AppLocale
  messages: PricingMessages
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const router = useRouter()
  const serviceRates = getServiceRates(messages)
  const eventAddOns = getEventAddOns(messages)
  const globalAddOns = getGlobalAddOns(messages)
  const eventTemplates = useMemo(() => getEventTemplates(messages), [messages])
  const packages = useMemo(() => getPricingPackages(messages), [messages])
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
  const [storageError, setStorageError] = useState<string | null>(null)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setIsKeyboardOpen(true)
      }
    }
    const handleFocusOut = () => {
      setIsKeyboardOpen(false)
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0]

  const calculatorRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const lastAppliedPrefillKeyRef = useRef<string | null>(null)

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
    if (!prefill?.key) return
    if (lastAppliedPrefillKeyRef.current === prefill.key) return

    if (prefill.type === "package") {
      const pkg = packages.find((item) => item.id === prefill.packageName)
      if (!pkg || !pkg.builderPreset) return
      lastAppliedPrefillKeyRef.current = prefill.key
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
      lastAppliedPrefillKeyRef.current = prefill.key
      applyEventPresets(templateDefinition.presets, {}, null, prefill.scrollToBuilder, { label: templateDefinition.label, type: "setup" })
      return
    }

    if (prefill.type === "service") {
      const servicePreset = getServicePrefill(prefill.serviceSlug, prefill.serviceName, messages)
      if (!servicePreset) return
      lastAppliedPrefillKeyRef.current = prefill.key
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

  // Resolve the active coverage profile from the merged service selection across all events
  const activeCoverageProfileId = useMemo((): CoverageProfileId | null => {
    if (events.length === 0) return null
    return resolvePresetCoverageProfile(events)
  }, [events])

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
    if (!eventDate || !eventCity) {
      setShowValidationErrors(true)
      calculatorRef.current?.scrollIntoView({ behavior: "smooth" })
      return
    }

    const plan = buildBookingPlan()
    setStorageError(null)

    if (typeof window === "undefined") return

    try {
      window.sessionStorage.setItem(BOOKING_PLAN_STORAGE_KEY, JSON.stringify(plan))
    } catch {
      setStorageError((messages.builder as PricingBuilderMessages).storageError ?? messages.builder.estimateNote)
      return
    }

    router.push(withLocalePathname("/book", locale))
  }

  const handleSendEstimate = () => {
    if (!hasConfiguredEvents) return
    if (!eventDate || !eventCity) {
      setShowValidationErrors(true)
      calculatorRef.current?.scrollIntoView({ behavior: "smooth" })
      return
    }
    setIsSubmitting(true)
    handleWhatsAppHandoff(getWhatsAppLink(generateWhatsAppMessage()))
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  const renderMobileStickyBar = () => {
    if (!hasConfiguredEvents || isKeyboardOpen) return null

    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between max-w-6xl mx-auto gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{messages.builder.summaryTitle}</p>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 truncate">
              ₹{formatCurrencyValue(totalPrice, locale)}
            </div>
          </div>
          <button
            onClick={handleProceedToBook}
            className="shrink-0 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white dark:text-slate-900 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            {messages.builder.proceedToBook} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <section id="calculator" ref={calculatorRef} className="py-24 pb-32 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border ${showValidationErrors && !eventDate ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700/60"} text-sm text-slate-900 dark:text-white focus:border-amber-500/50 focus:outline-none transition-colors dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert`}
                  />
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border ${showValidationErrors && !eventCity ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700/60"} text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors`}
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

            {/* Step 1: Add Events */}
            <div className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "100ms" }}>
              <div className="flex items-baseline justify-between mb-2">
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
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4">{messages.builder.eventsHint}</p>

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



                    {/* Coverage Profile */}
                    {hasConfiguredEvents && activeCoverageProfileId && (() => {
                      const profile = COVERAGE_PROFILES[activeCoverageProfileId]
                      const profileCopy = messages.coverageProfiles[profile.messageKey as keyof typeof messages.coverageProfiles]
                      return (
                        <div className="mb-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-1.5">
                            {messages.builder.coverageFormatLabel}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{profileCopy.label}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{profileCopy.crewLabel}</p>
                        </div>
                      )
                    })()}

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
                      {storageError ? (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[11px] leading-relaxed text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                          {storageError}
                        </div>
                      ) : null}
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
      {renderMobileStickyBar()}
    </section>
  )
}

// ============ MAIN ============
export default function PricingEstimatorShell({
  initialSearchParams,
  locale,
  messages,
  resolvedServiceLabel,
}: {
  initialSearchParams: string
  locale: AppLocale
  messages: PricingMessages
  resolvedServiceLabel?: string | null
}) {
  const initialHandoff = useMemo(
    () => getPricingHandoff(new URLSearchParams(initialSearchParams), messages, resolvedServiceLabel, locale),
    [initialSearchParams, messages, resolvedServiceLabel, locale]
  )
  const [handoff, setHandoff] = useState<PricingHandoffContext | null>(initialHandoff)
  const [prefillRequest, setPrefillRequest] = useState<BuilderPrefillRequest | null>(initialHandoff?.prefill || null)

  const handleHandoffChange = useCallback((nextHandoff: PricingHandoffContext | null) => {
    setHandoff(nextHandoff)
    setPrefillRequest(nextHandoff?.prefill || null)
  }, [])

  useEffect(() => {
    handleHandoffChange(initialHandoff)
  }, [handleHandoffChange, initialHandoff])

  return (
    <>
      <Suspense fallback={initialHandoff ? <PricingHandoffBanner handoff={initialHandoff} messages={messages} /> : null}>
        <PricingHandoffBridge messages={messages} resolvedServiceLabel={resolvedServiceLabel} onHandoffChange={handleHandoffChange} />
      </Suspense>
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
    </>
  )
}