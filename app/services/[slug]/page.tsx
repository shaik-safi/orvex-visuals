"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Shield,
  Clock,
  MapPin,
  ChevronDown,
} from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { getServiceDetail, type ServiceDetail } from "../data"
import { PHOTO_DELIVERY_DAYS } from "@/lib/constants"

function buildBookingUrl(serviceName: string, budget?: number, note?: string) {
  const params = new URLSearchParams()
  params.set("service", serviceName)
  if (budget) params.set("budget", `₹${budget.toLocaleString("en-IN")}`)
  if (note) params.set("message", note)
  return `/book?${params.toString()}`
}

// ============ SERVICE HERO ============
function ServiceHero({ service }: { service: ServiceDetail }) {
  const { ref, isVisible } = useScrollReveal()
  const Icon = service.icon
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={service.heroImage} alt={service.name} fill className="object-cover" sizes="100vw" priority quality={75} placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTI5M2IiLz48L3N2Zz4=" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
      </div>

      <div ref={ref} className={`relative max-w-4xl mx-auto px-4 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <span>/</span>
          <span className="text-amber-400">{service.name}</span>
        </div>

        <div className="w-16 h-16 bg-amber-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
          <Icon className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[0.95] mb-4">
          {service.name}
        </h1>
        <p className="text-lg md:text-xl text-amber-300 font-medium mb-3">{service.tagline}</p>
        <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg">{service.description}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={buildBookingUrl(service.name)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            <MessageCircle size={18} /> Start Booking
          </Link>
          <a
            href="#packages"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white/10 px-7 py-3.5 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1"
          >
            View Packages <ArrowRight size={16} />
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
          <span className="flex items-center gap-1.5"><Shield size={14} className="text-green-400" /> GST Inclusive</span>
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> {PHOTO_DELIVERY_DAYS}-Day Photo Delivery</span>
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-400" /> Bangalore & Beyond</span>
          <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400" /> Booking Summary Included</span>
        </div>
      </div>
    </section>
  )
}

// ============ OVERVIEW ============
function OverviewSection({ service }: { service: ServiceDetail }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              About This Service
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What We Offer
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
              {service.longDescription}
            </p>

            <div className="space-y-3">
              {service.includes.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/5 p-4 text-sm text-slate-600 dark:text-slate-300">
              Representative visual references while the verified client portfolio is being refreshed.
            </div>
            {service.gallery.map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 h-48" : "h-32"}`}>
                <Image src={img} alt={`${service.name} gallery ${i + 1}`} width={i === 0 ? 600 : 300} height={i === 0 ? 400 : 200} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" loading="lazy" quality={75} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ PACKAGES ============
function PackagesSection({ service }: { service: ServiceDetail }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section id="packages" ref={ref} className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {service.name} Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {service.name} Packages
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            For this service only. All prices GST-inclusive, no hidden charges.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {service.packages.map((pkg, i) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 ${pkg.popular
                ? "bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-2xl shadow-amber-500/20 scale-[1.02]"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl"
                }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-amber-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className={`text-lg font-bold mb-1 ${pkg.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${pkg.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    &#8377;{pkg.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${pkg.popular ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                  Duration: {pkg.duration}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {pkg.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <Check size={14} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? "text-white" : "text-amber-500"}`} />
                    <span className={`text-sm ${pkg.popular ? "text-white/90" : "text-slate-600 dark:text-slate-300"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={buildBookingUrl(service.name, pkg.price, `Interested in the ${pkg.name} package for ${service.name}.`)}
                className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${pkg.popular
                  ? "bg-white text-amber-600 hover:bg-amber-50 shadow-lg"
                  : "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  }`}
              >
                Book {pkg.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Customize CTA */}
        <div className="text-center mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Need something different? Mix & match services for your event.</p>
          <Link
            href="/pricing#calculator"
            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            Build a Custom Package <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============ PROCESS ============
function ProcessSection({ service }: { service: ServiceDetail }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Our Process
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {service.process.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 h-full">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-2">{step.step}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ FAQ ============
function FAQSection({ service }: { service: ServiceDetail }) {
  const { ref, isVisible } = useScrollReveal()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Common Questions
          </h2>
        </div>

        <div className="space-y-3">
          {service.faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-slate-900 dark:text-white font-medium pr-4">{faq.q}</span>
                <ChevronDown size={18} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ RELATED SERVICES ============
function RelatedServices({ service }: { service: ServiceDetail }) {
  const { ref, isVisible } = useScrollReveal()

  const relatedNames = service.relatedSlugs.map((slug) => ({
    slug,
    name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
  }))

  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Related Services
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {relatedNames.map((related) => (
            <Link
              key={related.slug}
              href={`/services/${related.slug}`}
              className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center"
            >
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {related.name}
              </h3>
              <span className="flex items-center justify-center gap-1 text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">
                Learn More <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ CTA ============
function ServiceCTA({ service }: { service: ServiceDetail }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.1),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Book Your {service.name}?
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          Start your booking request and we&apos;ll confirm the right coverage for your event.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={buildBookingUrl(service.name)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            <MessageCircle size={20} /> Start Booking Request
          </Link>
          <Link
            href="/pricing#calculator"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft size={18} /> Build Custom Package
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============ MAIN PAGE ============
export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const service = getServiceDetail(slug)

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Orvex Visuals",
      url: "https://orvexvisuals.com",
    },
    areaServed: {
      "@type": "City",
      name: "Bangalore",
    },
    offers: service.packages.map((pkg) => ({
      "@type": "Offer",
      name: pkg.name,
      price: pkg.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    })),
    image: service.heroImage,
    url: `https://orvexvisuals.com/services/${slug}`,
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServiceHero service={service} />
      <OverviewSection service={service} />
      <PackagesSection service={service} />
      <ProcessSection service={service} />
      <FAQSection service={service} />
      <RelatedServices service={service} />
      <ServiceCTA service={service} />
    </main>
  )
}
