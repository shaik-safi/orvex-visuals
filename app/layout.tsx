import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import { DOMAIN, EMAIL, PHONE_DISPLAY, PRICE_RANGE, SOCIAL_LINKS } from "@/lib/constants"
import { buildLocalizedMetadata, getAbsoluteUrl, getLocalizedPathname, getMetadataCopy } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"
import { getLocaleTag } from "@/lib/i18n/config"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-body" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const copy = getMetadataCopy("root", locale)

  return {
    metadataBase: new URL(DOMAIN),
    title: {
      default: copy.title,
      template: "%s | Orvex Visuals",
    },
    creator: "Orvex Visuals",
    publisher: "Orvex Visuals",
    ...buildLocalizedMetadata(locale, {
      pathname: "/",
      title: copy.title,
      description: copy.description,
      keywords: copy.keywords,
      authors: [{ name: "Orvex Visuals" }],
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        title: copy.openGraphTitle,
        description: copy.openGraphDescription,
      },
      twitter: {
        title: copy.openGraphTitle,
        description: copy.openGraphDescription,
      },
    }),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await resolveRequestLocale()
  const copy = getMetadataCopy("root", locale)
  const localizedHomeUrl = getAbsoluteUrl(getLocalizedPathname("/", locale))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${DOMAIN}/#business`,
    name: "Orvex Visuals",
    description: copy.description,
    url: localizedHomeUrl,
    telephone: PHONE_DISPLAY,
    email: EMAIL,
    image: getAbsoluteUrl("/orvex-logo-new.png"),
    logo: getAbsoluteUrl("/orvex-logo-new.png"),
    priceRange: PRICE_RANGE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Koramangala",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560034",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9352,
      longitude: 77.6245,
    },
    areaServed: {
      "@type": "City",
      name: "Bangalore",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.facebook,
    ],
  }

  return (
    <html lang={getLocaleTag(locale)} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  )
}
