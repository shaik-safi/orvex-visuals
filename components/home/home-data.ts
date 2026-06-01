import { getLocalizedServices, getServiceClassification } from "@/app/services/data"
import type { AppLocale } from "@/lib/i18n/config"

export const homepageSlugs = [
  // ── Parent Product Pages (event-first hierarchy) ──────────
  "wedding-photography",
  "pre-wedding-photoshoot",
  "engagement-photography",
  "birthday-photography",
  "housewarming-photography",
  "events-photography",
  "baby-photoshoot",
  "maternity-photography",
  "corporate-photography",
]

export function getHomeServices(locale: AppLocale) {
  const services = getLocalizedServices(locale)

  return homepageSlugs.flatMap((slug) => {
    const service = services.find((item) => item.slug === slug)
    if (!service) return []

    const { role } = getServiceClassification(slug)

    return [{
      name: service.name,
      icon: service.icon,
      price: role === "parent" ? `₹${service.startingPrice.toLocaleString("en-IN")}` : null,
      desc: service.description,
      slug: service.slug,
    }]
  })
}
