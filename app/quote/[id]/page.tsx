"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, Download, Mail, MapPin, MessageCircle, Phone, User } from "lucide-react"

import { BRAND_NAME, EMAIL, PHONE_DISPLAY, getWhatsAppLink } from "@/lib/constants"
import { useLocaleSync } from "@/lib/i18n/locale-sync"
import { getPageMessages } from "@/lib/i18n/pages"
import { getLocaleTag } from "@/lib/i18n/config"
import { applyTemplate } from "@/lib/i18n/home"
import { withLocaleHref } from "@/lib/i18n/routing"
import { buildPricingHandoffHref } from "@/lib/pricing-handoff"
import { localizeQuoteListValue, localizeQuoteValue } from "@/lib/quote-localization"

interface QuoteData {
  source: string
  status: string
  createdAt: string | null
  customerName: string
  customerPhone: string
  customerEmail?: string
  date?: string
  timeSlot?: string
  city?: string
  venue?: string
  events?: {
    name: string
    duration: string
    selections: { name: string; qty: number; unitPrice: number }[]
    price: number
  }[]
  globalAddOns?: { name: string; qty: number; price: number }[]
  service?: string
  budget?: string
  notes?: string
  total?: number
}

export default function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { routeLocale } = useLocaleSync()
  const messages = getPageMessages(routeLocale).quotePage
  const { id } = use(params)
  const searchParams = useSearchParams()

  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchQuote() {
      const token = searchParams.get("token")
      if (!token) {
        setError(messages.notFoundDescription)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/quotes/${id}?token=${encodeURIComponent(token)}`, { cache: "no-store" })
        const data = await response.json().catch(() => null)
        if (!response.ok || !data?.quote) {
          setError(data?.error || messages.notFoundDescription)
          return
        }
        setQuote(data.quote as QuoteData)
      } catch {
        setError(messages.notFoundDescription)
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [id, searchParams, messages.notFoundDescription])

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-400">{messages.loading}</div>
    )
  }

  if (error || !quote) {
    return (
      <div className="pt-32 pb-20 text-center px-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{messages.notFoundTitle}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error || messages.notFoundDescription}</p>
        <Link href={withLocaleHref(buildPricingHandoffHref({ from: "quote", source: messages.savedPackageSource, intent: "custom-package" }), routeLocale)} className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
          {messages.newPackage}
        </Link>
      </div>
    )
  }

  const createdDate = quote.createdAt
    ? new Date(quote.createdAt).toLocaleDateString(getLocaleTag(routeLocale), { day: "numeric", month: "long", year: "numeric" })
    : messages.placeholders.na
  const venue = quote.city && quote.venue && quote.city.trim() === quote.venue.trim()
    ? quote.city
    : [quote.city, quote.venue].filter(Boolean).join(" - ")
  const localizedService = localizeQuoteListValue(quote.service, routeLocale)
  const localizedTimeSlot = localizeQuoteValue(quote.timeSlot, routeLocale)
  const localizedEvents = (quote.events ?? []).map((event) => ({
    ...event,
    name: localizeQuoteValue(event.name, routeLocale) || event.name,
    duration: localizeQuoteValue(event.duration, routeLocale) || event.duration,
    selections: event.selections.map((item) => ({
      ...item,
      name: localizeQuoteValue(item.name, routeLocale) || item.name,
    })),
  }))
  const localizedGlobalAddOns = (quote.globalAddOns ?? []).map((addon) => ({
    ...addon,
    name: localizeQuoteValue(addon.name, routeLocale) || addon.name,
  }))

  const pricingHref = withLocaleHref(buildPricingHandoffHref({ from: "quote", source: messages.savedPackageSource, intent: "custom-package" }), routeLocale)

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-svh pt-28 pb-16 print:pt-0 print:bg-white">
      <div className="max-w-3xl mx-auto px-4 mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link href={pricingHref} className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">
          <ArrowLeft size={14} />
          {messages.backToPricing}
        </Link>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            <Download size={14} />
            {messages.downloadPdf}
          </button>
          <a
            href={getWhatsAppLink(applyTemplate(messages.whatsappMessageTemplate, { BRAND_NAME, id }))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
          >
            <MessageCircle size={14} />
            {messages.askQuestion}
          </a>
        </div>
      </div>

      <div id="quote-pdf" className="max-w-3xl mx-auto px-4 print:px-0">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow print:shadow-none print:border-0 overflow-hidden print-card">
          <div className="bg-slate-900 text-white px-6 py-8 sm:px-8 print:bg-white print:text-slate-900 print:px-0 print:pb-4 print:border-b print:border-slate-300 print-section">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{BRAND_NAME}</h1>
                <p className="text-sm opacity-80 print-meta">{PHONE_DISPLAY} · {EMAIL}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold print-booking-id">#{id}</p>
                <p className="text-sm opacity-80 print-meta">{createdDate}</p>
              </div>
            </div>
          </div>

          <section className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 sm:px-8 print:px-0 print-section">
            <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-3 print-section-label">{messages.headings.customer}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2"><User size={14} className="text-slate-400 mt-0.5 print:hidden" /><div><span className="hidden print:block print-field-label">{messages.labels.name}</span><span className="print-field-value">{quote.customerName}</span></div></div>
              <div className="flex items-start gap-2"><Phone size={14} className="text-slate-400 mt-0.5 print:hidden" /><div><span className="hidden print:block print-field-label">{messages.labels.phone}</span><span className="print-field-value">{quote.customerPhone}</span></div></div>
              {quote.customerEmail && <div className="flex items-start gap-2"><Mail size={14} className="text-slate-400 mt-0.5 print:hidden" /><div><span className="hidden print:block print-field-label">{messages.labels.email}</span><span className="print-field-value">{quote.customerEmail}</span></div></div>}
              {quote.date && <div className="flex items-start gap-2"><Calendar size={14} className="text-slate-400 mt-0.5 print:hidden" /><div><span className="hidden print:block print-field-label">{messages.labels.eventDate}</span><span className="print-field-value">{quote.date}{localizedTimeSlot ? ` · ${localizedTimeSlot}` : ""}</span></div></div>}
              {venue && <div className="flex items-start gap-2 sm:col-span-2"><MapPin size={14} className="text-slate-400 mt-0.5 print:hidden" /><div><span className="hidden print:block print-field-label">{messages.labels.venue}</span><span className="print-field-value">{venue}</span></div></div>}
            </div>
          </section>

          {(quote.service || quote.budget) && !quote.events?.length && (
            <section className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 sm:px-8 print:px-0 print-section">
              <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-3 print-section-label">{messages.headings.bookingDetails}</h2>
              <div className="space-y-2 text-sm">
                {localizedService && <div className="flex justify-between gap-4"><span className="text-slate-500">{messages.labels.service}</span><span className="text-slate-900 dark:text-white font-medium print:text-slate-900 text-right">{localizedService}</span></div>}
                {quote.budget && <div className="flex justify-between gap-4"><span className="text-slate-500">{messages.labels.budget}</span><span className="text-slate-900 dark:text-white font-medium print:text-slate-900 text-right">{quote.budget}</span></div>}
              </div>
            </section>
          )}

          {localizedEvents.length > 0 && (
            <section className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 sm:px-8 print:px-0 print-section">
              <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-4 print-section-label">{messages.headings.eventCoverage}</h2>
              <div className="space-y-4">
                {localizedEvents.map((event, index) => (
                  <div key={index} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 print-section avoid-break">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white print-event-title">{event.name}</p>
                        <p className="text-xs text-slate-500"><span className="print:event-duration">{event.duration}</span></p>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white print:event-price">₹{event.price.toLocaleString("en-IN")}</p>
                    </div>
                    {event.selections.length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        {event.selections.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex justify-between">
                            <span className="print:deliverable-name">{item.name}{item.qty > 1 ? ` x${item.qty}` : ""}</span>
                            <span className="print:deliverable-price">₹{(item.qty * item.unitPrice).toLocaleString("en-IN")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {localizedGlobalAddOns.length > 0 && (
            <section className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print-section">
              <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-3 print-section-label">{messages.headings.extras}</h2>
              <div className="space-y-2 text-sm">
                {localizedGlobalAddOns.map((addon, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300 print:deliverable-name">{addon.name}{addon.qty > 1 ? ` x${addon.qty}` : ""}</span>
                    <span className="text-slate-900 dark:text-white font-medium print:deliverable-price">₹{addon.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {quote.notes && (
            <section className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print-section avoid-break">
              <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-2 print-section-label">{messages.headings.notes}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 print-field-value">{quote.notes}</p>
            </section>
          )}

          {quote.total && (
            <section className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print-section">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white print:text-slate-900">{messages.headings.total}</p>
                  <p className="text-xs text-slate-500 print-meta">{messages.metaLine}</p>
                </div>
                <p className="text-2xl font-bold text-amber-600 print:print-total-amount">₹{quote.total.toLocaleString("en-IN")}</p>
              </div>
            </section>
          )}

          <section className="px-8 py-6 bg-slate-50 dark:bg-slate-800/40 print:px-0 print-section avoid-break">
            <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-3 print-section-label">{messages.headings.terms}</h2>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              {messages.terms.map((term) => (
                <li key={term}><span className="print-term-text">• {term}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}