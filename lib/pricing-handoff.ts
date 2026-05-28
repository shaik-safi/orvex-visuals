export interface PricingHandoffLinkOptions {
  from: string
  source?: string
  intent?: string
  service?: string
  packageName?: string
  template?: string
}

interface BlogPricingHandoffInput {
  title: string
  slug: string
  category: string
  tags?: string[]
}

export function buildPricingHandoffHref({
  from,
  source,
  intent,
  service,
  packageName,
  template,
}: PricingHandoffLinkOptions): string {
  const params = new URLSearchParams()
  params.set("from", from)
  if (source) params.set("source", source)
  if (intent) params.set("intent", intent)
  if (service) params.set("service", service)
  if (packageName) params.set("package", packageName)
  if (template) params.set("template", template)
  return `/pricing?${params.toString()}`
}

export function getGalleryPricingHandoff(category: string): PricingHandoffLinkOptions {
  const base = { from: "gallery", intent: "style" } as const

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
  const base = { from: "blog", source: title, intent: "quote" } as const

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