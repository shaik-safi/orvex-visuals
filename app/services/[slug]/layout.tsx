import type { Metadata } from "next"
import type React from "react"
import { getServiceDetail, services } from "../data"

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceDetail(slug)

  const title = `${service.name} in Bangalore — Starting ₹${service.packages[0]?.price.toLocaleString("en-IN") || "7,999"}`
  const description = `${service.description} Professional ${service.name.toLowerCase()} services in Bangalore by Orvex Visuals. ${service.packages.length} packages starting ₹${service.packages[0]?.price.toLocaleString("en-IN")}. 5-day delivery, GST inclusive.`

  return {
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
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      type: "website",
      title: `${service.name} — Orvex Visuals Bangalore`,
      description,
      url: `https://orvexvisuals.com/services/${slug}`,
      siteName: "Orvex Visuals",
      images: [
        {
          url: service.heroImage,
          width: 1200,
          height: 630,
          alt: `${service.name} by Orvex Visuals Bangalore`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} — Orvex Visuals Bangalore`,
      description,
      images: [service.heroImage],
    },
  }
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
