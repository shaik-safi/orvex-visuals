import { getLocalizedServices } from "@/app/services/data"
import type { AppLocale } from "@/lib/i18n/config"

export const homepageSlugs = [
  "wedding-photography",
  "wedding-videography",
  "pre-wedding-photoshoot",
  "engagement-photography",
  "birthday-photography",
  "baby-shower-photography",
  "haldi-mehendi-photography",
  "sangeet-photography",
  "naming-ceremony-photography",
  "anniversary-photoshoot",
  "corporate-photography",
  "drone-photography",
]

export function getHomeServices(locale: AppLocale) {
  const services = getLocalizedServices(locale)

  return homepageSlugs.flatMap((slug) => {
    const service = services.find((item) => item.slug === slug)
    if (!service) return []

    return [{
      name: service.name,
      icon: service.icon,
      price: `₹${service.startingPrice.toLocaleString("en-IN")}`,
      desc: service.description,
      slug: service.slug,
    }]
  })
}
