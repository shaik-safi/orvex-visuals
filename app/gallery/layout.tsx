import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio Gallery — Wedding & Event Photography | Orvex Visuals",
  description:
    "Browse our photography portfolio. Wedding, pre-wedding, baby, events & portrait photography in Bangalore. See our best work and get inspired.",
  keywords: ["photography portfolio Bangalore", "wedding photo gallery", "candid photography samples", "pre-wedding shoot gallery"],
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Photography Portfolio Gallery | Orvex Visuals Bangalore",
    description: "Stunning wedding, pre-wedding & event photography portfolio. Candid moments, artistic portraits.",
    url: "https://orvexvisuals.com/gallery",
    type: "website",
    images: [{ url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&q=80", width: 1200, height: 630 }],
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
