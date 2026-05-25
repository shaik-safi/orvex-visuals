// ============================================================
// ORVEX VISUALS — Global Constants
// Single source of truth for contact info, links, and config
// ============================================================

export const PHONE_NUMBER = "919845332306"
export const PHONE_DISPLAY = "+91 98453 32306"
export const EMAIL = "hello@orvexvisuals.com"
export const BRAND_NAME = "Orvex Visuals"
export const DOMAIN = "https://orvexvisuals.com"

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

// Local image paths
export const IMAGES = {
  hero: [
    "/images/portfolio/hero-1.jpg",
    "/images/portfolio/hero-2.jpg",
    "/images/portfolio/hero-3.jpg",
  ],
  about: [
    "/images/portfolio/about-1.jpg",
    "/images/portfolio/about-2.jpg",
    "/images/portfolio/about-3.jpg",
    "/images/portfolio/about-4.jpg",
  ],
  logo: "/images/logo.png",
  ogImage: "/images/og-cover.jpg",
} as const
