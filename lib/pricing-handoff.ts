/**
 * Pricing Handoff Module - Builds source-aware pricing URLs with context
 * 
 * This module provides utilities to create pricing links that:
 * - Track where users came from (from, source)
 * - Understand their intent (intent)
 * - Support auto-prefilling services/packages/templates (service, package, template)
 * - Enable personalized pricing experiences
 */

export type HandoffSource = 
  | "home"
  | "services"
  | "gallery"
  | "blog"
  | "contact"
  | "quote"
  | "navbar"

export type HandoffIntent =
  | "view-packages"
  | "custom-package"
  | "compare-pricing"
  | "quick-check"

export interface PricingHandoffLinkOptions {
  from: HandoffSource
  source?: string // Display-friendly source name (e.g. "Saved Booking" for quotes)
  intent?: HandoffIntent
  service?: string // Service slug for prefill
  package?: string // Package name for prefill
  template?: string // Template name for prefill
  category?: string // Gallery/blog category context
}

/**
 * Builds a pricing page URL with handoff context
 * 
 * @example
 * // From services page
 * buildPricingHandoffHref({ from: "services", service: "wedding-photography" })
 * // => "/pricing?from=services&service=wedding-photography"
 * 
 * @example
 * // From saved quote
 * buildPricingHandoffHref({ from: "quote", source: "Saved Booking", intent: "custom-package" })
 * // => "/pricing?from=quote&source=Saved+Booking&intent=custom-package"
 */
export function buildPricingHandoffHref(options: PricingHandoffLinkOptions): string {
  const params = new URLSearchParams()
  
  // Core handoff parameters
  params.set("from", options.from)
  
  if (options.source) {
    params.set("source", options.source)
  }
  
  if (options.intent) {
    params.set("intent", options.intent)
  }
  
  // Prefill parameters
  if (options.service) {
    params.set("service", options.service)
  }
  
  if (options.package) {
    params.set("package", options.package)
  }
  
  if (options.template) {
    params.set("template", options.template)
  }
  
  if (options.category) {
    params.set("category", options.category)
  }
  
  const queryString = params.toString()
  return `/pricing${queryString ? `?${queryString}` : ""}`
}

/**
 * Parse pricing handoff context from URL params
 */
export function parsePricingHandoff(searchParams: URLSearchParams) {
  return {
    from: searchParams.get("from") as HandoffSource | null,
    source: searchParams.get("source"),
    intent: searchParams.get("intent") as HandoffIntent | null,
    service: searchParams.get("service"),
    package: searchParams.get("package"),
    template: searchParams.get("template"),
    category: searchParams.get("category"),
  }
}

/**
 * Get a human-readable source name for display in pricing context banners
 */
export function getSourceDisplayName(from: HandoffSource, source?: string): string {
  const displayMap: Record<HandoffSource, string> = {
    home: "Home",
    services: "Services",
    gallery: "Gallery",
    blog: "Blog",
    contact: "Contact",
    quote: "Saved Booking",
    navbar: "Navigation",
  }
  
  // Custom source display (e.g., "Saved Booking", "Wedding Album")
  if (source) {
    return source
  }
  
  return displayMap[from] || "Website"
}

/**
 * Get intent description for UI context
 */
export function getIntentDescription(intent: HandoffIntent | null): string {
  const descriptionMap: Record<HandoffIntent, string> = {
    "view-packages": "View our packages",
    "custom-package": "Build a custom package",
    "compare-pricing": "Compare pricing options",
    "quick-check": "Quick pricing check",
  }
  
  if (!intent) {
    return "Let's talk about your event"
  }
  
  return descriptionMap[intent]
}

/**
 * Helpers for specific pages to generate handoff links
 */

export interface BlogPricingHandoffInput {
  title: string
  slug: string
  category: string
  tags?: string[]
}

export function getGalleryPricingHandoff(category: string): PricingHandoffLinkOptions {
  const base = { from: "gallery", intent: "custom-package" } as const

  switch (category) {
    case "wedding":
      return { ...base, source: "Wedding Gallery", service: "wedding" }
    case "pre-wedding":
      return { ...base, source: "Pre-Wedding Gallery", template: "Pre-Wedding Shoot" }
    case "events":
      return { ...base, source: "Events Gallery", template: "Birthday / Event" }
    case "baby":
      return { ...base, source: "Baby & Family Gallery", template: "Baby / Maternity" }
    case "portraits":
      return { ...base, source: "Portrait Gallery", service: "portrait" }
    case "cinematic":
      return { ...base, source: "Cinematic Gallery", service: "cinematic-video" }
    default:
      return { ...base, source: "Style Reference Gallery" }
  }
}

export function getBlogPricingHandoff({ title, slug, category, tags = [] }: BlogPricingHandoffInput): PricingHandoffLinkOptions {
  const searchText = `${title} ${slug} ${category} ${tags.join(" ")}`.toLowerCase()
  const base = { from: "blog", source: title, intent: "quick-check" } as const

  if (searchText.includes("pre-wedding")) {
    return { ...base, template: "Pre-Wedding Shoot" }
  }

  if (searchText.includes("baby") || searchText.includes("newborn") || searchText.includes("maternity")) {
    return { ...base, template: "Baby / Maternity" }
  }

  if (searchText.includes("housewarming")) {
    return { ...base, template: "Housewarming" }
  }

  if (searchText.includes("corporate") || searchText.includes("conference") || searchText.includes("seminar") || searchText.includes("award")) {
    return { ...base, template: "Corporate Event" }
  }

  if (searchText.includes("birthday") || searchText.includes("naming") || searchText.includes("cradle") || searchText.includes("anniversary") || searchText.includes("event")) {
    return { ...base, template: "Birthday / Event" }
  }

  if (searchText.includes("portrait") || searchText.includes("headshot") || searchText.includes("portfolio") || searchText.includes("studio") || searchText.includes("product")) {
    return { ...base, service: "portrait" }
  }

  if (searchText.includes("cinematic") || searchText.includes("videography") || searchText.includes("video")) {
    return { ...base, service: "cinematic-video" }
  }

  if (searchText.includes("wedding")) {
    return { ...base, service: "wedding" }
  }

  return base
}
