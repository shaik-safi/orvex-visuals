import type React from "react"
import type { Metadata } from "next"
import { buildLocalizedMetadata, getMetadataCopy } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const copy = getMetadataCopy("privacy", locale)

  return buildLocalizedMetadata(locale, {
    pathname: "/privacy-policy",
    title: copy.title,
    description: copy.description,
  })
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
