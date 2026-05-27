import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography Pricing in Bangalore (2026) — Transparent Rates | Orvex Visuals",
  description:
    "Complete photography pricing for Bangalore. Wedding from ₹20K, pre-wedding from ₹15K, events from ₹8K. All prices GST-inclusive. No hidden charges.",
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
