import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography Services in Bangalore — Wedding, Events, Baby",
  description:
    "Explore 41+ photography and videography services in Bangalore for Wedding, pre-wedding shoots, baby sessions, events, drone coverage, and more.",
  openGraph: {
    title: "Photography Services in Bangalore | Orvex Visuals",
    description: "Professional photography services starting ₹8,000. Wedding, pre-wedding, baby shoots & more.",
    type: "website",
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
