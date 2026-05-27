// ============================================================
// ORVEX VISUALS — Global Constants
// Single source of truth for contact info, links, and config
// ============================================================

export const PHONE_NUMBER = "919845332306"
export const PHONE_DISPLAY = "+91 98453 32306"
export const EMAIL = "orvexvisuals@gmail.com"
export const BRAND_NAME = "Orvex Visuals"
export const DOMAIN = "https://orvexvisuals.com"
export const BOOKING_PLAN_STORAGE_KEY = "orvex-booking-plan"
export const PHOTO_DELIVERY_DAYS = 5
export const VIDEO_DELIVERY_DAYS = 15
export const RESPONSE_TIME_PROMISE = "within 2 hours"
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/orvexvisuals",
  facebook: "https://www.facebook.com/orvexvisuals",
} as const

// WhatsApp link builder
export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${PHONE_NUMBER}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

// Pre-built WhatsApp messages
export const WA_MESSAGES = {
  general: "Hi Orvex Visuals, I have a question",
  booking: "Hi Orvex, I'd like to check availability for my event",
  quote: "Hi Orvex, I'd like to check availability and get a quote",
  pricing: (pkg: string, price: string) =>
    `Hi Orvex, I'm interested in the ${pkg} package (₹${price})`,
  service: (name: string) => `Hi Orvex, I'm interested in ${name}`,
  customPlan: (details: string) => `Hi Orvex! I built a custom plan:\n\n${details}\n\nPlease confirm availability!`,
} as const

// ============ PRICING (Single Source of Truth) ============
// Calculator service rates (per-day)
export const SERVICE_RATES = {
  "traditional-photo": { name: "Traditional Photography", ratePerDay: 10000, ratePerHalfDay: 6000 },
  "candid-photo": { name: "Candid Photography", ratePerDay: 18000, ratePerHalfDay: 12000 },
  "traditional-video": { name: "Traditional Videography", ratePerDay: 10000, ratePerHalfDay: 6000 },
  "cinematic-video": { name: "Cinematic Videography", ratePerDay: 15000, ratePerHalfDay: 10000 },
} as const

export const EVENT_ADDONS = {
  drone: { name: "Drone Coverage", price: 5000 },
  "led-wall": { name: "LED Wall Setup", price: 10000 },
  "same-day-edit": { name: "Same-Day Edit", price: 7000 },
  "live-stream": { name: "Live Streaming", price: 5000 },
} as const

export const GLOBAL_ADDONS = {
  "album-25": { name: "Photo Album (25 sheets)", price: 5000 },
  "album-40": { name: "Photo Album (40 sheets)", price: 8000 },
} as const

// Miscellaneous service starting prices (editing, portraits, products, prints)
// Change here to update all service listing pages automatically
export const MISC_SERVICE_RATES = {
  videoEditing: 5000,
  portrait: 5000,
  portfolio: 8000,
  productPhoto: 5000,
  studioSession: 2000,
  albumDesign: 5000,
  photoFrame: 1500,
  photoRestoration: 500,
  personalizedGift: 500,
} as const

// Pre-built packages (pricing page + homepage CTA)
// Price is COMPUTED from SERVICE_RATES + EVENT_ADDONS + GLOBAL_ADDONS via computePackagePrice()
// Change a rate in one place → all package prices update automatically
export const PACKAGES = [
  {
    name: "Starter",
    subtitle: "Perfect for intimate events",
    features: [
      "1 Candid Photographer",
      "Half-day coverage (5 hours)",
      "Unlimited soft copies",
      "50+ edited highlights",
      "Digital delivery in 5 days",
      "Pre-event planning call",
    ],
    notIncluded: ["Video", "Drone", "Album"],
    builderPreset: {
      events: [
        { name: "Your Event", duration: "Half Day" as const, services: { "candid-photo": 1 }, addOns: {} },
      ],
      globalAddOns: {} as Record<string, number>,
    },
  },
  {
    name: "Signature",
    subtitle: "Most popular for weddings",
    popular: true,
    features: [
      "2 Photographers (Traditional + Candid)",
      "Full day coverage (10 hours)",
      "Cinematic highlight reel",
      "Drone aerial coverage",
      "25-sheet premium album",
      "150+ edited highlights",
      "Digital delivery in 5 days",
      "Dedicated coordinator",
    ],
    notIncluded: ["LED Wall", "Same-Day Edit"],
    builderPreset: {
      events: [
        { name: "Your Event", duration: "Full Day" as const, services: { "traditional-photo": 1, "candid-photo": 1, "cinematic-video": 1 }, addOns: { drone: 1 } },
      ],
      globalAddOns: { "album-25": 1 } as Record<string, number>,
    },
  },
  {
    name: "Grand",
    subtitle: "The complete experience",
    features: [
      "2 Photographers + Videographer",
      "Full day coverage (10 hours)",
      "Cinematic film + Traditional video",
      "Same-day edit highlight",
      "Drone aerial coverage",
      "LED Wall backdrop",
      "40-sheet premium album",
      "300+ edited highlights",
      "Priority 3-day delivery",
    ],
    notIncluded: [],
    builderPreset: {
      events: [
        { name: "Your Event", duration: "Full Day" as const, services: { "traditional-photo": 1, "candid-photo": 1, "traditional-video": 1, "cinematic-video": 1 }, addOns: { drone: 1, "same-day-edit": 1, "led-wall": 1 } },
      ],
      globalAddOns: { "album-40": 1 } as Record<string, number>,
    },
  },
]

// Compute package price from the rate list — single source of truth
export function computePackagePrice(pkg: (typeof PACKAGES)[number]): number {
  let total = 0
  for (const event of pkg.builderPreset.events) {
    for (const [serviceId, qty] of Object.entries(event.services)) {
      const rate = SERVICE_RATES[serviceId as keyof typeof SERVICE_RATES]
      if (!rate) continue
      total += (event.duration === "Full Day" ? rate.ratePerDay : rate.ratePerHalfDay) * qty
    }
    for (const [addonId, qty] of Object.entries(event.addOns)) {
      const addon = EVENT_ADDONS[addonId as keyof typeof EVENT_ADDONS]
      if (addon) total += addon.price * qty
    }
  }
  for (const [addonId, qty] of Object.entries(pkg.builderPreset.globalAddOns)) {
    const addon = GLOBAL_ADDONS[addonId as keyof typeof GLOBAL_ADDONS]
    if (addon) total += addon.price * qty
  }
  return total
}

// Half-day Traditional photography/Vidography price across all services (for SEO meta)
export const STARTING_PRICE = 6000
export const PRICE_RANGE = "₹6,000 - ₹1,50,000"

// Local image paths
export const IMAGES = {
  hero: [
    "/images/portfolio/hero-1.webp",
    "/images/portfolio/hero-2.webp",
    "/images/portfolio/hero-3.webp",
  ],
  about: [
    "/images/portfolio/about-1.webp",
    "/images/portfolio/about-2.webp",
    "/images/portfolio/about-3.webp",
    "/images/portfolio/about-4.webp",
  ],
  logo: "/images/logo.png",
  ogImage: "/images/og-cover.webp",
} as const
