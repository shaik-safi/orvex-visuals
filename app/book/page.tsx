"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// ============ PLAN TYPE (from pricing calculator) ============
interface PlanData {
  services: { name: string; coverage: string; price: number }[]
  addOns: { name: string; qty: number; price: number }[]
  total: number
  date?: string
  city?: string
  venue?: string
  customer?: { name: string; phone: string; email: string }
}

// ============ DATA ============
const serviceOptions = [
  "Wedding Photography",
  "Candid Wedding Photography",
  "Wedding Videography",
  "Pre-Wedding Shoot",
  "Post-Wedding Shoot",
  "Engagement Photography",
  "Birthday Photography",
  "Baby Shower Photography",
  "Naming Ceremony",
  "Cradle Ceremony",
  "Haldi & Mehendi",
  "Sangeet",
  "Housewarming (Gruhapravesham)",
  "Upanayana / Thread Ceremony",
  "Shastipurthi (60th Birthday)",
  "Holy Communion / Baptism",
  "Puberty Function",
  "Anniversary Photoshoot",
  "Baby Photoshoot",
  "Maternity Photoshoot",
  "Newborn Photography",
  "Family Shoot",
  "Portrait / Headshot",
  "Portfolio Shoot",
  "Fashion Photography",
  "Product / E-Commerce Photography",
  "Corporate Events",
  "Corporate Video Production",
  "Cinematic Videography",
  "Drone Photography",
  "Video Editing",
  "Album Design & Printing",
  "Photo Frames / Canvas Print",
  "Photo Restoration",
  "Other",
]

const budgetOptions = [
  "Under ₹15,000",
  "₹15,000 – ₹30,000",
  "₹30,000 – ₹60,000",
  "₹60,000 – ₹1,00,000",
  "₹1,00,000+",
  "Not sure — need guidance",
]

// ============ BOOKING FORM ============
function BookingForm() {
  const { ref, isVisible } = useScrollReveal()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [plan, setPlan] = useState<PlanData | null>(null)
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

  // Parse plan from URL if coming from calculator
  useEffect(() => {
    const planParam = searchParams.get("plan")
    if (planParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(planParam))
        // Validate plan structure
        if (
          !parsed ||
          !Array.isArray(parsed.services) ||
          !Array.isArray(parsed.addOns) ||
          typeof parsed.total !== "number"
        ) return
        setPlan(parsed as PlanData)
        // Pre-fill form fields from calculator data
        const serviceNames = parsed.services.map((s) => s.name).join(", ")
        // Auto-select budget based on total
        let autoBudget = ""
        if (parsed.total < 15000) autoBudget = "Under \u20b915,000"
        else if (parsed.total < 30000) autoBudget = "\u20b915,000 \u2013 \u20b930,000"
        else if (parsed.total < 60000) autoBudget = "\u20b930,000 \u2013 \u20b960,000"
        else if (parsed.total < 100000) autoBudget = "\u20b960,000 \u2013 \u20b91,00,000"
        else autoBudget = "\u20b91,00,000+"
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
      } catch { }
    }
  }, [searchParams])

  const updateField = (field: string, value: string) => setForm({ ...form, [field]: value })

  // Validation helpers
  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+91]/g, ""))
  const isValidEmail = (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const todayStr = new Date().toISOString().split("T")[0]

  const step1Valid = form.name.trim().length >= 2 && isValidPhone(form.phone)
  const step1Errors = {
    name: form.name.length > 0 && form.name.trim().length < 2,
    phone: form.phone.length > 0 && !isValidPhone(form.phone),
    email: form.email.length > 0 && !isValidEmail(form.email),
  }

  const handleSubmit = () => {
    let planSummary = ""
    if (plan) {
      const serviceLines = plan.services.map((s) => `  - ${s.name} - ${s.coverage} (Rs.${s.price.toLocaleString("en-IN")})`).join("\n")
      const addonLines = plan.addOns.length > 0 ? `\nAdd-ons:\n${plan.addOns.map((a) => `  - ${a.name} x${a.qty} (Rs.${a.price.toLocaleString("en-IN")})`).join("\n")}` : ""
      planSummary = `\n\nCustom Plan (from calculator):\nServices:\n${serviceLines}${addonLines}\nTotal: Rs.${plan.total.toLocaleString("en-IN")}\n`
    }

    const text = encodeURIComponent(
      `Hi Orvex Visuals, I'd like to book:\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Email: ${form.email || "Not provided"}\n` +
      `Service: ${form.service}\n` +
      `Date: ${form.eventDate || "Not decided"}\n` +
      `Venue: ${form.venue || "Not decided"}\n` +
      `Budget: ${form.budget}\n` +
      `Details: ${form.message || "None"}\n` +
      `Found via: ${form.source || "Website"}` +
      planSummary
    )
    window.open(`https://wa.me/919845332306?text=${text}`, "_blank")
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="pt-32 pb-20 bg-white dark:bg-slate-950">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Booking Sent!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Your inquiry has been sent via WhatsApp. We&apos;ll respond within 2 hours with a personalized quote.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium hover:underline">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div ref={ref} className={`max-w-2xl mx-auto px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">Book in 2 Minutes</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Book Your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Shoot</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Fill the form, get a free personalized quote within 2 hours. No call needed.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 rounded ${step > s ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-700"}`} />}
            </div>
          ))}
        </div>

        {/* Plan Summary (from calculator) */}
        {plan && (
          <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5 mb-6">
            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
              <Camera size={16} /> Your Custom Plan
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
                  <span>{a.name} ×{a.qty}</span>
                  <span>+&#8377;{a.price.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-amber-200 dark:border-amber-500/20 mt-3 pt-3 flex justify-between font-bold text-amber-700 dark:text-amber-400">
              <span>Total</span>
              <span>&#8377;{plan.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><User size={20} className="text-amber-500" /> Your Details</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Rahul Sharma" className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${step1Errors.name ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"} text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all`} />
                {step1Errors.name && <p className="text-red-500 text-xs mt-1">Enter at least 2 characters</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number *</label>
                <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/[^\d+\-\s]/g, ""))} placeholder="e.g. 98456 XXXXX" maxLength={15} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${step1Errors.phone ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"} text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all`} />
                {step1Errors.phone && <p className="text-red-500 text-xs mt-1">Enter a valid 10-digit Indian mobile number</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email (Optional)</label>
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="e.g. you@email.com" className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${step1Errors.email ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"} text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all`} />
                {step1Errors.email && <p className="text-red-500 text-xs mt-1">Enter a valid email address</p>}
              </div>
              <button onClick={() => { if (step1Valid && isValidEmail(form.email)) setStep(2) }} disabled={!step1Valid || !isValidEmail(form.email)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
                Next: Event Details <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Camera size={20} className="text-amber-500" /> Event Details</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Service Needed *</label>
                {plan ? (
                  <input type="text" value={form.service} onChange={(e) => updateField("service", e.target.value)} placeholder="e.g. Wedding Photography" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
                ) : (
                  <select value={form.service} onChange={(e) => updateField("service", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all">
                    <option value="">Select a service</option>
                    {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Event Date</label>
                <input type="date" min={todayStr} value={form.eventDate} onChange={(e) => updateField("eventDate", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all dark:[color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Venue / Location</label>
                <input type="text" value={form.venue} onChange={(e) => updateField("venue", e.target.value)} placeholder="e.g., Palace Grounds, Bangalore" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={() => { if (form.service) setStep(3) }} disabled={!form.service} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Budget & Submit */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Calendar size={20} className="text-amber-500" /> Budget & Notes</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Approx. Budget *</label>
                <select value={form.budget} onChange={(e) => updateField("budget", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all">
                  <option value="">Select budget range</option>
                  {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Any specific requirements?</label>
                <textarea value={form.message} onChange={(e) => updateField("message", e.target.value)} rows={3} placeholder="e.g., Need 2 photographers, want drone coverage, specific style preference..." className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">How did you find us?</label>
                <select value={form.source} onChange={(e) => updateField("source", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all">
                  <option value="">Select</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Friend/Family">Friend / Family</option>
                  <option value="Blog">Blog article</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={handleSubmit} disabled={!form.budget} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <MessageCircle size={18} /> Send via WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> Free quote in 2 hours</span>
          <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> No spam, ever</span>
          <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> GST-inclusive pricing</span>
        </div>
      </div>
    </section>
  )
}


export default function BookPage() {
  return (
    <main>
      <Suspense fallback={<div className="pt-32 pb-20 text-center text-slate-400">Loading...</div>}>
        <BookingForm />
      </Suspense>
    </main>
  )
}