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

// ============ DATA ============

const packages = PACKAGES.map((pkg) => ({
  ...pkg,
  price: computePackagePrice(pkg),
  icon: pkg.name === "Starter" ? Star : pkg.name === "Signature" ? Crown : Gift,
  popular: pkg.name === "Signature",
}))

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

function getServicePrefill(serviceSlug: string, serviceName: string): ServicePrefillPreset | null {
  const lookup = `${serviceSlug} ${serviceName}`.toLowerCase()
  const label = `Suggested setup for ${serviceName}`

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

function getPricingHandoff(searchParams: ReturnType<typeof useSearchParams>): PricingHandoffContext | null {
  const from = searchParams.get("from")
  if (!from) return null

  const sourceLabel = sanitizeLabel(searchParams.get("source"), "your previous page")
  const intent = searchParams.get("intent") || "availability"
  const packageName = searchParams.get("package")
  const templateName = searchParams.get("template")
  const serviceSlug = searchParams.get("service")

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
    prefillLabel = `${packageName} package selected`
  } else if (templateName && templateName in eventTemplates) {
    prefill = {
      key: `template:${templateName}`,
      type: "template",
      templateName,
      sourceLabel,
      scrollToBuilder: false,
    }
    prefillLabel = `${templateName} selected`
  } else if (serviceSlug) {
    prefill = {
      key: `service:${serviceSlug}:${sourceLabel}`,
      type: "service",
      serviceSlug,
      serviceName: sourceLabel,
      sourceLabel,
      scrollToBuilder: false,
    }
    const servicePreset = getServicePrefill(serviceSlug, sourceLabel)
    if (servicePreset) prefillLabel = servicePreset.label
  }

  const descriptions: Record<string, string> = {
    booking: "Compare packages first or jump straight into the builder. Nothing is locked in until you send your request.",
    availability: "This page helps you compare options clearly before you move ahead with booking or availability.",
    "custom-package": "Your custom package builder is ready below. Start with the suggestion and change anything you want.",
    style: "We turned that reference into a practical starting point so you can price it properly and adjust it your way.",
    quote: "Shape the package here first, then check availability when you feel happy with the setup.",
  }

  return {
    from,
    sourceLabel,
    headline: prefill ? "A suggested starting point is ready" : "Choose how you want to start",
    description: descriptions[intent] || descriptions.availability,
    prefillLabel: prefillLabel || undefined,
    prefill,
    prefillKey: `${from}:${sourceLabel}:${intent}:${packageName || ""}:${templateName || ""}:${serviceSlug || ""}`,
  }
}

function PricingHandoffBanner({ handoff }: { handoff: PricingHandoffContext }) {
  return (
    <section className="-mt-8 pb-10 md:pb-14 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-amber-200/70 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/5 p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
              <MapPin size={12} />
              Based on {handoff.sourceLabel}
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
              Jump to Builder <ArrowRight size={15} />
            </a>
            <a
              href="#packages"
              className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
            >
              See Packages First
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ HERO ============
function PricingHero({ handoff }: { handoff?: PricingHandoffContext | null }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04),transparent_70%)]" />

      <div ref={ref} className={`max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/15 rounded-full px-5 py-2.5 mb-8">
          <Shield size={14} className="text-amber-500 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300/90 text-sm font-medium tracking-wide">All prices GST-inclusive &mdash; zero hidden charges</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          Transparent{" "}
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
            Pricing
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          See clear pricing upfront, compare coverage options, and choose what fits your event before you send a request.
        </p>

        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-5 py-4 mb-8 shadow-sm">
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Start with a package or build your own. You can adjust everything before booking.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {["GST Included", "No Hidden Fees", "You Own Copyright", "5-Day Delivery"].map((tag) => (
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
function PackagesSection({ onCustomize }: { onCustomize?: (packageName: string) => void }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="packages" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">Package Starting Points</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Event Packages
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-md mx-auto">
            Pick the closest fit, then customize coverage, team, and extras in the builder below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon
            return (
              <div
                key={i}
                className={`relative group rounded-2xl transition-all duration-500 hover:-translate-y-1 ${pkg.popular
                    ? "bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 border border-amber-300 dark:border-amber-500/30 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/5"
                    : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-amber-500 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
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
                      <span className="text-sm text-slate-500">onwards</span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">GST inclusive</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? "text-amber-500 dark:text-amber-400/80" : "text-emerald-500 dark:text-emerald-500/70"}`} />
                        <span className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => onCustomize?.(pkg.name)}
                      className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${pkg.popular
                          ? "bg-amber-500 text-white dark:text-slate-900 hover:bg-amber-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                        }`}
                    >
                      Start with {pkg.name} →
                    </button>
                    <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">Starts in the builder, and you can change anything</p>
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

const serviceRates: ServiceRate[] = [
  { id: "traditional-photo", name: SERVICE_RATES["traditional-photo"].name, description: "Posed shots, group photos, ritual & stage coverage", icon: Camera, ratePerDay: SERVICE_RATES["traditional-photo"].ratePerDay, ratePerHalfDay: SERVICE_RATES["traditional-photo"].ratePerHalfDay, maxQty: 3 },
  { id: "candid-photo", name: SERVICE_RATES["candid-photo"].name, description: "Unposed, natural moments — storytelling style", icon: Camera, ratePerDay: SERVICE_RATES["candid-photo"].ratePerDay, ratePerHalfDay: SERVICE_RATES["candid-photo"].ratePerHalfDay, maxQty: 3 },
  { id: "traditional-video", name: SERVICE_RATES["traditional-video"].name, description: "Full event recording — every ritual documented", icon: Video, ratePerDay: SERVICE_RATES["traditional-video"].ratePerDay, ratePerHalfDay: SERVICE_RATES["traditional-video"].ratePerHalfDay, maxQty: 3 },
  { id: "cinematic-video", name: SERVICE_RATES["cinematic-video"].name, description: "Film-style highlight reel with color grading & music", icon: Film, ratePerDay: SERVICE_RATES["cinematic-video"].ratePerDay, ratePerHalfDay: SERVICE_RATES["cinematic-video"].ratePerHalfDay, maxQty: 2, premium: true },
]

const eventAddOns: EventAddOn[] = [
  { id: "drone", name: EVENT_ADDONS.drone.name, price: EVENT_ADDONS.drone.price, description: "Aerial photos + video for this event", icon: Plane, perEvent: true, maxQty: 1, premium: true },
  { id: "led-wall", name: EVENT_ADDONS["led-wall"].name, price: EVENT_ADDONS["led-wall"].price, description: "Digital backdrop for this event", icon: Sparkles, perEvent: true, maxQty: 2 },
  { id: "same-day-edit", name: EVENT_ADDONS["same-day-edit"].name, price: EVENT_ADDONS["same-day-edit"].price, description: "Highlight reel delivered same day", icon: Zap, perEvent: true, maxQty: 1, premium: true },
  { id: "live-stream", name: EVENT_ADDONS["live-stream"].name, price: EVENT_ADDONS["live-stream"].price, description: "YouTube/Zoom live for remote guests", icon: Video, perEvent: true, maxQty: 1 },
]

const globalAddOns: EventAddOn[] = [
  { id: "album-25", name: GLOBAL_ADDONS["album-25"].name, price: GLOBAL_ADDONS["album-25"].price, description: "Premium printed album", icon: BookOpen, perEvent: false, maxQty: 5 },
  { id: "album-40", name: GLOBAL_ADDONS["album-40"].name, price: GLOBAL_ADDONS["album-40"].price, description: "Deluxe large album", icon: BookOpen, perEvent: false, maxQty: 5 },
]

// Pre-fill recommendations per event — services: Record<serviceId, qty>, addOns: Record<addonId, qty>
interface EventPreset {
  name: string
  duration: "Half Day" | "Full Day"
  services: Record<string, number>
  addOns: Record<string, number>
}

const eventTemplates: Record<string, EventPreset[]> = {
  "Hindu (South Indian)": [
    { name: "Pellikuthuru / Nalangu", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Haldi / Pasupu", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
    { name: "Sangeeth", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Muhurtham (Wedding)", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
    { name: "Reception", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
  "Hindu (North Indian)": [
    { name: "Roka", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
    { name: "Haldi", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
    { name: "Mehendi", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Sangeet", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Baraat & Wedding", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
    { name: "Reception", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
  "Muslim Wedding": [
    { name: "Haldi / Ubtan", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
    { name: "Mehendi", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Nikah", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
    { name: "Walima / Reception", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
  "Christian Wedding": [
    { name: "Engagement", duration: "Half Day", services: { "candid-photo": 1, "traditional-photo": 1 }, addOns: {} },
    { name: "Church Ceremony", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
    { name: "Reception / Party", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
  "Sikh Wedding": [
    { name: "Mehendi", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Anand Karaj (Gurudwara)", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
    { name: "Reception", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
  "Engagement": [
    { name: "Ring Ceremony", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Cocktail / After Party", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
  ],
  "Pre-Wedding Shoot": [
    { name: "Pre-Wedding Photoshoot", duration: "Half Day", services: { "candid-photo": 1 }, addOns: { drone: 1 } },
  ],
  "Baby / Maternity": [
    { name: "Photoshoot Session", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
  ],
  "Birthday / Event": [
    { name: "Event Coverage", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
  "Housewarming": [
    { name: "Griha Pravesh / Housewarming", duration: "Half Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
  "Corporate Event": [
    { name: "Conference / Seminar", duration: "Full Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
    { name: "Award Ceremony", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  ],
}

// Package-to-builder presets are now sourced from PACKAGES[].builderPreset in constants.ts

function generateEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ============ INTERACTIVE PRICE CALCULATOR ============
function PriceCalculator({ prefill, handoff }: { prefill?: BuilderPrefillRequest | null; handoff?: PricingHandoffContext | null }) {
  const { ref, isVisible } = useScrollReveal()
  const router = useRouter()
  const [events, setEvents] = useState<EventBlock[]>([])
  const [globalAddOnQty, setGlobalAddOnQty] = useState<Record<string, number>>({})
  const [showTemplates, setShowTemplates] = useState(true)
  const [expandedEvents, setExpandedEvents] = useState<string[]>([])
  // Track active package — when set, we show the package's fixed price
  const [activePackage, setActivePackage] = useState<string | null>(null)

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

  const applyEventPresets = (presets: EventPreset[], globalAddOns: Record<string, number> = {}, packageName?: string | null, scrollToBuilder = false) => {
    const newEvents = presets.map((preset) => ({
      id: generateEventId(),
      name: preset.name,
      duration: preset.duration as "Half Day" | "Full Day",
      services: { ...preset.services } as Record<string, number>,
      addOns: { ...preset.addOns } as Record<string, number>,
    }))
    setEvents(newEvents)
    setExpandedEvents(newEvents.map((event) => event.id))
    setGlobalAddOnQty({ ...globalAddOns })
    setActivePackage(packageName || null)
    setShowTemplates(false)
    if (scrollToBuilder) {
      setTimeout(() => calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    }
  }

  // Pre-fill from pricing handoff or package clicks.
  useEffect(() => {
    if (!prefill) return

    if (prefill.type === "package") {
      const pkg = PACKAGES.find((item) => item.name === prefill.packageName)
      if (!pkg || !pkg.builderPreset) return
      applyEventPresets(pkg.builderPreset.events, pkg.builderPreset.globalAddOns as Record<string, number>, prefill.packageName, prefill.scrollToBuilder)
      return
    }

    if (prefill.type === "template") {
      const presets = eventTemplates[prefill.templateName]
      if (!presets) return
      applyEventPresets(presets, {}, null, prefill.scrollToBuilder)
      return
    }

    if (prefill.type === "service") {
      const servicePreset = getServicePrefill(prefill.serviceSlug, prefill.serviceName)
      if (!servicePreset) return
      applyEventPresets(servicePreset.events, servicePreset.globalAddOns, null, prefill.scrollToBuilder)
    }
  }, [prefill])

  const addEvent = (name: string) => {
    const newEvent: EventBlock = {
      id: generateEventId(),
      name,
      duration: "Full Day",
      services: {},
      addOns: {},
    }
    setEvents((prev) => [...prev, newEvent])
    setExpandedEvents((prev) => [...prev, newEvent.id])
    setShowTemplates(false)
    setActivePackage(null)
  }

  const addFromTemplate = (templateName: string) => {
    const presets = eventTemplates[templateName]
    if (!presets) return
    const newEvents = presets.map((preset) => ({
      id: generateEventId(),
      name: preset.name,
      duration: preset.duration,
      services: { ...preset.services },
      addOns: { ...preset.addOns },
    }))
    // Replace existing events (not append) — avoids accidental inflation
    setEvents(newEvents)
    setExpandedEvents(newEvents.map((e) => e.id))
    setShowTemplates(false)
    setActivePackage(null)
  }

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setExpandedEvents((prev) => prev.filter((eid) => eid !== id))
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
  const activePackageData = activePackage ? PACKAGES.find((p) => p.name === activePackage) : null
  const hasContent = events.length > 0

  const configuredEvents = events.filter((e) => Object.keys(e.services).length > 0)
  const hasConfiguredEvents = configuredEvents.length > 0

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  const generateWhatsAppMessage = () => {
    if (!hasConfiguredEvents) return ""

    const lines: string[] = []
    lines.push("Hello Orvex Visuals,")
    lines.push("")
    if (activePackage) {
      lines.push(`I'd like to book the *${activePackage} Package* (₹${totalPrice.toLocaleString("en-IN")}).`)
    } else {
      lines.push("I'd like an estimate for the following events:")
    }
    lines.push("")

    if (eventDate) lines.push(`Date: ${formatDate(eventDate)}`)
    if (eventCity) lines.push(`Location: ${eventCity}${venueName ? ` - ${venueName}` : ""}`)
    if (eventDate || eventCity) lines.push("")

    configuredEvents.forEach((event, idx) => {
      lines.push(`${idx + 1}. ${event.name} - ${event.duration}`)
      for (const [sid, qty] of Object.entries(event.services)) {
        const s = serviceRates.find((sr) => sr.id === sid)
        if (s) lines.push(`   - ${s.name} x${qty}`)
      }
      for (const [aid, qty] of Object.entries(event.addOns)) {
        const a = eventAddOns.find((ao) => ao.id === aid)
        if (a) lines.push(`   - ${a.name} x${qty}`)
      }
      lines.push(`   Subtotal: Rs.${getEventPrice(event).toLocaleString("en-IN")}`)
      lines.push("")
    })

    const globalLines = Object.entries(globalAddOnQty)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const a = globalAddOns.find((ao) => ao.id === id)
        return a ? `- ${a.name}${qty > 1 ? ` x${qty}` : ""} (Rs.${(a.price * qty).toLocaleString("en-IN")})` : null
      })
      .filter(Boolean)

    if (globalLines.length > 0) {
      lines.push("Extras:")
      lines.push(...(globalLines as string[]))
      lines.push("")
    }

    lines.push(`Estimated Total: Rs.${totalPrice.toLocaleString("en-IN")}`)
    lines.push("")

    lines.push("Please share availability. Thank you.")

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
    router.push("/book")
  }

  const handleSendEstimate = () => {
    if (!hasConfiguredEvents) return
    setIsSubmitting(true)
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${generateWhatsAppMessage()}`, '_blank')
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  return (
    <section id="calculator" ref={calculatorRef} className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto px-6 relative">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">Custom Package Builder</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Build Your Package
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
            Pick your event type below — we&apos;ll suggest the right team. Add or remove anything you want.
          </p>
          {handoff && (
            <div className="mt-6 max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-left shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400 mb-2">Suggested setup</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">We added a suggested setup based on {handoff.sourceLabel}. Review it below and change anything you want.</p>
              {handoff.prefillLabel && (
                <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">{handoff.prefillLabel}. Change anything below.</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Event Builder */}
          <div className="lg:col-span-2 space-y-8">

            {/* Event Details */}
            <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "100ms" }}>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Event Details</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Choose coverage length inside each event card. Exact timing can be finalized during booking.</p>
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
                    placeholder="e.g. Bangalore, Mysore, Mangalore"
                  />
                </div>
                <div className="relative sm:col-span-2">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                    placeholder="e.g. Rajmahal Convention, Taj West End"
                  />
                </div>
              </div>
            </div>

            {/* Step 1: Add Events */}
            <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Events</p>
                {events.length > 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">{events.length} event{events.length > 1 ? "s" : ""}</span>
                )}
              </div>

              {/* Template selector */}
              <div className="mb-4">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-amber-400 dark:hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                >
                  <Sparkles size={14} />
                  {events.length > 0 ? "Change Event Type" : "Pick Your Event Type"}
                  <ChevronDown size={12} className={`transition-transform ${showTemplates ? "rotate-180" : ""}`} />
                </button>
                {events.length > 0 && (
                  <span className="ml-3 text-[11px] text-slate-400 dark:text-slate-500">Replaces current selection</span>
                )}

                {showTemplates && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(eventTemplates).map(([template, presets]) => (
                      <button
                        key={template}
                        onClick={() => addFromTemplate(template)}
                        className="px-3.5 py-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                      >
                        <span className="text-xs font-medium block">{template}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{presets.length} event{presets.length > 1 ? "s" : ""} · pre-filled</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add custom event */}
              <button
                onClick={() => addEvent("New Event")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-400 dark:hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all text-sm font-medium"
              >
                <Plus size={14} />
                Add Event / Day
              </button>
            </div>

            {/* Event Blocks */}
            {events.length > 0 && (
              <div className="space-y-3">
                {events.map((event, eventIndex) => {
                  const isExpanded = expandedEvents.includes(event.id)
                  const eventPrice = getEventPrice(event)
                  const serviceCount = Object.values(event.services).reduce((a, b) => a + b, 0)

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
                              {event.duration} · {serviceCount > 0 ? `${serviceCount} service${serviceCount > 1 ? "s" : ""}` : "No services yet"}
                              {eventPrice > 0 && ` · ₹${(eventPrice / 1000).toFixed(0)}K`}
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
                              placeholder="e.g. Reception, Haldi, Sangeeth..."
                            />
                            <div className="w-full sm:w-auto">
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Coverage</p>
                              <div className="grid w-full grid-cols-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 sm:flex sm:w-auto sm:min-w-[220px]">
                                {(["Half Day", "Full Day"] as const).map((d) => (
                                  <button
                                    key={d}
                                    onClick={() => updateEventDuration(event.id, d)}
                                    className={`px-3.5 py-2.5 text-xs font-medium transition-colors sm:min-w-[110px] ${event.duration === d
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
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Photography & Video Team</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">Add or remove — we&apos;ve suggested what works best</p>
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
                                        {service.premium && <span className="ml-1.5 text-[10px] text-amber-500 dark:text-amber-400/70 font-normal">Premium</span>}
                                        {qty > 0 && <span className="ml-1.5 text-[10px] text-emerald-500 dark:text-emerald-400/80 font-normal">✓ Added</span>}
                                      </span>
                                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block">{service.description}</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">₹{rate.toLocaleString("en-IN")} / {event.duration === "Full Day" ? "day" : "half day"}</span>
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
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Extras</p>
                            <div className="flex flex-wrap gap-2">
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
              <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "400ms" }}>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Albums & Extras</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">These apply to your overall package</p>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60">
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
                            {addon.premium && <span className="ml-1.5 text-[10px] text-amber-500 dark:text-amber-400/70 font-normal">Premium</span>}
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
              </div>
            )}
          </div>

          {/* RIGHT: Summary Sidebar */}
          <div className="lg:col-span-1" ref={summaryRef}>
            <div className={`sticky top-28 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms" }}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Your Package</h3>

                {!hasContent ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Camera size={20} className="text-slate-400 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm">Add events to see your estimate</p>
                    <p className="text-slate-400 dark:text-slate-600 text-xs mt-2">Use a template or add events one by one</p>
                  </div>
                ) : (
                  <>
                    {/* Events breakdown */}
                    <div className="space-y-2.5 mb-6">
                      <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-medium">{events.length} Event{events.length > 1 ? "s" : ""}</p>
                      {events.map((event) => {
                        const price = getEventPrice(event)
                        return (
                          <div key={event.id} className="rounded-xl bg-slate-50 dark:bg-slate-800/40 px-4 py-3">
                            <div className="flex justify-between items-start">
                              <div className="min-w-0 flex-1">
                                <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{event.name}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">{event.duration}</p>
                                {Object.entries(event.services).map(([sid, qty]) => {
                                  const s = serviceRates.find((sr) => sr.id === sid)
                                  return s ? (
                                    <p key={sid} className="text-slate-400 dark:text-slate-600 text-[10px] leading-relaxed">{s.name} ×{qty}</p>
                                  ) : null
                                })}
                              </div>
                              <span className={`text-sm font-semibold ml-3 ${price > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-slate-600 italic text-xs"}`}>
                                {price > 0 ? `₹${(price / 1000).toFixed(0)}K` : "No services"}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Global Add-ons in summary */}
                    {Object.keys(globalAddOnQty).length > 0 && (
                      <div className="space-y-2 mb-6">
                        <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-medium">Extras</p>
                        {Object.entries(globalAddOnQty).map(([id, qty]) => {
                          const addon = globalAddOns.find((a) => a.id === id)
                          if (!addon || qty === 0) return null
                          return (
                            <div key={id} className="flex justify-between items-center px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                              <span className="text-slate-600 dark:text-slate-400 text-sm">{addon.name} {qty > 1 && <span className="text-slate-400 dark:text-slate-600">×{qty}</span>}</span>
                              <span className="text-emerald-500 dark:text-emerald-400/80 text-sm font-medium">+₹{((addon.price * qty) / 1000).toFixed(0)}K</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mb-6">
                      {activePackageData && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg">
                            {activePackageData.name} Package
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          {activePackageData ? "Package Total" : "Estimated Total"}
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            &#8377;{totalPrice.toLocaleString("en-IN")}
                          </div>
                          <span className="text-emerald-500 dark:text-emerald-400/70 text-[11px]">GST inclusive</span>
                        </div>
                      </div>
                      {activePackageData && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                          Computed from rates — modify services to customize
                        </p>
                      )}
                    </div>



                    {/* CTA Buttons */}
                    {!hasConfiguredEvents && (
                      <p className="text-center text-slate-400 dark:text-slate-600 text-xs mb-4">Add services to at least one event to get started</p>
                    )}
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleProceedToBook}
                        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${hasConfiguredEvents
                            ? "bg-amber-500 text-white dark:text-slate-900 hover:bg-amber-400 active:scale-[0.98]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          }`}
                        disabled={!hasConfiguredEvents}
                      >
                        Proceed to Book
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
                        {isSubmitting ? "Opening WhatsApp..." : "Send Estimate on WhatsApp"}
                      </button>
                      <p className="text-center text-slate-400 dark:text-slate-600 text-[10px]">Estimate is for sharing / discussion only. Book when you&apos;re ready.</p>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      {[
                        { icon: Shield, text: "No hidden charges" },
                        { icon: Clock, text: "5-day delivery guarantee" },
                        { icon: CheckCircle2, text: "100% copyright yours" },
                        { icon: Star, text: "Backup equipment on-site" },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2.5 text-slate-500 text-xs">
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
function ComparisonSection() {
  const { ref, isVisible } = useScrollReveal()
  const comparisons = [
    { feature: "Pricing Transparency", orvex: "All prices on website", competitor: "\"Call for quote\"" },
    { feature: "GST", orvex: "Included in price", competitor: "+18% surprise" },
    { feature: "Photo Delivery", orvex: "5 days", competitor: "30-45 days" },
    { feature: "Video Delivery", orvex: "15 days", competitor: "45-60 days" },
    { feature: "Copyright", orvex: "100% yours", competitor: "Studio retains rights" },
    { feature: "Booking Process", orvex: "Online in 2 min", competitor: "Phone calls only" },
    { feature: "Overtime", orvex: "Flexible — no surprise charges", competitor: "₹3,000/hr (hidden)" },
    { feature: "Cancellation", orvex: "Partial refund available", competitor: "Non-refundable" },
  ]

  return (
    <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div ref={ref} className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">Why We&apos;re Different</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Orvex vs Others
          </h2>
        </div>

        <div className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          {/* Header */}
          <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-900">
            <div className="p-4 md:p-5 text-xs font-medium text-slate-500 uppercase tracking-wider">Feature</div>
            <div className="p-4 md:p-5 text-xs font-medium text-amber-500 dark:text-amber-400 text-center uppercase tracking-wider">Orvex</div>
            <div className="p-4 md:p-5 text-xs font-medium text-slate-400 dark:text-slate-600 text-center uppercase tracking-wider">Others</div>
          </div>

          {/* Rows */}
          {comparisons.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-t border-slate-200 dark:border-slate-800/60 ${i % 2 === 0 ? "bg-white dark:bg-slate-900/30" : "bg-slate-50 dark:bg-transparent"
                }`}
            >
              <div className="p-4 md:p-5 text-sm text-slate-700 dark:text-slate-300">{row.feature}</div>
              <div className="p-4 md:p-5 text-sm text-emerald-600 dark:text-emerald-400/90 text-center font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 size={13} />
                {row.orvex}
              </div>
              <div className="p-4 md:p-5 text-sm text-slate-400 dark:text-slate-600 text-center">{row.competitor}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ CTA ============
function PricingCTA() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className={`py-24 md:py-32 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-8">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
          <span className="text-white/80 text-sm">Peak season weekends filling fast</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
          Lock In Your Date
        </h2>
        <p className="text-amber-100/80 text-lg mb-10 max-w-md mx-auto">
          Explore the options above, shape your package, and book only when it feels right.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/pricing#calculator"
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300"
          >
            Build Package to Book
          </a>
          <a
            href={getWhatsAppLink("Hi Orvex, I'd like to discuss my event requirements")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white hover:text-amber-700 px-8 py-4 rounded-xl font-bold transition-all duration-300"
          >
            <MessageCircle size={18} />
            Chat With Us
          </a>
        </div>
      </div>
    </section>
  )
}

// ============ MAIN ============
export default function PricingPage() {
  const searchParams = useSearchParams()
  const handoff = getPricingHandoff(searchParams)
  const [prefillRequest, setPrefillRequest] = useState<BuilderPrefillRequest | null>(handoff?.prefill || null)

  useEffect(() => {
    setPrefillRequest(handoff?.prefill || null)
  }, [handoff?.prefillKey])

  return (
    <main>
      <PricingHero handoff={handoff} />
      {handoff && <PricingHandoffBanner handoff={handoff} />}
      <PackagesSection
        onCustomize={(pkg) =>
          setPrefillRequest({
            key: `manual-package:${pkg}:${Date.now()}`,
            type: "package",
            packageName: pkg,
            sourceLabel: "Pricing Packages",
            scrollToBuilder: true,
          })
        }
      />
      <PriceCalculator prefill={prefillRequest} handoff={handoff} />
      <ComparisonSection />
      <PricingCTA />
    </main>
  )
}
