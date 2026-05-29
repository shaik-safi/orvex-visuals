import type React from "react"
import type { Metadata } from "next"
import { buildLocalizedMetadata, getMetadataCopy } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const copy = getMetadataCopy("contact", locale)

  return buildLocalizedMetadata(locale, {
    pathname: "/contact",
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    openGraph: {
      title: copy.openGraphTitle,
      description: copy.openGraphDescription,
    },
  })
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
