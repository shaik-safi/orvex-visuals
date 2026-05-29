"use client"

import Link from "next/link"
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react"
import { BRAND_NAME, EMAIL, PHONE_DISPLAY, SOCIAL_LINKS } from "@/lib/constants"
import { useLocaleSync } from "@/lib/i18n/locale-sync"
import { withLocalePathname } from "@/lib/i18n/routing"
import { getCommonMessages } from "@/lib/i18n/common"

export default function Footer() {
  const { renderedLocale, routeLocale } = useLocaleSync()
  const messages = getCommonMessages(routeLocale)

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 border-b border-white/5 md:grid-cols-2 xl:grid-cols-4 xl:gap-12">
          {/* Brand */}
          <div className="md:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">OV</span>
              </div>
              <span className="text-xl font-bold text-white">{BRAND_NAME}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {messages.footer.brandLine1}
              {` ${messages.footer.brandLine2}`}
            </p>
            <div className="flex gap-2">
              <a aria-label={messages.footer.instagramAria} href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                <Instagram size={16} />
              </a>
              <a aria-label={messages.footer.facebookAria} href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-5">{messages.footer.servicesTitle}</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                [messages.footer.serviceLinks.wedding, "/services/wedding-photography"],
                [messages.footer.serviceLinks.preWedding, "/services/pre-wedding-photoshoot"],
                [messages.footer.serviceLinks.baby, "/services/baby-photoshoot"],
                [messages.footer.serviceLinks.event, "/services"],
                [messages.footer.serviceLinks.drone, "/services/drone-photography"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={withLocalePathname(href, routeLocale)} className="hover:text-amber-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">{messages.footer.quickLinksTitle}</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                [messages.footer.quickLinks.pricing, "/pricing"],
                [messages.footer.quickLinks.gallery, "/gallery"],
                [messages.footer.quickLinks.blog, "/blog"],
                [messages.footer.quickLinks.about, "/about"],
                [messages.footer.quickLinks.faqs, "/#faq"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href === "/#faq" ? withLocalePathname("/", routeLocale) + "#faq" : withLocalePathname(href, routeLocale)} className="hover:text-amber-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5">{messages.footer.contactTitle}</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-amber-400" />
                </div>
                <span className="min-w-0 break-words">{PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-amber-400" />
                </div>
                <span className="min-w-0 break-words">{EMAIL}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-amber-400" />
                </div>
                <span className="min-w-0 break-words">{messages.footer.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col gap-4 text-center text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:text-left">
          <p>{messages.footer.copyright}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
            <Link href={withLocalePathname("/privacy-policy", routeLocale)} className="text-slate-300 hover:text-amber-300 transition-colors">{messages.footer.privacyPolicy}</Link>
            <Link href={withLocalePathname("/terms", routeLocale)} className="text-slate-300 hover:text-amber-300 transition-colors">{messages.footer.termsOfService}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
