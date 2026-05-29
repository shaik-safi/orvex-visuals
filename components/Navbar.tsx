"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Sun,
  Moon,
  Menu,
  X,
  MessageCircle,
  Phone,
} from "lucide-react"

import { useDarkMode } from "@/hooks/use-dark-mode"
import { buildPricingHandoffHref } from "@/lib/pricing-handoff"
import { BRAND_NAME, getWhatsAppLink, PHONE_NUMBER } from "@/lib/constants"
import type { AppLocale } from "@/lib/i18n/config"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { extractLocaleFromPathname, stripLocaleFromPathname, withLocaleHref, withLocalePathname } from "@/lib/i18n/routing"
import { getCommonMessages } from "@/lib/i18n/common"

const localeOptions: { value: AppLocale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "HI" },
]

export default function Navbar({ locale: renderedLocale }: { locale: AppLocale }) {
  const { isDark, toggle } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()

  const routeLocale = extractLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
  const currentLocale = renderedLocale
  const isLocaleSyncPending = routeLocale !== currentLocale
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
      return `px-3 xl:px-4 py-2 rounded-lg text-[13px] xl:text-sm font-medium transition-all duration-300 hover:bg-white/10 ${scrolled
        ? "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        : "text-white/80 hover:text-white"
        }`
    }
    const active = isActiveLink(href)
    return `px-3 xl:px-4 py-2 rounded-lg text-[13px] xl:text-sm font-medium transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${active
      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10"
      : "text-slate-600 dark:text-slate-300"
      }`
  }

  const primaryLinks = [
    { label: messages.navbar.home, href: "/#home" },
    { label: messages.navbar.services, href: "/services" },
    { label: messages.navbar.pricing, href: buildPricingHandoffHref({ from: "navbar-pricing", source: "Pricing Navigation", intent: "availability" }) },
    { label: messages.navbar.gallery, href: "/gallery" },
    { label: messages.navbar.about, href: "/about" },
    { label: messages.navbar.contact, href: "/contact" },
  ]

  const links = primaryLinks.map((link) => ({
    ...link,
    href: withLocaleHref(link.href, currentLocale),
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

  const handleLocaleChange = (targetLocale: AppLocale) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLocaleSyncPending || targetLocale === routeLocale) {
      event.preventDefault()
      setIsOpen(false)
      return
    }

    event.preventDefault()
    setIsOpen(false)

    router.replace(localeHref(targetLocale), { scroll: false })
    router.refresh()
  }

  const estimateHref = withLocaleHref(
    buildPricingHandoffHref({ from: "navbar", source: "Site Navigation", intent: "availability" }),
    currentLocale
  )
  const whatsappHref = getWhatsAppLink(messages.navbar.whatsappTemplate)
  const callHref = `tel:+${PHONE_NUMBER}`

  const secondaryActionClasses = isHomepage && !scrolled
    ? "hidden lg:inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2.5 2xl:px-3.5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-white/15"
    : "hidden lg:inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/75 px-2.5 2xl:px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800"

  const utilityActionClasses = isHomepage && !scrolled
    ? "hidden lg:inline-flex items-center gap-2 rounded-xl px-2.5 2xl:px-3 py-2 text-xs font-medium text-white/75 transition-all duration-300 hover:text-white"
    : "hidden lg:inline-flex items-center gap-2 rounded-xl px-2.5 2xl:px-3 py-2 text-xs font-medium text-slate-600 transition-all duration-300 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"

  const primaryActionClasses = "hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 xl:px-4 py-2.5 rounded-xl font-semibold text-[13px] xl:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0"

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {isHomepage ? (
            <a href="#home" className="group flex min-w-0 items-center">
              <Image
                src="/orvex-logo-new.png"
                alt={BRAND_NAME}
                width={320}
                height={182}
                priority
                className="h-9 w-auto max-w-[10.5rem] transition-transform duration-300 group-hover:scale-[1.02] sm:h-10 sm:max-w-[12rem] xl:h-11 xl:max-w-none"
              />
            </a>
          ) : (
            <Link href={withLocalePathname("/", currentLocale)} className="group flex min-w-0 items-center">
              <Image
                src="/orvex-logo-new.png"
                alt={BRAND_NAME}
                width={320}
                height={182}
                priority
                className="h-9 w-auto max-w-[10.5rem] transition-transform duration-300 group-hover:scale-[1.02] sm:h-10 sm:max-w-[12rem] xl:h-11 xl:max-w-none"
              />
            </Link>
          )}

          <div className="hidden lg:flex items-center gap-0 xl:gap-0.5 2xl:gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={getLinkClasses(link.href)}
                aria-current={isActiveLink(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <div className="hidden sm:flex items-center rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 p-1">
              {localeOptions.map((option) => {
                const active = option.value === currentLocale
                return (
                  <Link
                    key={option.value}
                    href={localeHref(option.value)}
                    onClick={handleLocaleChange(option.value)}
                    aria-disabled={isLocaleSyncPending}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${isLocaleSyncPending ? "pointer-events-none opacity-70" : ""} ${active
                      ? "bg-amber-500 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {option.label}
                  </Link>
                )
              })}
            </div>

            <a href={callHref} className={utilityActionClasses} aria-label={messages.navbar.call}>
              <Phone size={15} />
              <span className="hidden 2xl:inline">{messages.navbar.call}</span>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryActionClasses}
              aria-label={messages.navbar.whatsapp}
            >
              <MessageCircle size={15} />
              <span className="hidden 2xl:inline">{messages.navbar.whatsapp}</span>
            </a>

            <button
              onClick={toggle}
              className={toggleBtnClasses}
              aria-label={messages.navbar.themeToggle}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              href={estimateHref}
              className={primaryActionClasses}
              aria-label={messages.navbar.bookNow}
            >
              <MessageCircle size={16} />
              <span className="hidden xl:inline">{messages.navbar.bookNow}</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={mobileToggleClasses}
              aria-label={isOpen ? messages.navbar.closeMenu : messages.navbar.openMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div id="mobile-navigation" className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[calc(100svh-5.5rem)] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="mt-2 max-h-[calc(100svh-7rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white/95 p-4 pb-6 pt-2 shadow-xl backdrop-blur-xl dark:bg-slate-900/95">
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
              {localeOptions.map((option) => {
                const active = option.value === currentLocale
                return (
                  <Link
                    key={option.value}
                    href={localeHref(option.value)}
                    onClick={handleLocaleChange(option.value)}
                    aria-disabled={isLocaleSyncPending}
                    className={`flex-1 text-center px-2.5 py-2 text-xs font-semibold rounded-lg transition-all ${isLocaleSyncPending ? "pointer-events-none opacity-70" : ""} ${active
                      ? "bg-amber-500 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {option.label}
                  </Link>
                )
              })}
            </div>

            <div className="mb-4 space-y-3">
              <Link
                href={estimateHref}
                onClick={() => setIsOpen(false)}
                className="block text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-xl font-semibold text-sm"
              >
                {messages.navbar.bookNow}
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-500/30 dark:hover:text-amber-400"
              >
                <MessageCircle size={18} />
                {messages.navbar.whatsapp}
              </a>

              <a
                href={callHref}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600"
              >
                <Phone size={18} />
                {messages.navbar.call}
              </a>
            </div>

            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-medium transition-all"
                aria-current={isActiveLink(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
