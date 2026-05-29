import type { ReactNode } from "react"
import type { Metadata } from "next"
import { buildLocalizedMetadata, getMetadataCopy } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const copy = getMetadataCopy("about", locale)

  return buildLocalizedMetadata(locale, {
    pathname: "/about",
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: copy.openGraphTitle,
      description: copy.openGraphDescription,
    },
  })
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
