import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography Pricing in Bangalore (2026) — Transparent Rates",
  description:
    "See clear GST-inclusive photography pricing for weddings, pre-Wedding shoots, baby sessions, and events in bangalore before you send a request.",
  keywords: ["photography pricing Bangalore", "wedding photographer cost", "cheap photographer Bangalore", "photography packages with prices"],
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Photography Pricing Bangalore 2026 | Orvex Visuals",
    description: "Transparent GST-inclusive pricing. Wedding, pre-wedding, baby & event photography packages.",
    url: "https://orvexvisuals.com/pricing",
    type: "website",
    images: [{ url: "/og-default.webp", width: 1200, height: 630 }],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
