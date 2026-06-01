import type { Metadata } from "next"
import type React from "react"
import { PHOTO_DELIVERY_DAYS } from "@/lib/constants"
import { buildLocalizedMetadata } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"
import { getLocalizedServiceDetail, getServiceClassification, services } from "../data"

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const { slug } = await params
  const service = getLocalizedServiceDetail(slug, locale)
  const { role } = getServiceClassification(slug)
  const isAncillary = role === "ancillary"

  const title = locale === "hi"
    ? `${service.name} बेंगलुरु में - Orvex Visuals`
    : `${service.name} in Bangalore - Orvex Visuals`

  const descriptionSuffix = isAncillary
    ? locale === "hi"
      ? " अपने प्रोजेक्ट के बारे में बात करने के लिए संपर्क करें।"
      : " Contact us to discuss your project."
    : locale === "hi"
      ? ` ${PHOTO_DELIVERY_DAYS}-दिन की फोटो डिलीवरी और GST शामिल। ऑनलाइन प्राइसिंग देखें।`
      : ` ${PHOTO_DELIVERY_DAYS}-day photo delivery, GST inclusive. View pricing online.`

  const description = locale === "hi"
    ? `${service.description} Orvex Visuals द्वारा बेंगलुरु में प्रोफेशनल ${service.name} सेवाएं।${descriptionSuffix}`
    : `${service.description} Professional ${service.name.toLowerCase()} services in Bangalore by Orvex Visuals.${descriptionSuffix}`

  const keywords = isAncillary
    ? locale === "hi"
      ? [
          `${service.name} बेंगलुरु`,
          `${service.name} मेरे पास`,
          `${service.name} सेवा`,
          "बेंगलुरु फोटोग्राफर",
          "Orvex Visuals",
        ]
      : [
          `${service.name.toLowerCase()} Bangalore`,
          `${service.name.toLowerCase()} near me`,
          `${service.name.toLowerCase()} service`,
          "photographer Bangalore",
          "Orvex Visuals",
        ]
    : locale === "hi"
      ? [
          `${service.name} बेंगलुरु`,
          `${service.name} मेरे पास`,
          `${service.name} अनुमान`,
          `${service.name} प्राइसिंग`,
          "बेंगलुरु फोटोग्राफर",
          "Orvex Visuals",
        ]
      : [
          `${service.name.toLowerCase()} Bangalore`,
          `${service.name.toLowerCase()} near me`,
          `best ${service.name.toLowerCase()}`,
          `${service.name.toLowerCase()} pricing`,
          `${service.name.toLowerCase()} estimate`,
          "photographer Bangalore",
          "Orvex Visuals",
        ]

  return buildLocalizedMetadata(locale, {
    pathname: `/services/${slug}`,
    title,
    description,
    keywords,
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
