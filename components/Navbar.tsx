"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Sun,
  Moon,
  Menu,
  X,
  MessageCircle,
} from "lucide-react"

import { useDarkMode } from "@/hooks/use-dark-mode"
import { buildPricingHandoffHref } from "@/lib/pricing-handoff"
import { BRAND_NAME } from "@/lib/constants"
import type { AppLocale } from "@/lib/i18n/config"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { extractLocaleFromPathname, stripLocaleFromPathname, withLocaleHref, withLocalePathname } from "@/lib/i18n/routing"
import { getCommonMessages } from "@/lib/i18n/common"

const localeOptions: { value: AppLocale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "HI" },
]

export default function Navbar() {
  const { isDark, toggle } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()

  const currentLocale = extractLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
  const messages = getCommonMessages(currentLocale)
  const basePath = stripLocaleFromPathname(pathname)
  const isHomepage = basePath === "/"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const normalizeHref = (href: string) => stripLocaleFromPathname(href.split("?")[0].split("#")[0] || "/")

  const isActiveLink = (href: string) => {
    const normalizedHref = normalizeHref(href)
    if (normalizedHref === "/") return basePath === "/"
    return basePath.startsWith(normalizedHref)
  }

  const getLinkClasses = (href: string) => {
    if (isHomepage) {
      return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 ${scrolled
        ? "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        : "text-white/80 hover:text-white"
        }`
    }
    const active = isActiveLink(href)
    return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${active
      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10"
      : "text-slate-600 dark:text-slate-300"
      }`
  }

  const homepageLinks = [
    { label: messages.navbar.home, href: "#home" },
    { label: messages.navbar.services, href: "#services" },
    { label: messages.navbar.whyUs, href: "#why-us" },
    { label: messages.navbar.gallery, href: "/gallery" },
    { label: messages.navbar.pricing, href: buildPricingHandoffHref({ from: "navbar-pricing", source: "Pricing Navigation", intent: "availability" }) },
    { label: messages.navbar.faq, href: "#faq" },
    { label: messages.navbar.contact, href: "#contact" },
  ]

  const siteLinks = [
    { label: messages.navbar.home, href: "/" },
    { label: messages.navbar.services, href: "/services" },
    { label: messages.navbar.pricing, href: buildPricingHandoffHref({ from: "navbar-pricing", source: "Pricing Navigation", intent: "availability" }) },
    { label: messages.navbar.gallery, href: "/gallery" },
    { label: messages.navbar.blog, href: "/blog" },
    { label: messages.navbar.about, href: "/about" },
    { label: messages.navbar.contact, href: "/contact" },
  ]

  const links = (isHomepage ? homepageLinks : siteLinks).map((link) => ({
    ...link,
    href: link.href.startsWith("#") ? link.href : withLocaleHref(link.href, currentLocale),
  }))

  const navBg = isHomepage
    ? scrolled
      ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
      : "bg-transparent"
    : scrolled
      ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
      : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"

  const toggleBtnClasses = isHomepage && !scrolled
    ? "p-2.5 rounded-xl transition-all duration-300 bg-white/10 text-white hover:bg-white/20"
    : "p-2.5 rounded-xl transition-all duration-300 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"

  const mobileToggleClasses = isHomepage && !scrolled
    ? "lg:hidden p-2.5 rounded-xl transition-all duration-300 text-white"
    : "lg:hidden p-2.5 rounded-xl transition-all duration-300 text-slate-700 dark:text-white"

  const query = searchParams.toString()
  const pathWithQuery = query ? `${pathname}?${query}` : pathname

  const localeHref = (targetLocale: AppLocale) => withLocaleHref(pathWithQuery, targetLocale)

  const bookNowHref = withLocaleHref(
    buildPricingHandoffHref({ from: "navbar", source: "Site Navigation", intent: "booking" }),
    currentLocale
  )

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {isHomepage ? (
            <a href="#home" className="group flex items-center">
              <Image
                src="/orvex-logo-new.png"
                alt={BRAND_NAME}
                width={320}
                height={182}
                priority
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-[1.02] sm:h-11"
              />
            </a>
          ) : (
            <Link href={withLocalePathname("/", currentLocale)} className="group flex items-center">
              <Image
                src="/orvex-logo-new.png"
                alt={BRAND_NAME}
                width={320}
                height={182}
                priority
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-[1.02] sm:h-11"
              />
            </Link>
          )}

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) =>
              link.href.startsWith("#") ? (
                <a key={link.label} href={link.href} className={getLinkClasses(link.href)}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className={getLinkClasses(link.href)}>
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 p-1">
              {localeOptions.map((option) => {
                const active = option.value === currentLocale
                return (
                  <Link
                    key={option.value}
                    href={localeHref(option.value)}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${active
                      ? "bg-amber-500 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {option.label}
                  </Link>
                )
              })}
            </div>

            <button
              onClick={toggle}
              className={toggleBtnClasses}
              aria-label={messages.navbar.themeToggle}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              href={bookNowHref}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle size={16} />
              {messages.navbar.bookNow}
            </Link>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={mobileToggleClasses}
              aria-label={isOpen ? messages.navbar.closeMenu : messages.navbar.openMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div id="mobile-navigation" className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[calc(100vh-5.5rem)] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="mt-2 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white/95 p-4 pb-6 pt-2 shadow-xl backdrop-blur-xl dark:bg-slate-900/95">
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
              {localeOptions.map((option) => {
                const active = option.value === currentLocale
                return (
                  <Link
                    key={option.value}
                    href={localeHref(option.value)}
                    onClick={() => setIsOpen(false)}
                    className={`flex-1 text-center px-2.5 py-2 text-xs font-semibold rounded-lg transition-all ${active
                      ? "bg-amber-500 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {option.label}
                  </Link>
                )
              })}
            </div>

            {links.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-medium transition-all"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-medium transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href={bookNowHref}
              onClick={() => setIsOpen(false)}
              className="block mt-4 text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-xl font-semibold text-sm"
            >
              {messages.navbar.bookNow}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
