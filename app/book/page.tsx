"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Camera,
  User,
  CheckCircle,
  MessageCircle,
} from "lucide-react"

import { saveQuote } from "@/lib/save-quote"
import { BOOKING_PLAN_STORAGE_KEY, PHONE_NUMBER } from "@/lib/constants"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getPageMessages } from "@/lib/i18n/pages"
import { applyTemplate } from "@/lib/i18n/home"
import { withLocalePathname } from "@/lib/i18n/routing"

interface PlanData {
  services: { name: string; coverage: string; price: number; selections?: { name: string; qty: number; unitPrice?: number }[] }[]
  addOns: { name: string; qty: number; price: number }[]
  total: number
  date?: string
  timeSlot?: string
  city?: string
  venue?: string
  customer?: { name: string; phone: string; email: string }
}

type BookMessages = ReturnType<typeof getPageMessages>["bookPage"]

function BookingForm({ messages, locale }: { messages: BookMessages; locale: ReturnType<typeof useCurrentLocale> }) {
  const router = useRouter()
  const planLoadedRef = useRef(false)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [planReady, setPlanReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    eventDate: "",
    venue: "",
    budget: "",
    message: "",
    source: "",
  })

  useEffect(() => {
    if (planLoadedRef.current) return
    planLoadedRef.current = true

    let parsedPlan: unknown = null

    if (typeof window !== "undefined") {
      const storedPlan = window.sessionStorage.getItem(BOOKING_PLAN_STORAGE_KEY)
      if (storedPlan) {
        try {
          parsedPlan = JSON.parse(storedPlan)
        } catch {
          parsedPlan = null
        }
        if (parsedPlan) {
          window.sessionStorage.removeItem(BOOKING_PLAN_STORAGE_KEY)
        }
      }
    }

    if (parsedPlan) {
      try {
        const parsed = parsedPlan as PlanData
        if (!parsed || !Array.isArray(parsed.services) || !Array.isArray(parsed.addOns) || typeof parsed.total !== "number") {
          setPlanReady(true)
          router.replace(withLocalePathname("/pricing", locale))
          return
        }
        setPlan(parsed)
        const serviceNames = parsed.services.map((serviceItem) => serviceItem.name).join(", ")
        const autoBudget = `\u20b9${parsed.total.toLocaleString("en-IN")}`
        setForm((prev) => ({
          ...prev,
          service: serviceNames,
          name: parsed.customer?.name || prev.name,
          phone: parsed.customer?.phone || prev.phone,
          email: parsed.customer?.email || prev.email,
          eventDate: parsed.date || prev.eventDate,
          venue: parsed.venue || parsed.city || prev.venue,
          budget: autoBudget,
        }))
        setPlanReady(true)
        return
      } catch {
        // no-op
      }
    }

    setPlanReady(true)
    router.replace(withLocalePathname("/pricing", locale))
  }, [router, locale])

  const updateField = (field: string, value: string) => setForm({ ...form, [field]: value })

  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone)
  const isValidEmail = (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]
  const isDateInPast = (dateStr: string) => !!dateStr && new Date(dateStr) < new Date(todayStr)

  const step1Valid = form.name.trim().length >= 2 && isValidPhone(form.phone) && isValidEmail(form.email)
  const step2Valid = !!form.service.trim() && !isDateInPast(form.eventDate)
  const step1Errors = {
    name: form.name.length > 0 && form.name.trim().length < 2,
    phone: form.phone.length > 0 && !isValidPhone(form.phone),
    email: form.email.length > 0 && !isValidEmail(form.email),
  }

  const render = (template: string, params: Record<string, string>) => applyTemplate(template, params)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { quoteId, accessToken } = await saveQuote({
        source: "booking",
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email || undefined,
        date: form.eventDate || undefined,
        timeSlot: plan?.timeSlot || undefined,
        city: plan?.city || undefined,
        venue: form.venue || undefined,
        service: form.service,
        budget: form.budget,
        notes: form.message || undefined,
        foundVia: form.source || undefined,
        events: plan?.services.map((s) => ({
          name: s.name,
          duration: s.coverage,
          selections: (s.selections ?? []).map((sel) => ({
            name: sel.name,
            qty: sel.qty,
            unitPrice: sel.unitPrice ?? 0,
          })),
          price: s.price,
        })),
        globalAddOns: plan?.addOns,
        total: plan?.total,
      })
      const parts = [
        messages.whatsapp.saved.start,
        "",
        render(messages.whatsapp.saved.bookingId, { quoteId }),
        "",
        render(messages.whatsapp.saved.name, { value: form.name }),
        render(messages.whatsapp.saved.phone, { value: form.phone }),
      ]
      if (form.email) parts.push(render(messages.whatsapp.saved.email, { value: form.email }))
      parts.push(render(messages.whatsapp.saved.service, { value: form.service }))
      if (form.eventDate) parts.push(render(messages.whatsapp.saved.date, { value: form.eventDate }))
      if (plan?.timeSlot) parts.push(render(messages.whatsapp.saved.time, { value: plan.timeSlot }))
      if (form.venue) parts.push(render(messages.whatsapp.saved.venue, { value: form.venue }))
      parts.push(render(messages.whatsapp.saved.budget, { value: form.budget }))
      if (plan) parts.push(render(messages.whatsapp.saved.total, { value: plan.total.toLocaleString("en-IN") }))
      if (form.message) parts.push(render(messages.whatsapp.saved.notes, { value: form.message }))
      parts.push("", render(messages.whatsapp.saved.viewBooking, { url: `${window.location.origin}/quote/${quoteId}?token=${encodeURIComponent(accessToken)}` }))
      parts.push("", messages.whatsapp.saved.confirm)
      window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(parts.join("\n"))}`, "_blank")
    } catch {
      const lines = [
        messages.whatsapp.fallback.start,
        "",
        render(messages.whatsapp.fallback.name, { value: form.name }),
        render(messages.whatsapp.fallback.phone, { value: form.phone }),
      ]
      if (form.email) lines.push(render(messages.whatsapp.fallback.email, { value: form.email }))
      lines.push(render(messages.whatsapp.fallback.service, { value: form.service }))
      if (form.eventDate) lines.push(render(messages.whatsapp.fallback.date, { value: form.eventDate }))
      if (plan?.timeSlot) lines.push(render(messages.whatsapp.fallback.time, { value: plan.timeSlot }))
      if (form.venue) lines.push(render(messages.whatsapp.fallback.venue, { value: form.venue }))
      lines.push(render(messages.whatsapp.fallback.budget, { value: form.budget }))
      if (plan) {
        lines.push("", messages.whatsapp.fallback.eventsTitle)
        plan.services.forEach((s) => {
          lines.push(render(messages.whatsapp.fallback.eventLine, { name: s.name, coverage: s.coverage, price: s.price.toLocaleString("en-IN") }))
          if (s.selections) s.selections.forEach((sel) => lines.push(render(messages.whatsapp.fallback.eventSelectionLine, { name: sel.name, qty: String(sel.qty) })))
        })
        if (plan.addOns.length > 0) {
          lines.push("", messages.whatsapp.fallback.extrasTitle)
          plan.addOns.forEach((a) => lines.push(render(messages.whatsapp.fallback.extraLine, { name: a.name, qty: a.qty > 1 ? ` x${a.qty}` : "", price: a.price.toLocaleString("en-IN") })))
        }
        lines.push("", render(messages.whatsapp.fallback.total, { value: plan.total.toLocaleString("en-IN") }))
      }
      if (form.message) lines.push("", render(messages.whatsapp.fallback.notes, { value: form.message }))
      lines.push("", messages.whatsapp.fallback.confirm)
      window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank")
    } finally {
      setIsSubmitting(false)
    }
    setSubmitted(true)
  }

  if (!planReady || !plan) {
    return (
      <section className="pt-32 pb-20 bg-white dark:bg-slate-950">
        <div className="max-w-lg mx-auto px-4 text-center text-slate-500 dark:text-slate-400">
          {messages.redirecting}
        </div>
      </section>
    )
  }

  if (submitted) {
    return (
      <section className="pt-32 pb-20 bg-white dark:bg-slate-950">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{messages.submittedTitle}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{messages.submittedDescription}</p>
          <Link href={withLocalePathname("/", locale)} className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium hover:underline">
            <ArrowLeft size={16} /> {messages.backHome}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">{messages.hero.badge}</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {messages.hero.titleLine1} <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.hero.titleHighlight}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">{messages.hero.description}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 rounded ${step > s ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-700"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5 mb-6">
          <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
            <Camera size={16} /> {messages.summary.title}
          </h4>
          <div className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            {plan.services.map((s, i) => (
              <div key={i} className="flex justify-between">
                <span>{s.name} <span className="text-slate-400">({s.coverage})</span></span>
                <span className="font-medium">&#8377;{s.price.toLocaleString("en-IN")}</span>
              </div>
            ))}
            {plan.addOns.map((a, i) => (
              <div key={i} className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>{a.name} x{a.qty}</span>
                <span>+&#8377;{a.price.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-amber-200 dark:border-amber-500/20 mt-3 pt-3 flex justify-between font-bold text-amber-700 dark:text-amber-400">
            <span>{messages.summary.total}</span>
            <span>&#8377;{plan.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl">
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><User size={20} className="text-amber-500" /> {messages.steps.details}</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.fullName}</label>
                <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder={messages.placeholders.fullName} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${step1Errors.name ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"} text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all`} />
                {step1Errors.name && <p className="text-red-500 text-xs mt-1">{messages.errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.phone}</label>
                <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={messages.placeholders.phone} maxLength={15} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${step1Errors.phone ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"} text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all`} />
                {step1Errors.phone && <p className="text-red-500 text-xs mt-1">{messages.errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.email}</label>
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder={messages.placeholders.email} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${step1Errors.email ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"} text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all`} />
                {step1Errors.email && <p className="text-red-500 text-xs mt-1">{messages.errors.email}</p>}
              </div>
              <button onClick={() => { if (step1Valid && isValidEmail(form.email)) setStep(2) }} disabled={!step1Valid || !isValidEmail(form.email)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
                {messages.actions.nextEvent} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Camera size={20} className="text-amber-500" /> {messages.steps.event}</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.service}</label>
                <input type="text" value={form.service} onChange={(e) => updateField("service", e.target.value)} placeholder={messages.placeholders.service} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.eventDate}</label>
                <input type="date" min={todayStr} value={form.eventDate} onChange={(e) => updateField("eventDate", e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${isDateInPast(form.eventDate) ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"} text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all dark:[color-scheme:dark]`} />
                {isDateInPast(form.eventDate) && <p className="text-red-500 text-xs mt-1">{messages.errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.venue}</label>
                <input type="text" value={form.venue} onChange={(e) => updateField("venue", e.target.value)} placeholder={messages.placeholders.venue} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                  <ArrowLeft size={18} /> {messages.actions.back}
                </button>
                <button onClick={() => { if (step2Valid) setStep(3) }} disabled={!step2Valid} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
                  {messages.actions.next} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Calendar size={20} className="text-amber-500" /> {messages.steps.budget}</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.budget}</label>
                <input type="text" value={form.budget} onChange={(e) => updateField("budget", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.requirements}</label>
                <textarea value={form.message} onChange={(e) => updateField("message", e.target.value)} rows={3} placeholder={messages.placeholders.requirements} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.fields.source}</label>
                <select value={form.source} onChange={(e) => updateField("source", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all">
                  {messages.sourceOptions.map((option, index) => (
                    <option key={option} value={index === 0 ? "" : option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                  <ArrowLeft size={18} /> {messages.actions.back}
                </button>
                <button onClick={handleSubmit} disabled={!form.budget || isSubmitting} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <MessageCircle size={18} /> {isSubmitting ? messages.actions.preparing : messages.actions.continue}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
          {messages.trust.map((item) => (
            <span key={item} className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> {item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BookPage() {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).bookPage

  return (
    <main>
      <Suspense fallback={<div className="pt-32 pb-20 text-center text-slate-400">{messages.fallback}</div>}>
        <BookingForm messages={messages} locale={locale} />
      </Suspense>
    </main>
  )
}
