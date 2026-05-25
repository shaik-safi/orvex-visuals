import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Orvex Visuals — Premium Photography Coordination in Bangalore",
  description:
    "Learn about Orvex Visuals — Bangalore's modern photography coordination brand. Transparent pricing, fast delivery, you own every photo. Meet our team.",
  openGraph: {
    title: "About Orvex Visuals | Photography Coordination Bangalore",
    description: "Modern photography brand built on transparency, speed, and client ownership.",
    type: "website",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
