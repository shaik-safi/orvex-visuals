// ============================================================
// Orvex Visuals — Pricing Presets Composition Layer
//
// Single source of truth for:
//   - Event template structural compositions
//   - Service-entry preset mappings (explicit, not regex-based)
//   - Hybrid photo + video coverage semantics
//
// This module owns service/addOn selections, durations, and
// coverage semantics. Display labels and localized event names
// are resolved from i18n messages by the consuming page.
// Named package ownership remains in lib/constants.ts.
// ============================================================

// ============================================================
// Shared types
// ============================================================

/** Structural composition of one event within a template preset */
export interface RawEventPreset {
  /** Canonical key for looking up the localized event name from i18n messages */
  eventKey: string
  duration: "Half Day" | "Full Day"
  services: Record<string, number>
  addOns: Record<string, number>
}

/** One event template definition — structural data only */
export interface RawTemplatePreset {
  /** Key into messages.builder.templates for label and event name lookups */
  messageKey: string
  events: RawEventPreset[]
}

// ============================================================
// Event template compositions
//
// Structural service/addOn selections for each wedding and event
// template type. Keys match the canonical template display names
// used in pricing-page routing and WhatsApp handoff.
// ============================================================

export const EVENT_TEMPLATE_PRESETS: Record<string, RawTemplatePreset> = {
  "Hindu (South Indian)": {
    messageKey: "hinduSouthIndian",
    events: [
      { eventKey: "pellikuthuru",  duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "haldiPasupu",   duration: "Half Day", services: { "candid-photo": 1 },                          addOns: {} },
      { eventKey: "sangeeth",      duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "muhurtham",     duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
      { eventKey: "reception",     duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
  "Hindu (North Indian)": {
    messageKey: "hinduNorthIndian",
    events: [
      { eventKey: "roka",          duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
      { eventKey: "haldi",         duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
      { eventKey: "mehendi",       duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "sangeet",       duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "baraatWedding", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
      { eventKey: "reception",     duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
  "Muslim Wedding": {
    messageKey: "muslimWedding",
    events: [
      { eventKey: "haldiUbtan",      duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
      { eventKey: "mehendi",         duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "nikah",           duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
      { eventKey: "walimaReception", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
  "Christian Wedding": {
    messageKey: "christianWedding",
    events: [
      { eventKey: "engagement",     duration: "Half Day", services: { "candid-photo": 1, "traditional-photo": 1 }, addOns: {} },
      { eventKey: "churchCeremony", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
      { eventKey: "receptionParty", duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
  "Sikh Wedding": {
    messageKey: "sikhWedding",
    events: [
      { eventKey: "mehendi",    duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "anandKaraj", duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
      { eventKey: "reception",  duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
  Engagement: {
    messageKey: "engagement",
    events: [
      { eventKey: "ringCeremony",       duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "cocktailAfterParty", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
    ],
  },
  "Pre-Wedding Shoot": {
    messageKey: "preWeddingShoot",
    events: [
      { eventKey: "preWeddingPhotoshoot", duration: "Half Day", services: { "candid-photo": 1 }, addOns: { drone: 1 } },
    ],
  },
  "Baby / Maternity": {
    messageKey: "babyMaternity",
    events: [
      { eventKey: "photoshootSession", duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
    ],
  },
  "Birthday / Event": {
    messageKey: "birthdayEvent",
    events: [
      { eventKey: "eventCoverage", duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
  Housewarming: {
    messageKey: "housewarming",
    events: [
      { eventKey: "housewarming", duration: "Half Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
  "Corporate Event": {
    messageKey: "corporateEvent",
    events: [
      { eventKey: "conferenceSeminar", duration: "Full Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
      { eventKey: "awardCeremony",     duration: "Half Day", services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
    ],
  },
}

// ============================================================
// Service-entry preset mappings
//
// Explicit ordered rules mapping service slug/name patterns to
// a preset composition. Replaces implicit regex-string matching
// in the pricing page with a declared, stable lookup table.
// First matching rule wins.
// ============================================================

export interface ServiceEntryPresetSpec {
  duration: "Half Day" | "Full Day"
  services: Record<string, number>
  addOns: Record<string, number>
}

export const SERVICE_ENTRY_PRESET_RULES: ReadonlyArray<{
  readonly key: string
  readonly matches: ReadonlyArray<string>
  readonly preset: ServiceEntryPresetSpec
}> = [
  {
    key: "pre-wedding",
    matches: ["pre-wedding", "post-wedding"],
    preset: { duration: "Half Day", services: { "candid-photo": 1 }, addOns: { drone: 1 } },
  },
  {
    key: "engagement-anniversary",
    matches: ["engagement", "anniversary"],
    preset: { duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
  },
  {
    key: "baby-maternity",
    matches: ["baby", "maternity", "newborn"],
    preset: { duration: "Half Day", services: { "candid-photo": 1 }, addOns: {} },
  },
  {
    key: "corporate",
    matches: ["corporate", "conference", "seminar", "award"],
    preset: { duration: "Full Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
  },
  {
    key: "housewarming",
    matches: ["housewarming"],
    preset: { duration: "Half Day", services: { "traditional-photo": 1, "traditional-video": 1 }, addOns: {} },
  },
  {
    key: "birthday-event",
    matches: ["birthday", "naming", "cradle", "haldi", "mehendi", "sangeet", "event"],
    preset: { duration: "Half Day", services: { "candid-photo": 1, "traditional-video": 1 }, addOns: {} },
  },
  {
    key: "cinematic-video",
    matches: ["cinematic"],
    preset: { duration: "Half Day", services: { "cinematic-video": 1 }, addOns: {} },
  },
  {
    key: "traditional-video",
    matches: ["videography", "video"],
    preset: { duration: "Half Day", services: { "traditional-video": 1 }, addOns: {} },
  },
  {
    key: "drone",
    matches: ["drone"],
    preset: { duration: "Half Day", services: { "candid-photo": 1 }, addOns: { drone: 1 } },
  },
  {
    key: "portrait-studio-product",
    matches: ["portrait", "portfolio", "studio", "product"],
    preset: { duration: "Half Day", services: { "traditional-photo": 1 }, addOns: {} },
  },
  {
    key: "wedding",
    matches: ["wedding"],
    preset: { duration: "Full Day", services: { "traditional-photo": 1, "candid-photo": 1 }, addOns: {} },
  },
]

/**
 * Resolve the service-entry preset for a given service slug and name.
 * Returns the first matching preset spec, or null if no rule matches.
 */
export function resolveServiceEntryPreset(serviceSlug: string, serviceName: string): ServiceEntryPresetSpec | null {
  const lookup = `${serviceSlug} ${serviceName}`.toLowerCase()
  for (const rule of SERVICE_ENTRY_PRESET_RULES) {
    if (rule.matches.some((term) => lookup.includes(term))) {
      return rule.preset
    }
  }
  return null
}

// ============================================================
// Coverage profile semantics (ISSUE-008)
//
// Canonical commercial definitions for all photo + video coverage
// combinations. Replaces the earlier HybridCoverageProfile model
// with a richer CoverageProfile that includes stable profile IDs,
// i18n message keys, crew semantics, canonical deliverable categories,
// and applicable service-family identifiers.
//
// Backward-compatible aliases (HybridCoverageType, HybridCoverageProfile,
// HYBRID_COVERAGE_PROFILES) are preserved so existing import sites
// continue to compile without changes.
//
// Label and summary text live in pricingPage.coverageProfiles i18n messages.
// Package and rate ownership remain in lib/constants.ts.
// Use detectCoverageProfile() to classify an active service selection.
// ============================================================

/** Stable identifier for a coverage profile */
export type CoverageProfileId =
  | "photo-only"
  | "video-only"
  | "photo-standard"
  | "photo-cinematic"
  | "full-coverage"

/** Backward-compatible alias — prefer CoverageProfileId for new code */
export type HybridCoverageType = CoverageProfileId

/** Canonical deliverable category tokens */
export type CoverageDeliverable = "photos" | "standard-video" | "cinematic-film"

/** Full canonical coverage profile definition */
export interface CoverageProfile {
  /** Stable profile ID */
  id: CoverageProfileId
  /** camelCase key into pricingPage.coverageProfiles i18n messages (label + summary + crewLabel) */
  messageKey: string
  /** Whether this constitutes a combined photo + video offering */
  isHybrid: boolean
  /** Service IDs that characterise this coverage type (used for detectCoverageProfile) */
  serviceIds: readonly string[]
  /** Canonical crew description string (English). Localized via quote-localization.ts or i18n messageKey. */
  crew: string
  /** Canonical deliverable categories for this profile */
  deliverables: readonly CoverageDeliverable[]
  /** Service page family slugs this profile is applicable to */
  applicableFamilies: readonly string[]
}

/** Backward-compatible alias — prefer CoverageProfile for new code */
export type HybridCoverageProfile = CoverageProfile

/**
 * Canonical coverage profiles keyed by CoverageProfileId.
 * Crew strings and deliverables are structural metadata; label and summary copy
 * live in pricingPage.coverageProfiles i18n messages at the messageKey.
 */
export const COVERAGE_PROFILES: Record<CoverageProfileId, CoverageProfile> = {
  "photo-only": {
    id: "photo-only",
    messageKey: "photoOnly",
    isHybrid: false,
    serviceIds: ["traditional-photo", "candid-photo"],
    crew: "1 Photographer",
    deliverables: ["photos"],
    applicableFamilies: [
      "wedding-photography", "pre-wedding-photoshoot", "engagement-photography",
      "baby-photoshoot", "maternity-photography", "birthday-photography",
      "housewarming-photography", "events-photography", "corporate-photography",
    ],
  },
  "video-only": {
    id: "video-only",
    messageKey: "videoOnly",
    isHybrid: false,
    serviceIds: ["traditional-video", "cinematic-video"],
    crew: "1 Videographer",
    deliverables: ["standard-video"],
    applicableFamilies: [
      "wedding-photography", "birthday-photography",
      "housewarming-photography", "events-photography", "corporate-photography",
    ],
  },
  "photo-standard": {
    id: "photo-standard",
    messageKey: "photoStandard",
    isHybrid: true,
    serviceIds: ["traditional-photo", "candid-photo", "traditional-video"],
    crew: "1 Photographer + 1 Videographer",
    deliverables: ["photos", "standard-video"],
    applicableFamilies: [
      "wedding-photography", "birthday-photography",
      "housewarming-photography", "events-photography", "corporate-photography",
    ],
  },
  "photo-cinematic": {
    id: "photo-cinematic",
    messageKey: "photoCinematic",
    isHybrid: true,
    serviceIds: ["traditional-photo", "candid-photo", "cinematic-video"],
    crew: "1 Photographer + 1 Cinematographer",
    deliverables: ["photos", "cinematic-film"],
    applicableFamilies: [
      "wedding-photography", "pre-wedding-photoshoot", "engagement-photography",
      "birthday-photography", "corporate-photography",
    ],
  },
  "full-coverage": {
    id: "full-coverage",
    messageKey: "fullCoverage",
    isHybrid: true,
    serviceIds: ["traditional-photo", "candid-photo", "traditional-video", "cinematic-video"],
    crew: "2 Photographers + 1 Videographer + 1 Cinematographer",
    deliverables: ["photos", "standard-video", "cinematic-film"],
    applicableFamilies: [
      "wedding-photography", "events-photography", "corporate-photography",
    ],
  },
}

/** Backward-compatible alias — prefer COVERAGE_PROFILES for new code */
export const HYBRID_COVERAGE_PROFILES: Record<HybridCoverageType, HybridCoverageProfile> = COVERAGE_PROFILES

const PHOTO_IDS = new Set(["traditional-photo", "candid-photo"])
const VIDEO_IDS = new Set(["traditional-video", "cinematic-video"])

/**
 * Service display names to canonical service IDs, covering all supported locales.
 * buildBookingPlan() serializes the locale-active serviceCatalog label into PlanData
 * and QuotePayload selections, so both EN and HI names must be present here.
 * Add-on names (Drone Coverage, etc.) are intentionally absent and silently ignored.
 */
const SERVICE_DISPLAY_NAME_TO_ID: Record<string, string> = {
  // EN — messages.builder.serviceCatalog.*.name in EN locale
  "Traditional Photography": "traditional-photo",
  "Candid Photography": "candid-photo",
  "Traditional Videography": "traditional-video",
  "Cinematic Videography": "cinematic-video",
  // HI — messages.builder.serviceCatalog.*.name in HI locale
  "ट्रेडिशनल फोटोग्राफी": "traditional-photo",
  "कैंडिड फोटोग्राफी": "candid-photo",
  "ट्रेडिशनल वीडियोग्राफी": "traditional-video",
  "सिनेमैटिक वीडियोग्राफी": "cinematic-video",
}

/**
 * Classify a list of English service selection display names into a CoverageProfileId.
 * Use this to derive a profile from plan/quote data where service IDs are not stored.
 * Non-service names (add-ons, event names) are silently ignored.
 * Returns null if no recognised service names are present.
 */
export function detectCoverageProfileFromSelectionNames(names: string[]): CoverageProfileId | null {
  const services: Record<string, number> = {}
  for (const name of names) {
    const id = SERVICE_DISPLAY_NAME_TO_ID[name]
    if (id) services[id] = (services[id] ?? 0) + 1
  }
  return detectCoverageProfile(services)
}

/**
 * Detect the coverage profile for a builderPreset-style events array. * Merges service selections across all events (taking the maximum quantity
 * seen per service ID), then delegates to detectCoverageProfile().
 * Use this to classify what a package or template composition delivers.
 */
export function resolvePresetCoverageProfile(
  events: ReadonlyArray<{ services: Record<string, number> }>
): CoverageProfileId | null {
  const merged: Record<string, number> = {}
  for (const event of events) {
    for (const [id, qty] of Object.entries(event.services)) {
      merged[id] = Math.max(merged[id] ?? 0, qty)
    }
  }
  return detectCoverageProfile(merged)
}

/**
 * Classify a service selection map into a CoverageProfileId.
 * Returns null if no services are selected.
 */
export function detectCoverageProfile(services: Record<string, number>): CoverageProfileId | null {
  const active = Object.keys(services).filter((id) => (services[id] ?? 0) > 0)
  const hasPhoto = active.some((id) => PHOTO_IDS.has(id))
  const hasVideo = active.some((id) => VIDEO_IDS.has(id))
  const hasCinematic = active.includes("cinematic-video")
  const hasTraditionalVideo = active.includes("traditional-video")

  if (!hasPhoto && !hasVideo) return null
  if (hasPhoto && !hasVideo) return "photo-only"
  if (!hasPhoto && hasVideo) return "video-only"
  if (hasPhoto && hasTraditionalVideo && hasCinematic) return "full-coverage"
  if (hasPhoto && hasCinematic) return "photo-cinematic"
  if (hasPhoto && hasTraditionalVideo) return "photo-standard"
  return null
}
