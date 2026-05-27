"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sun,
  Moon,
  Menu,
  X,
  MessageCircle,
} from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

const homepageLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const { isDark, toggle } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = isHomepage ? homepageLinks : siteLinks

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
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

  const logoTextClasses = isHomepage
    ? `text-lg font-bold transition-colors duration-300 ${scrolled ? "text-slate-900 dark:text-white" : "text-white"}`
    : "text-lg font-bold text-slate-900 dark:text-white"

  const mobileToggleClasses = isHomepage && !scrolled
    ? "lg:hidden p-2.5 rounded-xl transition-all duration-300 text-white"
    : "lg:hidden p-2.5 rounded-xl transition-all duration-300 text-slate-700 dark:text-white"

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          {isHomepage ? (
            <a href="#home" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-sm tracking-tight">OV</span>
              </div>
              <div className="hidden sm:block">
                <span className={logoTextClasses}>Orvex Visuals</span>
              </div>
            </a>
          ) : (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-sm tracking-tight">OV</span>
              </div>
              <div className="hidden sm:block">
                <span className={logoTextClasses}>Orvex Visuals</span>
              </div>
            </Link>
          )}

          {/* Desktop Nav */}
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

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className={toggleBtnClasses}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              href="/pricing"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle size={16} />
              Book Now
            </Link>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={mobileToggleClasses}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div id="mobile-navigation" className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pb-6 pt-2 space-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl mt-2 p-4 shadow-xl">
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
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="block mt-4 text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-xl font-semibold text-sm"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
