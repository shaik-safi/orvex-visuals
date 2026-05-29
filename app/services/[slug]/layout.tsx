import type { Metadata } from "next"
import type React from "react"
import { PHOTO_DELIVERY_DAYS } from "@/lib/constants"
import { buildLocalizedMetadata } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"
import { getServiceDetail, services } from "../data"

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const { slug } = await params
  const service = getServiceDetail(slug)
  const startingPrice = service.packages[0]?.price.toLocaleString("en-IN") || "7,999"

  const title = locale === "hi"
    ? `${service.name} बेंगलुरु में - शुरुआती कीमत ₹${startingPrice}`
    : `${service.name} in Bangalore - Starting ₹${startingPrice}`

  const description = locale === "hi"
    ? `${service.description} Orvex Visuals द्वारा बेंगलुरु में प्रोफेशनल ${service.name} सेवाएं। ${service.packages.length} पैकेज ₹${startingPrice} से शुरू। ${PHOTO_DELIVERY_DAYS}-दिन की फोटो डिलीवरी और GST शामिल।`
    : `${service.description} Professional ${service.name.toLowerCase()} services in Bangalore by Orvex Visuals. ${service.packages.length} packages starting ₹${startingPrice}. ${PHOTO_DELIVERY_DAYS}-day photo delivery, GST inclusive.`

  return buildLocalizedMetadata(locale, {
    pathname: `/services/${slug}`,
    title,
    description,
    keywords: [
      `${service.name.toLowerCase()} Bangalore`,
      `${service.name.toLowerCase()} near me`,
      `best ${service.name.toLowerCase()}`,
      `${service.name.toLowerCase()} price`,
      `${service.name.toLowerCase()} packages`,
      "photographer Bangalore",
      "Orvex Visuals",
    ],
    openGraph: {
      type: "website",
      title: locale === "hi" ? `${service.name} - Orvex Visuals बेंगलुरु` : `${service.name} - Orvex Visuals Bangalore`,
      images: [
        {
          url: service.heroImage,
          width: 1200,
          height: 630,
          alt: locale === "hi" ? `${service.name} - Orvex Visuals बेंगलुरु` : `${service.name} by Orvex Visuals Bangalore`,
        },
      ],
    },
    twitter: {
      images: [service.heroImage],
    },
  })
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
