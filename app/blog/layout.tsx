import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography Blog — Tips, Guides & Pricing | Orvex Visuals Bangalore",
  description:
    "Photography tips, location guides, pricing breakdowns, and expert advice for Bangalore. Pre-wedding spots, wedding costs, baby shoot ideas & more.",
  openGraph: {
    title: "Photography Blog | Orvex Visuals Bangalore",
    description: "Expert photography guides, tips, and pricing info for Bangalore.",
    type: "website",
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
