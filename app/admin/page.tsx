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

import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getLocaleTag } from "@/lib/i18n/config"
import { getPageMessages } from "@/lib/i18n/pages"
import { applyTemplate } from "@/lib/i18n/home"

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

const STATUS_ICONS = {
  new: Clock,
  confirmed: CheckCircle,
  cancelled: XCircle,
}

type AdminMessages = ReturnType<typeof getPageMessages>["adminPage"]

function fmtDate(iso: string | null | undefined, localeTag: string, empty: string) {
  if (!iso) return empty
  return new Date(iso).toLocaleDateString(localeTag, { day: "numeric", month: "short", year: "numeric" })
}

function fmtRupee(value: number | undefined, empty: string) {
  if (!value) return empty
  return `Rs.${value.toLocaleString("en-IN")}`
}

function waLink(phone: string | undefined) {
  if (!phone) return "#"
  const digits = phone.replace(/\D/g, "")
  const normalized = digits.startsWith("91") ? digits : `91${digits}`
  return `https://wa.me/${normalized}`
}

function statusLabel(status: Filters["status"], messages: AdminMessages) {
  return messages.statuses[status]
}

function exportCSV(quotes: QuoteRow[], localeTag: string, messages: AdminMessages) {
  const headers = messages.csv.headers
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
    q.createdAt ? new Date(q.createdAt).toLocaleDateString(localeTag) : "",
  ])
  const csv = [headers, ...rows].map((row) => row.map((cell: string | number) => `"${String(cell)}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${messages.csv.filePrefix}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function LoginScreen({
  onLogin,
  messages,
}: {
  onLogin: (pw: string) => void
  messages: AdminMessages
}) {
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/admin/quotes", { headers: { "x-admin-key": password } })
    if (res.ok) {
      sessionStorage.setItem("admin_key", password)
      onLogin(password)
    } else {
      setError(messages.wrongPassword)
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
          <h1 className="text-2xl font-bold text-white">{messages.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{messages.signinSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{messages.password}</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={messages.passwordPlaceholder}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
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
            {loading ? messages.checking : messages.signIn}
          </button>
        </form>
      </div>
    </div>
  )
}

function StatsBar({ quotes, messages }: { quotes: QuoteRow[]; messages: AdminMessages }) {
  const confirmed = quotes.filter((q) => q.status === "confirmed")
  const confirmedRevenue = confirmed.reduce((sum, quote) => sum + (quote.total ?? 0), 0)
  const conversionRate = quotes.length > 0 ? Math.round((confirmed.length / quotes.length) * 100) : 0
  const now = new Date()
  const thisMonth = quotes.filter((q) => {
    if (!q.createdAt) return false
    const date = new Date(q.createdAt)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })

  const cards = [
    {
      icon: Users,
      label: messages.stats.totalQuotes,
      value: quotes.length.toString(),
      sub: applyTemplate(messages.stats.thisMonth, { count: String(thisMonth.length) }),
    },
    {
      icon: Clock,
      label: messages.stats.pending,
      value: quotes.filter((q) => q.status === "new").length.toString(),
      sub: messages.stats.awaiting,
    },
    {
      icon: CheckCircle,
      label: messages.stats.confirmed,
      value: confirmed.length.toString(),
      sub: applyTemplate(messages.stats.conversion, { rate: String(conversionRate) }),
    },
    {
      icon: TrendingUp,
      label: messages.stats.confirmedRevenue,
      value: confirmedRevenue > 0 ? `Rs.${confirmedRevenue.toLocaleString("en-IN")}` : messages.emptyValue,
      sub: messages.stats.revenueSub,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((item) => (
        <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <item.icon size={14} className="text-amber-400" />
            <span className="text-slate-400 text-xs">{item.label}</span>
          </div>
          <p className="text-xl font-bold text-white">{item.value}</p>
          <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
        </div>
      ))}
    </div>
  )
}

function FiltersBar({
  filters,
  setFilters,
  cities,
  onExport,
  resultCount,
  messages,
}: {
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  cities: string[]
  onExport: () => void
  resultCount: number
  messages: AdminMessages
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  function setField<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters = filters.source !== "all" || !!filters.city || !!filters.eventDateFrom || !!filters.eventDateTo

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setField("search", e.target.value)}
            placeholder={messages.filters.searchPlaceholder}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setShowAdvanced((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${hasActiveFilters ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"}`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">{messages.filters.filters}</span>
          {hasActiveFilters ? " *" : ""}
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title={messages.csv.exportTitle}
        >
          <Download size={15} />
          <span className="hidden sm:inline">{messages.filters.exportCsv}</span>
        </button>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {(["all", "new", "confirmed", "cancelled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setField("status", status)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${filters.status === status ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
          >
            {statusLabel(status, messages)}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">
          {applyTemplate(messages.filters.resultCount, { count: String(resultCount) })}
        </span>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{messages.filters.source}</label>
            <select
              value={filters.source}
              onChange={(e) => setField("source", e.target.value as Filters["source"])}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">{messages.filters.allSources}</option>
              <option value="calculator">{messages.filters.pricingSource}</option>
              <option value="booking">{messages.filters.bookingSource}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{messages.filters.city}</label>
            <select
              value={filters.city}
              onChange={(e) => setField("city", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">{messages.filters.allCities}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{messages.filters.sortBy}</label>
            <select
              value={filters.sort}
              onChange={(e) => setField("sort", e.target.value as Filters["sort"])}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="newest">{messages.filters.newest}</option>
              <option value="oldest">{messages.filters.oldest}</option>
              <option value="event-date">{messages.filters.eventDate}</option>
              <option value="amount-high">{messages.filters.amountHigh}</option>
              <option value="amount-low">{messages.filters.amountLow}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{messages.filters.eventDateFrom}</label>
            <input
              type="date"
              value={filters.eventDateFrom}
              onChange={(e) => setField("eventDateFrom", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{messages.filters.eventDateTo}</label>
            <input
              type="date"
              value={filters.eventDateTo}
              onChange={(e) => setField("eventDateTo", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, source: "all", city: "", eventDateFrom: "", eventDateTo: "", sort: "newest" }))}
              className="w-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl px-3 py-2 text-sm transition-colors"
            >
              {messages.filters.resetFilters}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function QuoteDetail({ quote, messages, localeTag }: { quote: QuoteRow; messages: AdminMessages; localeTag: string }) {
  return (
    <div className="px-6 pb-6 pt-3 bg-slate-800/30 text-sm space-y-4 border-t border-slate-800">
      <div className="flex flex-wrap gap-3 items-center">
        {quote.customerPhone && (
          <>
            <a
              href={waLink(quote.customerPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              <MessageCircle size={13} /> {messages.quick.whatsapp}
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
            <Calendar size={13} className="text-amber-400" /> {applyTemplate(messages.quick.eventDateLine, { date: quote.date, time: quote.timeSlot ? ` - ${quote.timeSlot}` : "" })}
          </span>
        )}
      </div>

      {quote.events && quote.events.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">{messages.quick.events}</p>
          <div className="space-y-2">
            {quote.events.map((event, idx) => (
              <div key={`${event.name}-${idx}`} className="bg-slate-800 rounded-xl px-4 py-3">
                <div className="flex justify-between">
                  <span className="font-medium text-white text-sm">{event.name}</span>
                  <span className="text-amber-400 text-sm">{fmtRupee(event.price, messages.emptyValue)}</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{event.duration}</p>
                {event.selections?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {event.selections.map((selection, sIdx) => (
                      <li key={`${selection.name}-${sIdx}`} className="text-slate-400 text-xs flex justify-between">
                        <span>{applyTemplate(messages.quick.selectionLine, { name: selection.name, qty: String(selection.qty) })}</span>
                        <span>{fmtRupee(selection.unitPrice * selection.qty, messages.emptyValue)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {quote.globalAddOns && quote.globalAddOns.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">{messages.quick.addOns}</p>
          <div className="flex flex-wrap gap-2">
            {quote.globalAddOns.map((addon, idx) => (
              <span key={`${addon.name}-${idx}`} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg">
                {applyTemplate(messages.quick.addOnLine, { name: addon.name, qty: String(addon.qty), price: fmtRupee(addon.price, messages.emptyValue) })}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-300">
        {quote.service && <span><span className="text-slate-500">{messages.quick.serviceLabel}</span> {quote.service}</span>}
        {quote.budget && <span><span className="text-slate-500">{messages.quick.budgetLabel}</span> {quote.budget}</span>}
        {quote.source && <span><span className="text-slate-500">{messages.quick.sourceLabel}</span> {quote.source}</span>}
        {quote.foundVia && <span><span className="text-slate-500">{messages.quick.foundViaLabel}</span> {quote.foundVia}</span>}
        {!quote.service && !quote.budget && !quote.source && !quote.foundVia && (
          <span className="text-slate-500">{messages.emptyValue}</span>
        )}
      </div>

      {quote.notes && (
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{messages.quick.notes}</p>
          <p className="text-slate-300 bg-slate-800 rounded-xl px-4 py-3 text-xs leading-relaxed">{quote.notes}</p>
        </div>
      )}
    </div>
  )
}

function QuoteItem({
  quote,
  adminKey,
  onStatusChange,
  messages,
  localeTag,
}: {
  quote: QuoteRow
  adminKey: string
  onStatusChange: (id: string, status: QuoteRow["status"]) => void
  messages: AdminMessages
  localeTag: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const StatusIcon = STATUS_ICONS[quote.status] ?? Clock

  async function updateStatus(status: QuoteRow["status"]) {
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
        alert(messages.statusUpdateFail)
      }
    } catch {
      alert(messages.statusUpdateFail)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between px-5 py-4 gap-3">
        <button onClick={() => setExpanded((prev) => !prev)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
          <span className="text-slate-500 hover:text-white transition-colors shrink-0">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>

          <div className="min-w-0">
            <p className="font-semibold text-white truncate text-sm">{quote.customerName ?? messages.unknownCustomer}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-slate-500 text-xs">#{quote.id}</span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-slate-400 text-xs">{fmtDate(quote.createdAt, localeTag, messages.emptyValue)}</span>
              {quote.date && (
                <>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Calendar size={10} /> {applyTemplate(messages.quick.eventDateLine, { date: quote.date, time: "" })}
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
            <span className="text-amber-400 font-semibold text-sm hidden sm:block">{fmtRupee(quote.total, messages.emptyValue)}</span>
          ) : null}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[quote.status]}`}>
            <StatusIcon size={11} />
            {messages.statuses[quote.status]}
          </span>
          <select
            value={quote.status}
            disabled={updating}
            onChange={(e) => updateStatus(e.target.value as QuoteRow["status"])}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 disabled:opacity-50"
          >
            <option value="new">{messages.statuses.new}</option>
            <option value="confirmed">{messages.statuses.confirmed}</option>
            <option value="cancelled">{messages.statuses.cancelled}</option>
          </select>
        </div>
      </div>

      {expanded && <QuoteDetail quote={quote} messages={messages} localeTag={localeTag} />}
    </div>
  )
}

function Dashboard({
  adminKey,
  onLogout,
  messages,
  localeTag,
}: {
  adminKey: string
  onLogout: () => void
  messages: AdminMessages
  localeTag: string
}) {
  const [quotes, setQuotes] = useState<QuoteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    source: "all",
    city: "",
    eventDateFrom: "",
    eventDateTo: "",
    sort: "newest",
  })

  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/quotes", { headers: { "x-admin-key": adminKey } })
      if (!res.ok) throw new Error("load-failed")
      const data = await res.json()
      setQuotes(data.quotes ?? [])
    } catch {
      setError(messages.loadError)
    }
    setLoading(false)
  }, [adminKey, messages.loadError])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  function handleStatusChange(id: string, status: QuoteRow["status"]) {
    setQuotes((prev) => prev.map((quote) => (quote.id === id ? { ...quote, status } : quote)))
  }

  const cities = useMemo(() => {
    const set = new Set(quotes.map((quote) => quote.city).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [quotes])

  const filtered = useMemo(() => {
    const result = quotes.filter((quote) => {
      if (filters.status !== "all" && quote.status !== filters.status) return false
      if (filters.source !== "all" && quote.source !== filters.source) return false
      if (filters.city && quote.city !== filters.city) return false
      if (filters.eventDateFrom && quote.date && quote.date < filters.eventDateFrom) return false
      if (filters.eventDateTo && quote.date && quote.date > filters.eventDateTo) return false

      if (filters.search) {
        const term = filters.search.toLowerCase()
        const searchable = [quote.customerName, quote.customerPhone, quote.customerEmail, quote.city, quote.venue, quote.service, quote.notes]
        if (!searchable.some((value) => value?.toLowerCase().includes(term))) return false
      }

      return true
    })

    return result.sort((a, b) => {
      switch (filters.sort) {
        case "oldest":
          return (a.createdAt ?? "") > (b.createdAt ?? "") ? 1 : -1
        case "event-date":
          return (a.date ?? "") > (b.date ?? "") ? 1 : -1
        case "amount-high":
          return (b.total ?? 0) - (a.total ?? 0)
        case "amount-low":
          return (a.total ?? 0) - (b.total ?? 0)
        default:
          return (a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1
      }
    })
  }, [quotes, filters])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white">{messages.title}</h1>
            <p className="text-slate-400 text-xs">
              {applyTemplate(messages.totalQuotesHeader, { count: String(quotes.length) })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchQuotes}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
              title={messages.refreshTitle}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
              title={messages.signOutTitle}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {!loading && quotes.length > 0 && <StatsBar quotes={quotes} messages={messages} />}

        <FiltersBar
          filters={filters}
          setFilters={setFilters}
          cities={cities}
          onExport={() => exportCSV(filtered, localeTag, messages)}
          resultCount={filtered.length}
          messages={messages}
        />

        {loading && <div className="text-center py-20 text-slate-400">{messages.loadingQuotes}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 text-sm">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            {filters.search || filters.status !== "all" || filters.source !== "all" || filters.city || filters.eventDateFrom
              ? messages.noResults
              : messages.noQuotes}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((quote) => (
              <QuoteItem
                key={quote.id}
                quote={quote}
                adminKey={adminKey}
                onStatusChange={handleStatusChange}
                messages={messages}
                localeTag={localeTag}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminPage() {
  const locale = useCurrentLocale()
  const localeTag = getLocaleTag(locale)
  const messages = getPageMessages(locale).adminPage
  const [adminKey, setAdminKey] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key")
    if (saved) setAdminKey(saved)
  }, [])

  if (!adminKey) {
    return (
      <LoginScreen
        onLogin={(password) => {
          sessionStorage.setItem("admin_key", password)
          setAdminKey(password)
        }}
        messages={messages}
      />
    )
  }

  return (
    <Dashboard
      adminKey={adminKey}
      onLogout={() => {
        sessionStorage.removeItem("admin_key")
        setAdminKey(null)
      }}
      messages={messages}
      localeTag={localeTag}
    />
  )
}
