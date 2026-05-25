import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography Services in Bangalore — Wedding, Events, Baby | Orvex Visuals",
  description:
    "Explore 23+ photography & videography services in Bangalore. Wedding, pre-wedding, baby, events, drone & more. Transparent pricing, 5-day delivery. Book now!",
  openGraph: {
    title: "Photography Services in Bangalore | Orvex Visuals",
    description: "Professional photography services starting ₹8,000. Wedding, pre-wedding, baby shoots & more.",
    type: "website",
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
