import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Start a Booking Request in Bangalore",
  description:
    "Share your event details, review your plan, and get clear next steps on pricing and availability from Orvex Visuals.",
  openGraph: {
    title: "Start a Booking Request | Orvex Visuals Bangalore",
    description: "Share your event details and receive clear next steps on pricing and availability.",
    type: "website",
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
