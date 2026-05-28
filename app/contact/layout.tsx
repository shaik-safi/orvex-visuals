import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact - Bangalore Photography Inquiries",
  description:
    "Ask questions, check availability, or share your event details with Orvex Visuals by WhatsApp, phone, or form.",
  keywords: ["contact photographer Bangalore", "book photographer online", "photography quote", "Orvex Visuals contact"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Orvex Visuals | Bangalore Photography Inquiries",
    description: "Ask questions, check availability, or share your event details with Orvex Visuals.",
    url: "https://orvexvisuals.com/contact",
    type: "website",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
