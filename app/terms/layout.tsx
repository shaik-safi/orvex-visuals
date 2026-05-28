import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for Orvex Visuals photography services. Booking policies, cancellations, usage rights, and service agreements.",
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
