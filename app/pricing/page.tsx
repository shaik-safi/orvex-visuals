"use client"

import { useState, useRef } from "react"
import {
  Camera,
  Video,
  Sparkles,
  Plane,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  Minus,
  Plus,
  Calculator,
  Zap,
  Crown,
  Star,
  Gift,
  Clock,
  Shield,
  Image,
  Film,
  BookOpen,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
} from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// ============ DATA ============

const packages = [
  {
    name: "Essential",
    subtitle: "Perfect for intimate events",
    price: 20000,
    icon: Star,
    popular: false,
    features: [
      "1 Professional Photographer",
      "5 hours coverage",
      "Unlimited soft copies",
      "50 edited highlights",
      "Digital delivery in 5 days",
      "Pre-event planning call",
    ],
    notIncluded: ["Video", "Drone", "Album", "Makeup"],
  },
  {
    name: "Premium",
    subtitle: "Most popular for weddings",
    price: 55000,
    icon: Crown,
    popular: true,
    features: [
      "2 Professional Photographers",
      "Full day coverage (10 hrs)",
      "Unlimited soft copies",
      "150+ edited highlights",
      "1 Cinematic highlight reel (5 min)",
      "Drone aerial coverage",
      "25-sheet premium album",
      "Digital delivery in 5 days",
      "Dedicated coordinator",
    ],
    notIncluded: ["Makeup", "LED Wall"],
  },
  {
    name: "Luxury",
    subtitle: "The complete experience",
    price: 95000,
    icon: Gift,
    popular: false,
    features: [
      "3 Photographers + 1 Videographer",
      "Multi-day coverage",
      "Unlimited soft copies",
      "300+ edited highlights",
      "Cinematic film (10-15 min)",
      "Same-day edit highlight",
      "Drone aerial coverage",
      "2x 40-sheet premium albums",
      "LED Wall backdrop",
      "Dedicated coordinator",
      "Priority 3-day delivery",
    ],
    notIncluded: [],
  },
]

// ============ HERO ============
function PricingHero() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04),transparent_70%)]" />

      <div ref={ref} className={`max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/15 rounded-full px-5 py-2.5 mb-8">
          <Shield size={14} className="text-amber-500 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300/90 text-sm font-medium tracking-wide">All prices GST-inclusive &mdash; zero hidden charges</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          Transparent{" "}
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
            Pricing
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          While others say &ldquo;call for quote&rdquo; and surprise you with 18% GST later &mdash; we show the final number upfront.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {["GST Included", "No Hidden Fees", "You Own Copyright", "5-Day Delivery"].map((tag) => (
            <span key={tag} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
              <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400/80" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ PACKAGES SECTION ============
function PackagesSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">Quick Start</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Choose Your Package
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-md mx-auto">
            Pre-built packages for common needs. Or scroll down to build a custom plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon
            return (
              <div
                key={i}
                className={`relative group rounded-2xl transition-all duration-500 hover:-translate-y-1 ${pkg.popular
                    ? "bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 border border-amber-300 dark:border-amber-500/30 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/5"
                    : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-amber-500 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-7 md:p-8">
                  <div className="mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${pkg.popular ? "bg-amber-100 dark:bg-amber-500/15" : "bg-slate-100 dark:bg-slate-800"
                      }`}>
                      <Icon className={`w-5 h-5 ${pkg.popular ? "text-amber-500 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pkg.name}</h3>
                    <p className="text-sm text-slate-500">{pkg.subtitle}</p>
                  </div>

                  <div className="mb-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        &#8377;{pkg.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-slate-500">onwards</span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">GST inclusive</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? "text-amber-500 dark:text-amber-400/80" : "text-emerald-500 dark:text-emerald-500/70"}`} />
                        <span className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/919845332306?text=Hi%20Orvex,%20I'm%20interested%20in%20the%20${pkg.name}%20package%20(%E2%82%B9${pkg.price.toLocaleString("en-IN")})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${pkg.popular
                        ? "bg-amber-500 text-white dark:text-slate-900 hover:bg-amber-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                      }`}
                  >
                    Get Started
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============ EVENT-BASED PRICING DATA ============

interface ServiceRate {
  id: string
  name: string
  description: string
  icon: any
  ratePerDay: number
  ratePerHalfDay: number
  maxQty: number
  premium?: boolean
}

interface EventAddOn {
  id: string
  name: string
  price: number
  description: string
  icon: any
  perEvent: boolean
  maxQty: number
  premium?: boolean
}

interface EventBlock {
  id: string
  name: string
  duration: "Half Day" | "Full Day"
  services: Record<string, number>
  addOns: Record<string, number>
}

const serviceRates: ServiceRate[] = [
  { id: "traditional-photo", name: "Traditional Photography", description: "Posed shots, group photos, ritual & stage coverage", icon: Camera, ratePerDay: 10000, ratePerHalfDay: 6000, maxQty: 3 },
  { id: "candid-photo", name: "Candid Photography", description: "Unposed, natural moments — storytelling style", icon: Camera, ratePerDay: 18000, ratePerHalfDay: 12000, maxQty: 3 },
  { id: "traditional-video", name: "Traditional Videography", description: "Full event recording — every ritual documented", icon: Video, ratePerDay: 10000, ratePerHalfDay: 6000, maxQty: 3 },
  { id: "cinematic-video", name: "Cinematic Videography", description: "Film-style highlight reel with color grading & music", icon: Film, ratePerDay: 15000, ratePerHalfDay: 10000, maxQty: 2, premium: true },
]

const eventAddOns: EventAddOn[] = [
  { id: "drone", name: "Drone Coverage", price: 5000, description: "Aerial photos + video for this event", icon: Plane, perEvent: true, maxQty: 1, premium: true },
  { id: "led-wall", name: "LED Wall Setup", price: 10000, description: "Digital backdrop for this event", icon: Sparkles, perEvent: true, maxQty: 2 },
  { id: "same-day-edit", name: "Same-Day Edit", price: 7000, description: "Highlight reel delivered same day", icon: Zap, perEvent: true, maxQty: 1, premium: true },
  { id: "live-stream", name: "Live Streaming", price: 5000, description: "YouTube/Zoom live for remote guests", icon: Video, perEvent: true, maxQty: 1 },
]

const globalAddOns: EventAddOn[] = [
  { id: "album-25", name: "Photo Album (25 sheets)", price: 5000, description: "Premium printed album", icon: BookOpen, perEvent: false, maxQty: 5 },
  { id: "album-40", name: "Photo Album (40 sheets)", price: 8000, description: "Deluxe large album", icon: BookOpen, perEvent: false, maxQty: 5 },
  { id: "makeup-artist", name: "Makeup Artist (Bride)", price: 10000, description: "Professional bridal makeup", icon: Sparkles, perEvent: false, maxQty: 1, premium: true },
]

const eventTemplates: Record<string, string[]> = {
  "Hindu (South Indian)": ["Pellikuthuru / Nalangu", "Haldi / Pasupu", "Sangeeth", "Muhurtham (Wedding)", "Reception"],
  "Hindu (North Indian)": ["Roka", "Haldi", "Mehendi", "Sangeet", "Baraat & Wedding", "Reception"],
  "Muslim Wedding": ["Haldi / Ubtan", "Mehendi", "Nikah", "Walima / Reception"],
  "Christian Wedding": ["Engagement", "Church Ceremony", "Reception / Party"],
  "Sikh Wedding": ["Mehendi", "Anand Karaj (Gurudwara)", "Reception"],
  "Engagement": ["Ring Ceremony", "Cocktail / After Party"],
  "Pre-Wedding Shoot": ["Pre-Wedding Photoshoot"],
  "Baby / Maternity": ["Photoshoot Session"],
  "Birthday / Event": ["Event Coverage"],
  "Housewarming": ["Griha Pravesh / Housewarming"],
  "Corporate Event": ["Conference / Seminar", "Award Ceremony"],
}

const timeSlots = ["Morning", "Afternoon", "Evening", "Full Day"] as const
type TimeSlot = (typeof timeSlots)[number]

function generateEventId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ============ INTERACTIVE PRICE CALCULATOR ============
function PriceCalculator() {
  const { ref, isVisible } = useScrollReveal()
  const [events, setEvents] = useState<EventBlock[]>([])
  const [globalAddOnQty, setGlobalAddOnQty] = useState<Record<string, number>>({})
  const [showTemplates, setShowTemplates] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<string[]>([])

  // Event metadata
  const [eventDate, setEventDate] = useState("")
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("Full Day")
  const [eventCity, setEventCity] = useState("")
  const [venueName, setVenueName] = useState("")

  // Customer info
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [showContactForm, setShowContactForm] = useState(false)

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0]
  
  const summaryRef = useRef<HTMLDivElement>(null)

  const addEvent = (name: string) => {
    const newEvent: EventBlock = {
      id: generateEventId(),
      name,
      duration: "Full Day",
      services: {},
      addOns: {},
    }
    setEvents((prev) => [...prev, newEvent])
    setExpandedEvents((prev) => [...prev, newEvent.id])
    setShowTemplates(false)
  }

  const addFromTemplate = (templateName: string) => {
    const templateEvents = eventTemplates[templateName]
    if (!templateEvents) return
    const newEvents = templateEvents.map((name) => ({
      id: generateEventId(),
      name,
      duration: "Full Day" as const,
      services: {},
      addOns: {},
    }))
    setEvents((prev) => [...prev, ...newEvents])
    setExpandedEvents((prev) => [...prev, ...newEvents.map((e) => e.id)])
    setShowTemplates(false)
  }

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setExpandedEvents((prev) => prev.filter((eid) => eid !== id))
  }

  const updateEventName = (id: string, name: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, name } : e)))
  }

  const updateEventDuration = (id: string, duration: "Half Day" | "Full Day") => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, duration } : e)))
  }

  const updateEventService = (eventId: string, serviceId: string, delta: number) => {
    const service = serviceRates.find((s) => s.id === serviceId)
    if (!service) return
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const current = e.services[serviceId] || 0
        const next = Math.max(0, Math.min(service.maxQty, current + delta))
        const newServices = { ...e.services }
        if (next === 0) delete newServices[serviceId]
        else newServices[serviceId] = next
        return { ...e, services: newServices }
      })
    )
  }

  const updateEventAddOn = (eventId: string, addOnId: string, delta: number) => {
    const addon = eventAddOns.find((a) => a.id === addOnId)
    if (!addon) return
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const current = e.addOns[addOnId] || 0
        const next = Math.max(0, Math.min(addon.maxQty, current + delta))
        const newAddOns = { ...e.addOns }
        if (next === 0) delete newAddOns[addOnId]
        else newAddOns[addOnId] = next
        return { ...e, addOns: newAddOns }
      })
    )
  }

  const updateGlobalAddOn = (id: string, delta: number) => {
    const addon = globalAddOns.find((a) => a.id === id)
    if (!addon) return
    setGlobalAddOnQty((prev) => {
      const current = prev[id] || 0
      const next = Math.max(0, Math.min(addon.maxQty, current + delta))
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  const toggleExpandEvent = (id: string) => {
    setExpandedEvents((prev) => (prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]))
  }

  const getEventPrice = (event: EventBlock) => {
    let total = 0
    for (const [serviceId, qty] of Object.entries(event.services)) {
      const service = serviceRates.find((s) => s.id === serviceId)
      if (!service) continue
      const rate = event.duration === "Full Day" ? service.ratePerDay : service.ratePerHalfDay
      total += rate * qty
    }
    for (const [addOnId, qty] of Object.entries(event.addOns)) {
      const addon = eventAddOns.find((a) => a.id === addOnId)
      if (!addon) continue
      total += addon.price * qty
    }
    return total
  }

  const eventsTotal = events.reduce((sum, event) => sum + getEventPrice(event), 0)
  const globalAddOnTotal = Object.entries(globalAddOnQty).reduce((sum, [id, qty]) => {
    const addon = globalAddOns.find((a) => a.id === id)
    return sum + (addon?.price || 0) * qty
  }, 0)
  const totalPrice = eventsTotal + globalAddOnTotal
  const hasContent = events.length > 0

  const configuredEvents = events.filter((e) => Object.keys(e.services).length > 0)
  const hasConfiguredEvents = configuredEvents.length > 0

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  const generateWhatsAppMessage = () => {
    if (!hasConfiguredEvents) return ""

    const lines: string[] = []
    lines.push("Hello Orvex Visuals,")
    lines.push("")
    lines.push("I'd like a quotation for the following events:")
    lines.push("")

    if (eventDate) lines.push(`Date: ${formatDate(eventDate)}`)
    if (timeSlot && timeSlot !== "Full Day") lines.push(`Time: ${timeSlot}`)
    if (eventCity) lines.push(`Location: ${eventCity}${venueName ? ` - ${venueName}` : ""}`)
    if (eventDate || eventCity) lines.push("")

    configuredEvents.forEach((event, idx) => {
      lines.push(`${idx + 1}. ${event.name} - ${event.duration}`)
      for (const [sid, qty] of Object.entries(event.services)) {
        const s = serviceRates.find((sr) => sr.id === sid)
        if (s) lines.push(`   - ${s.name} x${qty}`)
      }
      for (const [aid, qty] of Object.entries(event.addOns)) {
        const a = eventAddOns.find((ao) => ao.id === aid)
        if (a) lines.push(`   - ${a.name} x${qty}`)
      }
      lines.push(`   Subtotal: Rs.${getEventPrice(event).toLocaleString("en-IN")}`)
      lines.push("")
    })

    const globalLines = Object.entries(globalAddOnQty)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const a = globalAddOns.find((ao) => ao.id === id)
        return a ? `- ${a.name}${qty > 1 ? ` x${qty}` : ""} (Rs.${(a.price * qty).toLocaleString("en-IN")})` : null
      })
      .filter(Boolean)

    if (globalLines.length > 0) {
      lines.push("Extras:")
      lines.push(...(globalLines as string[]))
      lines.push("")
    }

    lines.push(`Estimated Total: Rs.${totalPrice.toLocaleString("en-IN")}`)
    lines.push("")

    if (customerName) lines.push(`Name: ${customerName}`)
    if (customerPhone) lines.push(`Phone: ${customerPhone}`)
    if (customerEmail) lines.push(`Email: ${customerEmail}`)
    if (customerName || customerPhone) lines.push("")

    lines.push("Please confirm availability. Thank you.")

    return encodeURIComponent(lines.join("\n"))
  }

  const generateBookingUrl = () => {
    if (!hasConfiguredEvents) return "#"
    const plan = {
      services: configuredEvents.map((event) => ({
        name: event.name,
        coverage: event.duration,
        price: getEventPrice(event),
      })),
      addOns: Object.entries(globalAddOnQty)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const addon = globalAddOns.find((a) => a.id === id)
          return { name: addon?.name, qty, price: (addon?.price || 0) * qty }
        }),
      total: totalPrice,
      date: eventDate,
      city: eventCity,
      venue: venueName,
      customer: { name: customerName, phone: customerPhone, email: customerEmail },
    }
    return `/book?plan=${encodeURIComponent(JSON.stringify(plan))}`
  }

  const handleGetQuote = () => {
    if (!hasConfiguredEvents) return
    if (!customerName.trim() || !customerPhone.trim()) {
      setShowContactForm(true)
      return
    }
    const url = `https://wa.me/919845332306?text=${generateWhatsAppMessage()}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="calculator" className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto px-6 relative">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">Custom Package Builder</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Build Your Package
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
            Step 1: Pick a template or add events. Step 2: Choose your team & extras. Step 3: Get instant quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Event Builder */}
          <div className="lg:col-span-2 space-y-8">

            {/* Event Details */}
            <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "100ms" }}>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Event Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={eventDate}
                    min={todayStr}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white focus:border-amber-500/50 focus:outline-none transition-colors dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`flex-1 py-3 text-xs font-medium transition-colors ${timeSlot === slot
                          ? "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                    placeholder="e.g. Bangalore, Mysore, Mangalore"
                  />
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                    placeholder="e.g. Rajmahal Convention, Taj West End"
                  />
                </div>
              </div>
            </div>

            {/* Step 1: Add Events */}
            <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Events</p>
                {events.length > 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">{events.length} event{events.length > 1 ? "s" : ""}</span>
                )}
              </div>

              {/* Template selector */}
              <div className="mb-4">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-amber-400 dark:hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                >
                  <Sparkles size={14} />
                  Quick Templates
                  <ChevronDown size={12} className={`transition-transform ${showTemplates ? "rotate-180" : ""}`} />
                </button>

                {showTemplates && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.keys(eventTemplates).map((template) => (
                      <button
                        key={template}
                        onClick={() => addFromTemplate(template)}
                        className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add custom event */}
              <button
                onClick={() => addEvent("New Event")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-400 dark:hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all text-sm font-medium"
              >
                <Plus size={14} />
                Add Event / Day
              </button>
            </div>

            {/* Event Blocks */}
            {events.length > 0 && (
              <div className="space-y-3">
                {events.map((event, eventIndex) => {
                  const isExpanded = expandedEvents.includes(event.id)
                  const eventPrice = getEventPrice(event)
                  const serviceCount = Object.values(event.services).reduce((a, b) => a + b, 0)

                  return (
                    <div key={event.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/50">
                      {/* Event Header */}
                      <div className="flex items-center gap-3 px-5 py-4">
                        <button
                          onClick={() => toggleExpandEvent(event.id)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {eventIndex + 1}
                          </span>
                          <div className="flex-1 min-w-0 text-left">
                            <span className="text-sm font-medium text-slate-900 dark:text-white block truncate">{event.name}</span>
                            <span className="text-xs text-slate-500">
                              {event.duration} · {serviceCount > 0 ? `${serviceCount} service${serviceCount > 1 ? "s" : ""}` : "No services yet"}
                              {eventPrice > 0 && ` · ₹${(eventPrice / 1000).toFixed(0)}K`}
                            </span>
                          </div>
                          <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 text-sm"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Event Detail (expanded) */}
                      {isExpanded && (
                        <div className="px-5 pb-6 space-y-5 border-t border-slate-100 dark:border-slate-800/60 pt-5">
                          {/* Event name + duration */}
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={event.name}
                              onChange={(e) => updateEventName(event.id, e.target.value)}
                              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-white focus:border-amber-500/50 focus:outline-none transition-colors"
                              placeholder="e.g. Reception, Haldi, Sangeeth..."
                            />
                            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60">
                              {(["Half Day", "Full Day"] as const).map((d) => (
                                <button
                                  key={d}
                                  onClick={() => updateEventDuration(event.id, d)}
                                  className={`px-3.5 py-2.5 text-xs font-medium transition-colors ${event.duration === d
                                      ? "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                      : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                    }`}
                                >
                                  {d}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Services */}
                          <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Team</p>
                            <div className="space-y-2">
                              {serviceRates.map((service) => {
                                const Icon = service.icon
                                const qty = event.services[service.id] || 0
                                const rate = event.duration === "Full Day" ? service.ratePerDay : service.ratePerHalfDay
                                return (
                                  <div
                                    key={service.id}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${qty > 0
                                        ? "bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15"
                                        : "bg-slate-50 dark:bg-slate-800/30 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                                      }`}
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${qty > 0 ? "bg-amber-100 dark:bg-amber-500/15 text-amber-500 dark:text-amber-400" : "bg-slate-200 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500"
                                      }`}>
                                      <Icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className={`text-sm font-medium block ${qty > 0 ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                        {service.name}
                                        {service.premium && <span className="ml-1.5 text-[10px] text-amber-500 dark:text-amber-400/70 font-normal">Premium</span>}
                                      </span>
                                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{service.description} · ₹{(rate / 1000).toFixed(0)}K</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => updateEventService(event.id, service.id, -1)}
                                        disabled={qty === 0}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                                      >
                                        <Minus size={11} />
                                      </button>
                                      <span className={`w-5 text-center text-sm font-semibold ${qty > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-300 dark:text-slate-600"}`}>{qty}</span>
                                      <button
                                        onClick={() => updateEventService(event.id, service.id, 1)}
                                        disabled={qty >= service.maxQty}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                                      >
                                        <Plus size={11} />
                                      </button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Event-specific add-ons */}
                          <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Extras</p>
                            <div className="flex flex-wrap gap-2">
                              {eventAddOns.map((addon) => {
                                const qty = event.addOns[addon.id] || 0
                                const Icon = addon.icon
                                return (
                                  <button
                                    key={addon.id}
                                    onClick={() => updateEventAddOn(event.id, addon.id, qty > 0 ? -1 : 1)}
                                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${qty > 0
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                                        : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                                      }`}
                                  >
                                    <Icon size={12} />
                                    {addon.name}
                                    <span className="opacity-60">₹{(addon.price / 1000).toFixed(0)}K</span>
                                    {qty > 0 && <CheckCircle2 size={11} />}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Global Add-ons */}
            {events.length > 0 && (
              <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "400ms" }}>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Albums & Extras</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">These apply to your overall package</p>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60">
                  {globalAddOns.map((addon) => {
                    const Icon = addon.icon
                    const qty = globalAddOnQty[addon.id] || 0
                    const isSelected = qty > 0
                    return (
                      <div key={addon.id} className={`flex items-center gap-3 px-5 py-4 transition-colors ${isSelected ? "bg-emerald-50/50 dark:bg-emerald-500/[0.03]" : ""}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500"
                          }`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium block ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                            {addon.name}
                            {addon.premium && <span className="ml-1.5 text-[10px] text-amber-500 dark:text-amber-400/70 font-normal">Premium</span>}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">{addon.description} · ₹{(addon.price / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateGlobalAddOn(addon.id, -1)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                          >
                            <Minus size={11} />
                          </button>
                          <span className={`w-5 text-center text-sm font-semibold ${isSelected ? "text-emerald-500 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`}>{qty}</span>
                          <button
                            onClick={() => updateGlobalAddOn(addon.id, 1)}
                            disabled={qty >= addon.maxQty}
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-25"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Summary Sidebar */}
          <div className="lg:col-span-1" ref={summaryRef}>
            <div className={`sticky top-28 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms" }}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Your Package</h3>

                {!hasContent ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Camera size={20} className="text-slate-400 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm">Add events to see your estimate</p>
                    <p className="text-slate-400 dark:text-slate-600 text-xs mt-2">Use a template or add events one by one</p>
                  </div>
                ) : (
                  <>
                    {/* Events breakdown */}
                    <div className="space-y-2.5 mb-6">
                      <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-medium">{events.length} Event{events.length > 1 ? "s" : ""}</p>
                      {events.map((event) => {
                        const price = getEventPrice(event)
                        return (
                          <div key={event.id} className="rounded-xl bg-slate-50 dark:bg-slate-800/40 px-4 py-3">
                            <div className="flex justify-between items-start">
                              <div className="min-w-0 flex-1">
                                <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{event.name}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">{event.duration}</p>
                                {Object.entries(event.services).map(([sid, qty]) => {
                                  const s = serviceRates.find((sr) => sr.id === sid)
                                  return s ? (
                                    <p key={sid} className="text-slate-400 dark:text-slate-600 text-[10px] leading-relaxed">{s.name} ×{qty}</p>
                                  ) : null
                                })}
                              </div>
                              <span className={`text-sm font-semibold ml-3 ${price > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-slate-600 italic text-xs"}`}>
                                {price > 0 ? `₹${(price / 1000).toFixed(0)}K` : "No services"}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Global Add-ons in summary */}
                    {Object.keys(globalAddOnQty).length > 0 && (
                      <div className="space-y-2 mb-6">
                        <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-medium">Extras</p>
                        {Object.entries(globalAddOnQty).map(([id, qty]) => {
                          const addon = globalAddOns.find((a) => a.id === id)
                          if (!addon || qty === 0) return null
                          return (
                            <div key={id} className="flex justify-between items-center px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                              <span className="text-slate-600 dark:text-slate-400 text-sm">{addon.name} {qty > 1 && <span className="text-slate-400 dark:text-slate-600">×{qty}</span>}</span>
                              <span className="text-emerald-500 dark:text-emerald-400/80 text-sm font-medium">+₹{((addon.price * qty) / 1000).toFixed(0)}K</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mb-6">
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Estimated Total</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            &#8377;{totalPrice.toLocaleString("en-IN")}
                          </div>
                          <span className="text-emerald-500 dark:text-emerald-400/70 text-[11px]">GST inclusive</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Form (shown when needed) */}
                    {showContactForm && (
                      <div className="space-y-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">We'll send the quote to you</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600">Fields marked * are required</p>
                        <div className="relative">
                          <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500/40 focus:outline-none"
                            placeholder="e.g. Rahul Sharma *"
                          />
                        </div>
                        <div className="relative">
                          <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500/40 focus:outline-none"
                            placeholder="e.g. 98456 XXXXX *"
                            maxLength={10}
                          />
                        </div>
                        <div className="relative">
                          <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500/40 focus:outline-none"
                            placeholder="e.g. you@email.com"
                          />
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    {!hasConfiguredEvents && (
                      <p className="text-center text-slate-400 dark:text-slate-600 text-xs mb-4">Add services to at least one event to get a quote</p>
                    )}
                    <div className="space-y-3">
                      <button
                        onClick={handleGetQuote}
                        disabled={!hasConfiguredEvents}
                        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${hasConfiguredEvents
                            ? "bg-amber-500 text-white dark:text-slate-900 hover:bg-amber-400 active:scale-[0.98]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          }`}
                      >
                        <MessageCircle size={15} />
                        Get Quote on WhatsApp
                      </button>
                      <a
                        href={hasConfiguredEvents ? generateBookingUrl() : undefined}
                        onClick={(e) => { if (!hasConfiguredEvents) e.preventDefault() }}
                        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm transition-all duration-300 ${hasConfiguredEvents
                            ? "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                            : "border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                          }`}
                      >
                        Fill Booking Form
                        <ArrowRight size={13} />
                      </a>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      {[
                        { icon: Shield, text: "No hidden charges" },
                        { icon: Clock, text: "5-day delivery guarantee" },
                        { icon: CheckCircle2, text: "100% copyright yours" },
                        { icon: Star, text: "Backup equipment on-site" },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2.5 text-slate-500 text-xs">
                          <Icon size={12} className="text-emerald-500 dark:text-emerald-500/60" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ COMPARISON TABLE ============
function ComparisonSection() {
  const { ref, isVisible } = useScrollReveal()
  const comparisons = [
    { feature: "Pricing Transparency", orvex: "All prices on website", competitor: "\"Call for quote\"" },
    { feature: "GST", orvex: "Included in price", competitor: "+18% surprise" },
    { feature: "Photo Delivery", orvex: "5 days", competitor: "30-45 days" },
    { feature: "Video Delivery", orvex: "15 days", competitor: "45-60 days" },
    { feature: "Copyright", orvex: "100% yours", competitor: "Studio retains rights" },
    { feature: "Booking Process", orvex: "Online in 2 min", competitor: "Phone calls only" },
    { feature: "Overtime", orvex: "Flexible — no surprise charges", competitor: "₹3,000/hr (hidden)" },
    { feature: "Cancellation", orvex: "Partial refund available", competitor: "Non-refundable" },
  ]

  return (
    <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div ref={ref} className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-amber-500 dark:text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">Why We&apos;re Different</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Orvex vs Others
          </h2>
        </div>

        <div className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          {/* Header */}
          <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-900">
            <div className="p-4 md:p-5 text-xs font-medium text-slate-500 uppercase tracking-wider">Feature</div>
            <div className="p-4 md:p-5 text-xs font-medium text-amber-500 dark:text-amber-400 text-center uppercase tracking-wider">Orvex</div>
            <div className="p-4 md:p-5 text-xs font-medium text-slate-400 dark:text-slate-600 text-center uppercase tracking-wider">Others</div>
          </div>

          {/* Rows */}
          {comparisons.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-t border-slate-200 dark:border-slate-800/60 ${i % 2 === 0 ? "bg-white dark:bg-slate-900/30" : "bg-slate-50 dark:bg-transparent"
                }`}
            >
              <div className="p-4 md:p-5 text-sm text-slate-700 dark:text-slate-300">{row.feature}</div>
              <div className="p-4 md:p-5 text-sm text-emerald-600 dark:text-emerald-400/90 text-center font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 size={13} />
                {row.orvex}
              </div>
              <div className="p-4 md:p-5 text-sm text-slate-400 dark:text-slate-600 text-center">{row.competitor}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ CTA ============
function PricingCTA() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className={`py-24 md:py-32 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-8">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
          <span className="text-white/80 text-sm">Peak season weekends filling fast</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
          Lock In Your Date
        </h2>
        <p className="text-amber-100/80 text-lg mb-10 max-w-md mx-auto">
          Get a personalized quote in 2 hours. No pressure, no follow-up calls &mdash; just honest pricing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/919845332306?text=Hi%20Orvex,%20I'd%20like%20a%20custom%20quote%20for%20my%20event"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300"
          >
            <MessageCircle size={18} />
            Get My Custom Quote
          </a>
          <a
            href="/book"
            className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white hover:text-amber-700 px-8 py-4 rounded-xl font-bold transition-all duration-300"
          >
            Book Now &mdash; 30% Advance Only
          </a>
        </div>
      </div>
    </section>
  )
}

// ============ MAIN ============
export default function PricingPage() {
  return (
    <main>
      <PricingHero />
      <PackagesSection />
      <PriceCalculator />
      <ComparisonSection />
      <PricingCTA />
    </main>
  )
}
