import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { headers } from "next/headers"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import { DOMAIN, EMAIL, PHONE_DISPLAY, PHOTO_DELIVERY_DAYS, PRICE_RANGE, SOCIAL_LINKS, STARTING_PRICE } from "@/lib/constants"
import { normalizeLocale } from "@/lib/i18n/config"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-body" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" })

export const metadata: Metadata = {
  title: {
    default: "Orvex Visuals — Premium Photography & Videography in Bangalore",
    template: "%s | Orvex Visuals",
  },
  description:
    `Professional photography & videography in Bangalore. Transparent pricing, ${PHOTO_DELIVERY_DAYS}-day photo delivery, 100% copyright yours. Wedding, pre-wedding, baby shoots, events & more. Starting ₹${STARTING_PRICE.toLocaleString("en-IN")}.`,
  keywords: [
    "photography in Bangalore",
    "wedding photographer Bangalore",
    "pre-wedding photoshoot Bangalore",
    "baby photoshoot Bangalore",
    "event photography Bangalore",
    "candid wedding photography",
    "videography Bangalore",
    "best photographer in Bangalore",
    "affordable photography Bangalore",
    "Orvex Visuals",
  ],
  authors: [{ name: "Orvex Visuals" }],
  creator: "Orvex Visuals",
  publisher: "Orvex Visuals",
  metadataBase: new URL(DOMAIN),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: DOMAIN,
    siteName: "Orvex Visuals",
    title: "Orvex Visuals — Premium Photography & Videography in Bangalore",
    description:
      `Professional photography & videography in Bangalore. Transparent pricing, ${PHOTO_DELIVERY_DAYS}-day photo delivery, 100% copyright yours. Starting ₹${STARTING_PRICE.toLocaleString("en-IN")}.`,
    images: [
      {
        url: `${DOMAIN}/placeholder.jpg`,
        width: 1200,
        height: 630,
        alt: "Orvex Visuals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orvex Visuals — Premium Photography & Videography in Bangalore",
    description:
      `Professional photography & videography in Bangalore. Transparent pricing, ${PHOTO_DELIVERY_DAYS}-day photo delivery, 100% copyright yours.`,
    images: [`${DOMAIN}/placeholder.jpg`],
  },
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const locale = normalizeLocale(requestHeaders.get("x-locale"))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://orvexvisuals.com/#business",
    name: "Orvex Visuals",
    description:
      `Professional photography & videography studio in Bangalore. Wedding, pre-wedding, baby shoots, events & more. ${PHOTO_DELIVERY_DAYS}-day photo delivery, transparent pricing.`,
    url: DOMAIN,
    telephone: PHONE_DISPLAY,
    email: EMAIL,
    image: `${DOMAIN}/placeholder.jpg`,
    logo: `${DOMAIN}/placeholder-logo.png`,
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased overflow-x-hidden`}>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  )
}
