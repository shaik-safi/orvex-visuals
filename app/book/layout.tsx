import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Photographer in Bangalore — Free Quote | Orvex Visuals",
  description:
    "Book your photographer in 2 minutes. Fill the form, get a free quote within 2 hours. Wedding, pre-wedding, baby, events. No call needed.",
  openGraph: {
    title: "Book a Photographer | Orvex Visuals Bangalore",
    description: "Quick booking form. Free quote within 2 hours. GST-inclusive transparent pricing.",
    type: "website",
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
