"use client"

import { useState, useEffect, use } from "react"
import { BRAND_NAME, PHONE_DISPLAY, EMAIL, getWhatsAppLink } from "@/lib/constants"
import { Download, MessageCircle, ArrowLeft, Calendar, MapPin, User, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

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
  const { id } = use(params)
  const searchParams = useSearchParams()
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchQuote() {
      const token = searchParams.get("token")
      if (!token) {
        setError("Missing access token")
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`/api/quotes/${id}?token=${encodeURIComponent(token)}`, {
          cache: "no-store",
        })
        const data = await response.json().catch(() => null)
        if (!response.ok || !data?.quote) {
          setError(data?.error || "Unable to load booking")
          return
        }
        setQuote(data.quote as QuoteData)
      } catch {
        setError("Unable to load booking")
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [id, searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-pulse text-slate-400">Loading booking...</div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error || "This booking does not exist or has expired."}</p>
        <Link href="/pricing" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
          ← Build a new package
        </Link>
      </div>
    )
  }

  const createdDate = quote.createdAt
    ? new Date(quote.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—"

  const handleDownload = async () => {
    document.title = `Orvex-Booking-${id}`
    await new Promise((resolve) => setTimeout(resolve, 200))
    window.print()
  }

  // Deduplicate city/venue if identical
  const venueDisplay =
    quote.city && quote.venue && quote.city.trim() === quote.venue.trim()
      ? quote.city
      : [quote.city, quote.venue].filter(Boolean).join(" — ")

  return (
    <div className="bg-slate-50 dark:bg-slate-950 pt-28 pb-16 print:pt-4 print:pb-0 print:bg-white">

      {/* ── Action bar — screen only ── */}
      <div className="print:hidden max-w-3xl mx-auto px-4 mb-6 flex items-center justify-between">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Pricing
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
          >
            <Download size={14} />
            Download PDF
          </button>

          <a
            href={getWhatsAppLink(`Hi Orvex, I have a question about Booking #${id}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle size={14} />
            Ask a Question
          </a>
        </div>
      </div>

      {/* ── Document ── */}
      <div
        id="quote-pdf"
        className="max-w-3xl mx-auto px-4 print:max-w-none print:px-0 print:mx-0"
      >
        <div className="print-card bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden print:overflow-visible">

          {/* ══ HEADER ══ */}
          <div className="bg-slate-900 px-8 py-8 text-white print:bg-white print:px-0 print:pt-0 print:pb-5 print:border-b-2 print:border-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="hidden print:block print-discipline">
                  Photography &amp; Visuals — Bangalore
                </p>
                <h1 className="text-2xl font-bold mb-1 print:text-[25px] print:font-semibold print:tracking-tight print:text-slate-900 print:mb-0">
                  {BRAND_NAME}
                </h1>
                <p className="text-slate-300 text-sm print:hidden">
                  {PHONE_DISPLAY} · {EMAIL}
                </p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 font-bold text-lg print:hidden">Booking #{id}</p>
                <div className="hidden print:block text-right">
                  <p className="print-discipline text-right">Booking Reference</p>
                  <p className="print-booking-id">#{id}</p>
                  <p className="print-meta mt-0.5">{createdDate}</p>
                </div>
                <p className="text-slate-300 text-sm print:hidden">{createdDate}</p>
              </div>
            </div>
          </div>

          {/* ══ CUSTOMER ══ */}
          <div className="avoid-break print-section px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print:pt-5 print:pb-5 print:border-slate-200">
            <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 print:hidden">
              Customer
            </h2>
            <p className="hidden print:block print-section-label mb-3">Prepared for</p>

            {/* Screen */}
            <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <User size={14} className="text-slate-400 shrink-0" />
                {quote.customerName}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Phone size={14} className="text-slate-400 shrink-0" />
                {quote.customerPhone}
              </div>
              {quote.customerEmail && (
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  {quote.customerEmail}
                </div>
              )}
              {quote.date && (
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  {quote.date}{quote.timeSlot && ` · ${quote.timeSlot}`}
                </div>
              )}
              {(quote.city || quote.venue) && (
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  {venueDisplay}
                </div>
              )}
            </div>

            {/* Print — label/value grid, no icons */}
            <div className="hidden print:grid print:grid-cols-3 print:gap-x-8 print:gap-y-3">
              <div>
                <p className="print-field-label">Name</p>
                <p className="print-field-value">{quote.customerName}</p>
              </div>
              <div>
                <p className="print-field-label">Phone</p>
                <p className="print-field-value">{quote.customerPhone}</p>
              </div>
              {quote.customerEmail && (
                <div>
                  <p className="print-field-label">Email</p>
                  <p className="print-field-value">{quote.customerEmail}</p>
                </div>
              )}
              {quote.date && (
                <div>
                  <p className="print-field-label">Event Date</p>
                  <p className="print-field-value">
                    {quote.date}{quote.timeSlot && ` · ${quote.timeSlot}`}
                  </p>
                </div>
              )}
              {(quote.city || quote.venue) && (
                <div>
                  <p className="print-field-label">Venue</p>
                  <p className="print-field-value">{venueDisplay}</p>
                </div>
              )}
            </div>
          </div>

          {/* ══ SERVICE & BUDGET ══ */}
          {(quote.service || quote.budget) && !quote.events?.length && (
            <div className="avoid-break print-section px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print:py-5 print:border-slate-200">
              <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 print:hidden">
                Booking Details
              </h2>
              <p className="hidden print:block print-section-label mb-3">Package Overview</p>
              <div className="space-y-2 print:space-y-2.5">
                {quote.service && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 print-field-label !mb-0">Service</span>
                    <span className="text-slate-900 dark:text-white font-medium print-field-value !mb-0">{quote.service}</span>
                  </div>
                )}
                {quote.budget && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 print-field-label !mb-0">Budget</span>
                    <span className="text-slate-900 dark:text-white font-medium print-field-value !mb-0">{quote.budget}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ EVENT COVERAGE ══ */}
          {quote.events && quote.events.length > 0 && (
            <div className="avoid-break print-section px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print:pt-5 print:pb-4 print:border-slate-200">
              <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 print:hidden">
                Event Coverage
              </h2>
              <p className="hidden print:block print-section-label mb-4">Coverage Plan</p>

              <div className="space-y-4 print:space-y-0">
                {quote.events.map((event, i) => (
                  <div
                    key={i}
                    className="print-section rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4
                               print:rounded-none print:bg-transparent print:p-0 print:pb-0
                               print:mt-4 first:print:mt-0"
                  >
                    {/* ── Event title row ── */}
                    <div className="flex items-center justify-between mb-2 print:mb-1.5 print:pb-1.5 print:border-b print:border-slate-200">
                      <div className="flex items-center gap-2 print:items-baseline print:gap-2.5">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white print:event-title">
                          {event.name}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 print:event-duration">
                          {event.duration}
                        </span>
                      </div>
                      {/* Event total — confident, not screaming */}
                      <span className="font-semibold text-sm text-slate-900 dark:text-white print:event-price">
                        ₹{event.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* ── Deliverables — whisper, not shout ── */}
                    {event.selections && event.selections.length > 0 && (
                      <ul className="space-y-1 print:space-y-0.5 print:pl-0">
                        {event.selections.map((sel, j) => (
                          <li
                            key={j}
                            className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pl-3
                                       print:pl-0 print:flex print:items-baseline print:justify-between"
                          >
                            {/* Deliverable name — the important part */}
                            <span className="print:deliverable-name">
                              {sel.name}
                              {sel.qty > 1 && (
                                <span className="ml-1 opacity-60"> ×{sel.qty}</span>
                              )}
                            </span>
                            {/*
                              Sub-item price: on screen show it normally.
                              In print: very subtle — it's already in the event total.
                              This removes the "spreadsheet" feeling.
                            */}
                            <span className="print:deliverable-price">
                              ₹{(sel.unitPrice * sel.qty).toLocaleString("en-IN")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ EXTRAS ══ */}
          {quote.globalAddOns && quote.globalAddOns.length > 0 && (
            <div className="avoid-break print-section px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print:py-4 print:border-slate-200">
              <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 print:hidden">
                Extras
              </h2>
              <p className="hidden print:block print-section-label mb-3">Add-ons</p>
              <div className="space-y-2 print:space-y-1.5">
                {quote.globalAddOns.map((addon, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300 print:event-title print:!text-[12px] print:!font-normal">
                      {addon.name}
                      {addon.qty > 1 && <span className="ml-1 text-slate-400 opacity-70"> ×{addon.qty}</span>}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white print:event-price print:!text-[12px]">
                      ₹{addon.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ NOTES ══ */}
          {quote.notes && (
            <div className="avoid-break print-section px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print:py-4 print:border-slate-200">
              <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 print:hidden">
                Notes
              </h2>
              <p className="hidden print:block print-section-label mb-2">Notes</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 print:text-[12px] print:leading-[1.65] print:text-slate-600">
                {quote.notes}
              </p>
            </div>
          )}

          {/* ══ TOTAL ══ */}
          {quote.total && (
            <div className="avoid-break print-section px-8 py-6 border-b border-slate-100 dark:border-slate-800 print:px-0 print:py-5 print:border-t-[1.5px] print:border-b-[1.5px] print:border-slate-900 print:my-1">
              <div className="flex items-center justify-between print:items-end">
                <div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white print:hidden">Total</span>
                  <div className="hidden print:block">
                    <p className="print-section-label mb-0.5">Total Investment</p>
                    <p className="print-meta">Inclusive of all services · No hidden charges</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 print:print-total-amount">
                  ₹{quote.total.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 print:hidden">
                All prices are inclusive. No hidden charges.
              </p>
            </div>
          )}

          {/* ══ TERMS ══ */}
          <div className="avoid-break print-section px-8 py-6 bg-slate-50 dark:bg-slate-800/30 print:bg-white print:px-0 print:pt-5 print:pb-4 print:border-b print:border-slate-200">
            <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 print:hidden">
              Terms
            </h2>
            <p className="hidden print:block print-section-label mb-3">Terms &amp; Conditions</p>

            {/* Screen */}
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 print:hidden">
              <li>• This is your booking summary. Final amount confirmed after discussion.</li>
              <li>• Booking confirmation requires 30% advance payment.</li>
              <li>• Photos delivered within 5 working days. Videos within 15 working days.</li>
              <li>• Free cancellation 7+ days before event. 50% refund 3-7 days before.</li>
              <li>• Full copyright of all deliverables belongs to you.</li>
              <li>• Booking summary valid for 30 days from date of creation.</li>
            </ul>

            {/*
              Print: single column so terms never wrap awkwardly mid-sentence.
              Numbered 01–06, generous line-height, not cramped.
            */}
            <div className="hidden print:block print:space-y-2">
              {[
                "This is your booking summary. Final amount confirmed after discussion.",
                "Booking confirmation requires 30% advance payment.",
                "Photos delivered within 5 working days. Videos within 15 working days.",
                "Free cancellation 7+ days before event. 50% refund 3–7 days before.",
                "Full copyright of all deliverables belongs to you.",
                "Booking summary valid for 30 days from date of creation.",
              ].map((term, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="print-term-num shrink-0 mt-px">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="print-term-text">{term}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══ SIGNATURES ══ */}
          <div className="avoid-break print-section px-8 py-10 border-t border-slate-100 dark:border-slate-800 print:px-0 print:pt-6 print:pb-5 print:border-slate-200">
            {/* Screen */}
            <div className="flex justify-between print:hidden">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Client Signature</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Orvex Visuals</p>
            </div>
            {/* Print */}
            <div className="hidden print:grid print:grid-cols-2 print:gap-14">
              <div>
                <div className="h-9 border-b border-slate-400 mb-2" />
                <p className="print-field-label">Client</p>
                <p className="print-field-value mt-0.5">{quote.customerName}</p>
              </div>
              <div>
                <div className="h-9 border-b border-slate-400 mb-2" />
                <p className="print-field-label">{BRAND_NAME}</p>
                <p className="print-meta mt-0.5">Authorised Signatory</p>
              </div>
            </div>
          </div>

          {/* ══ FOOTER ══ */}
          <div className="avoid-break print-section px-8 py-4 text-center border-t border-slate-100 dark:border-slate-800 print:px-0 print:pt-3 print:pb-3 print:border-slate-200">
            <p className="text-xs text-slate-400 dark:text-slate-500 print:hidden">
              {BRAND_NAME} · Bangalore · {PHONE_DISPLAY} · orvexvisuals.com
            </p>
            <div className="hidden print:flex print:items-center print:justify-between">
              <p className="print-footer-text">{BRAND_NAME}</p>
              <p className="print-footer-text">{PHONE_DISPLAY} · {EMAIL}</p>
              <p className="print-footer-text">orvexvisuals.com</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}