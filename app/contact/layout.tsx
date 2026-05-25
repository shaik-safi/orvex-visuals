import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Orvex Visuals — Book Your Photographer in Bangalore",
  description:
    "Get in touch with Orvex Visuals. Book a photographer, get a free quote, or ask questions. WhatsApp, call, or fill our form. Response within 2 hours.",
  keywords: ["contact photographer Bangalore", "book photographer online", "photography quote", "Orvex Visuals contact"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Orvex Visuals | Book a Photographer Bangalore",
    description: "Book your photographer in Bangalore. Free quote within 2 hours. WhatsApp or form.",
    url: "https://orvexvisuals.com/contact",
    type: "website",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
