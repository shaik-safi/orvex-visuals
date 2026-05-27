"use client"

import { useState, useEffect, useCallback, useMemo, type Dispatch, type SetStateAction, type FormEvent } from "react"
import {
  Search,
  RefreshCw,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Download,
  TrendingUp,
  Users,
  MessageCircle,
  SlidersHorizontal,
} from "lucide-react"

// ============ TYPES ============
interface QuoteRow {
  id: string
  status: "new" | "confirmed" | "cancelled"
  createdAt: string | null
  source?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  date?: string
  timeSlot?: string
  city?: string
  venue?: string
  service?: string
  budget?: string
  notes?: string
  foundVia?: string
  total?: number
  events?: { name: string; duration: string; price: number; selections: { name: string; qty: number; unitPrice: number }[] }[]
  globalAddOns?: { name: string; qty: number; price: number }[]
}

interface Filters {
  search: string
  status: "all" | "new" | "confirmed" | "cancelled"
  source: "all" | "calculator" | "booking"
  city: string
  eventDateFrom: string
  eventDateTo: string
  sort: "newest" | "oldest" | "event-date" | "amount-high" | "amount-low"
}

const STATUS_STYLES = {
  new: "bg-blue-500/15 text-blue-300",
  confirmed: "bg-green-500/15 text-green-300",
  cancelled: "bg-red-500/15 text-red-300",
}
const STATUS_ICONS = { new: Clock, confirmed: CheckCircle, cancelled: XCircle }

// ============ HELPERS ============
function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function fmtRupee(n: number | undefined) {
  if (!n) return "—"
  return "₹" + n.toLocaleString("en-IN")
}

function waLink(phone: string | undefined) {
  if (!phone) return "#"
  const digits = phone.replace(/\D/g, "")
  const normalized = digits.startsWith("91") ? digits : `91${digits}`
  return `https://wa.me/${normalized}`
}

function exportCSV(quotes: QuoteRow[]) {
  const headers = ["ID", "Name", "Phone", "Email", "Status", "Event Date", "City", "Venue", "Service", "Total (₹)", "Source", "Found Via", "Notes", "Created At"]
  const rows = quotes.map((q) => [
    q.id,
    q.customerName ?? "",
    q.customerPhone ?? "",
    q.customerEmail ?? "",
    q.status,
    q.date ?? "",
    q.city ?? "",
    q.venue ?? "",
    q.service ?? (q.events?.map((e) => e.name).join(" + ") ?? ""),
    q.total ?? "",
    q.source ?? "",
    q.foundVia ?? "",
    (q.notes ?? "").replace(/,/g, ";"),
    q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-IN") : "",
  ])
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `orvex-quotes-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ============ LOGIN ============
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/quotes", { headers: { "x-admin-key": password } })
    if (res.ok) {
      sessionStorage.setItem("admin_key", password)
      onLogin(password)
    } else {
      setError("Wrong password. Try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-4">
            <IndianRupee size={28} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Orvex Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to view all quotes</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Admin Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-12"
                autoFocus
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

// ============ STATS CARDS ============
function StatsBar({ quotes }: { quotes: QuoteRow[] }) {
  const now = new Date()
  const thisMonth = quotes.filter((q) => {
    if (!q.createdAt) return false
    const d = new Date(q.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const confirmed = quotes.filter((q) => q.status === "confirmed")
  const confirmedRevenue = confirmed.reduce((s, q) => s + (q.total ?? 0), 0)
  const conversionRate = quotes.length > 0 ? Math.round((confirmed.length / quotes.length) * 100) : 0

  const stats = [
    { icon: Users, label: "Total Quotes", value: quotes.length.toString(), sub: `${thisMonth.length} this month` },
    { icon: Clock, label: "Pending", value: quotes.filter((q) => q.status === "new").length.toString(), sub: "awaiting follow-up" },
    { icon: CheckCircle, label: "Confirmed", value: confirmed.length.toString(), sub: `${conversionRate}% conversion` },
    { icon: TrendingUp, label: "Confirmed Revenue", value: confirmedRevenue > 0 ? `₹${confirmedRevenue.toLocaleString("en-IN")}` : "—", sub: "from confirmed bookings" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <s.icon size={14} className="text-amber-400" />
            <span className="text-slate-400 text-xs">{s.label}</span>
          </div>
          <p className="text-xl font-bold text-white">{s.value}</p>
          <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}

// ============ FILTERS BAR ============
function FiltersBar({ filters, setFilters, cities, onExport, resultCount }: {
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  cities: string[]
  onExport: () => void
  resultCount: number
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters = filters.source !== "all" || !!filters.city || !!filters.eventDateFrom || !!filters.eventDateTo

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      {/* Row 1: search + buttons */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Name, phone, email, city, notes…"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${hasActiveFilters ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"}`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters ? " •" : ""}
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Export filtered results to CSV"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Row 2: status quick pills */}
      <div className="flex gap-2 flex-wrap items-center">
        {(["all", "new", "confirmed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => set("status", s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${filters.status === s ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
          >
            {s}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">{resultCount} result{resultCount !== 1 ? "s" : ""}</span>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Source</label>
            <select value={filters.source} onChange={(e) => set("source", e.target.value as Filters["source"])}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="all">All sources</option>
              <option value="calculator">Pricing calculator</option>
              <option value="booking">Direct booking form</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">City</label>
            <select value={filters.city} onChange={(e) => set("city", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="">All cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Sort by</label>
            <select value={filters.sort} onChange={(e) => set("sort", e.target.value as Filters["sort"])}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="event-date">By event date</option>
              <option value="amount-high">Amount: high → low</option>
              <option value="amount-low">Amount: low → high</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Event date from</label>
            <input type="date" value={filters.eventDateFrom} onChange={(e) => set("eventDateFrom", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Event date to</label>
            <input type="date" value={filters.eventDateTo} onChange={(e) => set("eventDateTo", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, source: "all", city: "", eventDateFrom: "", eventDateTo: "", sort: "newest" }))}
              className="w-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl px-3 py-2 text-sm transition-colors"
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ QUOTE DETAIL ============
function QuoteDetail({ quote }: { quote: QuoteRow }) {
  return (
    <div className="px-6 pb-6 pt-3 bg-slate-800/30 text-sm space-y-4 border-t border-slate-800">
      {/* Contact row */}
      <div className="flex flex-wrap gap-3 items-center">
        {quote.customerPhone && (
          <>
            <a
              href={waLink(quote.customerPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <a href={`tel:${quote.customerPhone}`} className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors text-xs">
              <Phone size={13} className="text-amber-400" /> {quote.customerPhone}
            </a>
          </>
        )}
        {quote.customerEmail && (
          <a href={`mailto:${quote.customerEmail}`} className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors text-xs">
            <Mail size={13} className="text-amber-400" /> {quote.customerEmail}
          </a>
        )}
        {(quote.city || quote.venue) && (
          <span className="flex items-center gap-1.5 text-slate-300 text-xs">
            <MapPin size={13} className="text-amber-400" /> {[quote.venue, quote.city].filter(Boolean).join(", ")}
          </span>
        )}
        {quote.date && (
          <span className="flex items-center gap-1.5 text-slate-300 text-xs">
            <Calendar size={13} className="text-amber-400" /> {quote.date}{quote.timeSlot ? ` · ${quote.timeSlot}` : ""}
          </span>
        )}
      </div>

      {/* Events */}
      {quote.events && quote.events.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Events</p>
          <div className="space-y-2">
            {quote.events.map((ev, i) => (
              <div key={i} className="bg-slate-800 rounded-xl px-4 py-3">
                <div className="flex justify-between">
                  <span className="font-medium text-white text-sm">{ev.name}</span>
                  <span className="text-amber-400 text-sm">{fmtRupee(ev.price)}</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{ev.duration}</p>
                {ev.selections?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {ev.selections.map((s, j) => (
                      <li key={j} className="text-slate-400 text-xs flex justify-between">
                        <span>{s.name} × {s.qty}</span>
                        <span>{fmtRupee(s.unitPrice * s.qty)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global add-ons */}
      {quote.globalAddOns && quote.globalAddOns.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Add-ons</p>
          <div className="flex flex-wrap gap-2">
            {quote.globalAddOns.map((a, i) => (
              <span key={i} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg">
                {a.name} × {a.qty} — {fmtRupee(a.price)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Extra info row */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-300">
        {quote.service && <span><span className="text-slate-500">Service:</span> {quote.service}</span>}
        {quote.budget && <span><span className="text-slate-500">Budget:</span> {quote.budget}</span>}
        {quote.source && <span><span className="text-slate-500">Source:</span> {quote.source}</span>}
        {quote.foundVia && <span><span className="text-slate-500">Found via:</span> {quote.foundVia}</span>}
      </div>

      {quote.notes && (
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Notes</p>
          <p className="text-slate-300 bg-slate-800 rounded-xl px-4 py-3 text-xs leading-relaxed">{quote.notes}</p>
        </div>
      )}
    </div>
  )
}

// ============ QUOTE ITEM ============
function QuoteItem({ quote, adminKey, onStatusChange }: {
  quote: QuoteRow
  adminKey: string
  onStatusChange: (id: string, status: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const StatusIcon = STATUS_ICONS[quote.status] ?? Clock

  async function updateStatus(status: string) {
    setUpdating(true)
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ id: quote.id, status }),
      })
      if (res.ok) {
        onStatusChange(quote.id, status)
      } else {
        alert("Failed to update status. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to update status. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between px-5 py-4 gap-3">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
          <span className="text-slate-500 hover:text-white transition-colors shrink-0">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate text-sm">{quote.customerName ?? "Unknown"}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-slate-500 text-xs">#{quote.id}</span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-slate-400 text-xs">{fmtDate(quote.createdAt)}</span>
              {quote.date && (
                <>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Calendar size={10} /> Event: {quote.date}
                  </span>
                </>
              )}
              {quote.city && (
                <>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-400 text-xs">{quote.city}</span>
                </>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {quote.total ? (
            <span className="text-amber-400 font-semibold text-sm hidden sm:block">{fmtRupee(quote.total)}</span>
          ) : null}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[quote.status]}`}>
            <StatusIcon size={11} />
            {quote.status}
          </span>
          <select
            value={quote.status}
            disabled={updating}
            onChange={(e) => updateStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 disabled:opacity-50"
          >
            <option value="new">new</option>
            <option value="confirmed">confirmed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
      </div>
      {expanded && <QuoteDetail quote={quote} />}
    </div>
  )
}

// ============ DASHBOARD ============
function Dashboard({ adminKey, onLogout }: { adminKey: string; onLogout: () => void }) {
  const [quotes, setQuotes] = useState<QuoteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState<Filters>({
    search: "", status: "all", source: "all", city: "",
    eventDateFrom: "", eventDateTo: "", sort: "newest",
  })

  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/quotes", { headers: { "x-admin-key": adminKey } })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setQuotes(data.quotes ?? [])
    } catch {
      setError("Could not load quotes. Check your Firebase configuration.")
    }
    setLoading(false)
  }, [adminKey])

  useEffect(() => { fetchQuotes() }, [fetchQuotes])

  function handleStatusChange(id: string, status: string) {
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status: status as QuoteRow["status"] } : q))
  }

  const cities = useMemo(() => {
    const set = new Set(quotes.map((q) => q.city).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [quotes])

  const filtered = useMemo(() => {
    const result = quotes.filter((q) => {
      if (filters.status !== "all" && q.status !== filters.status) return false
      if (filters.source !== "all" && q.source !== filters.source) return false
      if (filters.city && q.city !== filters.city) return false
      if (filters.eventDateFrom && q.date && q.date < filters.eventDateFrom) return false
      if (filters.eventDateTo && q.date && q.date > filters.eventDateTo) return false
      if (filters.search) {
        const term = filters.search.toLowerCase()
        if (![q.customerName, q.customerPhone, q.customerEmail, q.city, q.venue, q.service, q.notes]
          .some((v) => v?.toLowerCase().includes(term))) return false
      }
      return true
    })
    return result.sort((a, b) => {
      switch (filters.sort) {
        case "oldest": return (a.createdAt ?? "") > (b.createdAt ?? "") ? 1 : -1
        case "event-date": return (a.date ?? "") > (b.date ?? "") ? 1 : -1
        case "amount-high": return (b.total ?? 0) - (a.total ?? 0)
        case "amount-low": return (a.total ?? 0) - (b.total ?? 0)
        default: return (a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1
      }
    })
  }, [quotes, filters])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white">Orvex Admin</h1>
            <p className="text-slate-400 text-xs">{quotes.length} total quotes</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchQuotes} disabled={loading} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50" title="Refresh">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {!loading && quotes.length > 0 && <StatsBar quotes={quotes} />}

        <FiltersBar filters={filters} setFilters={setFilters} cities={cities} onExport={() => exportCSV(filtered)} resultCount={filtered.length} />

        {loading && <div className="text-center py-20 text-slate-400">Loading quotes…</div>}
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 text-sm">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            {filters.search || filters.status !== "all" || filters.source !== "all" || filters.city || filters.eventDateFrom
              ? "No quotes match your filters."
              : "No quotes yet. They will appear here after customers book."}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((q) => (
              <QuoteItem key={q.id} quote={q} adminKey={adminKey} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// ============ PAGE ============
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key")
    if (saved) setAdminKey(saved)
  }, [])

  if (!adminKey) {
    return (
      <LoginScreen onLogin={(pw) => {
        sessionStorage.setItem("admin_key", pw)
        setAdminKey(pw)
      }} />
    )
  }

  return (
    <Dashboard adminKey={adminKey} onLogout={() => {
      sessionStorage.removeItem("admin_key")
      setAdminKey(null)
    }} />
  )
}
