import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Orvex Visuals",
  description: "Privacy policy for Orvex Visuals photography services. How we collect, use, and protect your personal information.",
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
