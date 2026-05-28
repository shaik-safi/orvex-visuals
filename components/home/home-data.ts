import { services as allServices } from "@/app/services/data"

const homepageSlugs = [
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

export const homeServices = homepageSlugs.flatMap((slug) => {
  const service = allServices.find((item) => item.slug === slug)
  if (!service) return []

  return [{
    name: service.name,
    icon: service.icon,
    price: `Rs.${service.startingPrice.toLocaleString("en-IN")}`,
    desc: service.description,
    slug: service.slug,
  }]
})
