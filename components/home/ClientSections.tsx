"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { getWhatsAppLink, WA_MESSAGES, IMAGES } from "@/lib/constants"

// Helper: get upcoming month names for urgency messaging
function getUpcomingMonths() {
  const now = new Date()
  const m1 = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const m2 = new Date(now.getFullYear(), now.getMonth() + 2, 1)
  const monthName = (d: Date) => d.toLocaleString("en-IN", { month: "long" })
  const withYear = (d: Date) => d.toLocaleString("en-IN", { month: "long", year: "numeric" })
  return { next: withYear(m1), nextTwo: `${monthName(m1)} & ${monthName(m2)} ${m2.getFullYear()}` }
}

// ============ HERO (Client — image carousel + animation) ============
export function Hero() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = IMAGES.hero
  const currentHeroImage = images[currentImage] ?? images[0]
  const { next } = getUpcomingMonths()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return

    const preloadTimer = window.setTimeout(() => {
      images.forEach((src, index) => {
        if (index === 0) return
        const image = new window.Image()
        image.src = src
      })
    }, 2500)

    return () => window.clearTimeout(preloadTimer)
  }, [images])

  const stats = [
    { number: "500+", label: "Weddings Delivered" },
    { number: "4.9★", label: "Google Rating" },
    { number: "5-Day", label: "Delivery Guaranteed" },
    { number: "100%", label: "Copyright Yours" },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-12">
      <Image
        key={currentHeroImage}
        src={currentHeroImage}
        alt="Orvex Visuals Photography"
        fill
        className="object-cover"
        sizes="100vw"
        priority={currentImage === 0}
        quality={currentImage === 0 ? 85 : 75}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTI5M2IiLz48L3N2Zz4="
      />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')" }} />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full px-5 py-2 mb-8">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Only 3 Weekend Slots Left for {next}</span>
          </div>
        </div>

        <h1 className="animate-fade-in-up animation-delay-200 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8 tracking-tight">
          Bangalore&apos;s Most Trusted
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            Visual Storytellers
          </span>
        </h1>

        <p className="animate-fade-in-up animation-delay-400 text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          We don&apos;t just take photos — we craft heirloom art that makes you relive every emotion.
          Delivered in 5 days. Zero hidden costs. You own every frame.
        </p>

        <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pricing"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-1"
          >
            Check Availability — It&apos;s Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            See Transparent Pricing
          </Link>
        </div>

        <div className="animate-fade-in-up animation-delay-800 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
              <div className="text-white/50 text-xs md:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

// ============ FAQ SECTION (Client — accordion state) ============
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, isVisible } = useScrollReveal()

  const faqs = [
    { q: "How quickly will I get my photos?", a: "Edited photos delivered within 5 days. Cinematic video within 15 days. Fastest in Bangalore." },
    { q: "Do I own the copyright to my photos?", a: "Yes! 100% copyright belongs to you. All photos and videos are fully yours." },
    { q: "Are your prices inclusive of GST?", a: "Yes. All prices shown are final. No hidden charges, no surprise 18% add-on." },
    { q: "How do I book?", a: "Book through our website form or WhatsApp. We confirm availability within 2 hours." },
    { q: "What is included in packages?", a: "Professional photographer(s), all edited photos (digital), highlight reel, backup equipment, and pre-event planning call." },
  ]

  return (
    <section id="faq" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">Common Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-amber-200 dark:hover:border-amber-500/30 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                <div className={`w-8 h-8 bg-amber-50 dark:bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}>
                  <ChevronDown size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 pb-6 -mt-2">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ CTA BANNER (Client — for scroll reveal) ============
export function CTABanner() {
  const { ref, isVisible } = useScrollReveal()
  const { nextTwo } = getUpcomingMonths()

  return (
    <section id="contact" ref={ref} className={`py-20 md:py-28 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">{nextTwo} filling up fast</span>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Your Perfect Day<br />Deserves Perfect Frames
        </h2>
        <p className="text-amber-100 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Book in 2 minutes. Get a free personalized quote within 2 hours. No calls, no pressure — just clarity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getWhatsAppLink(WA_MESSAGES.quote)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 bg-white text-amber-700 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <MessageCircle size={22} />
            Get Free Quote on WhatsApp
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center border-2 border-white/40 text-white hover:bg-white hover:text-amber-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            Book Online — 2 Min Form
          </Link>
        </div>
      </div>
    </section>
  )
}
