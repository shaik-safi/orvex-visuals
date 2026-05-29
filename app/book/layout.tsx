import type React from "react"
import type { Metadata } from "next"
import { buildLocalizedMetadata, getMetadataCopy } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const copy = getMetadataCopy("book", locale)

  return buildLocalizedMetadata(locale, {
    pathname: "/book",
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: copy.openGraphTitle,
      description: copy.openGraphDescription,
    },
  })
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
