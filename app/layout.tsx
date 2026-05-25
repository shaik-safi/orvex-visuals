import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-body" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" })

export const metadata: Metadata = {
  title: {
    default: "Orvex Visuals — Premium Photography & Videography in Bangalore",
    template: "%s | Orvex Visuals",
  },
  description:
    "Professional photography & videography in Bangalore. Transparent pricing, 5-day delivery, 100% copyright yours. Wedding, pre-wedding, baby shoots, events & more. Starting ₹7,999.",
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
  metadataBase: new URL("https://orvexvisuals.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://orvexvisuals.com",
    siteName: "Orvex Visuals",
    title: "Orvex Visuals — Premium Photography & Videography in Bangalore",
    description:
      "Professional photography & videography in Bangalore. Transparent pricing, 5-day delivery, 100% copyright yours. Starting ₹7,999.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Orvex Visuals — Wedding Photography in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orvex Visuals — Premium Photography & Videography in Bangalore",
    description:
      "Professional photography & videography in Bangalore. Transparent pricing, 5-day delivery, 100% copyright yours.",
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&q=80"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://orvexvisuals.com/#business",
    name: "Orvex Visuals",
    description:
      "Professional photography & videography studio in Bangalore. Wedding, pre-wedding, baby shoots, events & more. 5-day delivery, transparent pricing.",
    url: "https://orvexvisuals.com",
    telephone: "+91-9845332306",
    email: "hello@orvexvisuals.com",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&q=80",
    logo: "https://orvexvisuals.com/logo.png",
    priceRange: "₹7,999 - ₹1,50,000",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "500",
      bestRating: "5",
    },
    sameAs: [
      "https://www.instagram.com/orvexvisuals",
      "https://www.facebook.com/orvexvisuals",
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
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
