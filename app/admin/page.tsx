"use client"

import { useState, useEffect, useCallback, useMemo, type Dispatch, type SetStateAction, type FormEvent } from "react"
import {
  getAmountReceived,
  getBalanceDue,
  getQuotePaymentStatus,
  getQuoteTotalAmount,
  type QuotePaymentStatus,
} from "@/lib/admin-payments"
import {
  QUOTE_REMINDER_FILTERS,
  getQuoteReminderFilterBucket,
  getQuoteReminderStatus,
  type QuoteReminderFilter,
  type QuoteReminderStatus,
  type StoredQuoteReminderStatus,
} from "@/lib/admin-reminders"
import {
  QUOTE_PIPELINE_STATUSES,
  type QuotePipelineStatus,
} from "@/lib/admin-quote-status"
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
import { getLocaleTag, type AppLocale } from "@/lib/i18n/config"
import { getPageMessages } from "@/lib/i18n/pages"
import { applyTemplate } from "@/lib/i18n/home"

interface QuoteRow {
  id: string
  status: QuotePipelineStatus
  createdAt: string | null
  firstViewedAt: string | null
  lastViewedAt: string | null
  viewCount: number
  hasRecoverableActiveLink: boolean
  activeLinkLocale: AppLocale | null
  activeAccessTokenUpdatedAt: string | null
  amountReceived: number | null
  reminderDate: string | null
  reminderStatus: StoredQuoteReminderStatus | null
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

interface InternalNote {
  id: string
  body: string
  createdAt: string | null
  updatedAt: string | null
}

type ActiveLinkMetadata = Pick<QuoteRow, "hasRecoverableActiveLink" | "activeLinkLocale" | "activeAccessTokenUpdatedAt">

type StatusFilter = "all" | QuotePipelineStatus

interface Filters {
  search: string
  status: StatusFilter
  reminder: QuoteReminderFilter
  source: "all" | "calculator" | "booking"
  city: string
  eventDateFrom: string
  eventDateTo: string
  sort: "newest" | "oldest" | "event-date" | "amount-high" | "amount-low"
}

const STATUS_FILTER_OPTIONS = ["all", ...QUOTE_PIPELINE_STATUSES] as const

const STATUS_STYLES: Record<QuotePipelineStatus, string> = {
  new: "bg-blue-500/15 text-blue-300",
  contacted: "bg-cyan-500/15 text-cyan-300",
  quote_sent: "bg-amber-500/15 text-amber-300",
  follow_up: "bg-orange-500/15 text-orange-300",
  negotiating: "bg-violet-500/15 text-violet-300",
  confirmed: "bg-green-500/15 text-green-300",
  cancelled: "bg-red-500/15 text-red-300",
}

const STATUS_ICONS: Record<QuotePipelineStatus, typeof Clock> = {
  new: Clock,
  contacted: Phone,
  quote_sent: Mail,
  follow_up: MessageCircle,
  negotiating: TrendingUp,
  confirmed: CheckCircle,
  cancelled: XCircle,
}

const REMINDER_STATUS_STYLES: Record<QuoteReminderStatus, string> = {
  pending: "bg-sky-500/15 text-sky-300",
  due: "bg-rose-500/15 text-rose-300",
  completed: "bg-emerald-500/15 text-emerald-300",
}

const PAYMENT_STATUS_STYLES: Record<QuotePaymentStatus, string> = {
  unpaid: "bg-slate-700 text-slate-300",
  partially_paid: "bg-amber-500/15 text-amber-300",
  paid: "bg-emerald-500/15 text-emerald-300",
}

type AdminMessages = ReturnType<typeof getPageMessages>["adminPage"]

function fmtDate(iso: string | null | undefined, localeTag: string, empty: string) {
  if (!iso) return empty
  return new Date(iso).toLocaleDateString(localeTag, { day: "numeric", month: "short", year: "numeric" })
}

function fmtReminderDate(value: string | null | undefined, localeTag: string, empty: string) {
  if (!value) return empty

  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return empty

  return new Date(year, month - 1, day).toLocaleDateString(localeTag, { day: "numeric", month: "short", year: "numeric" })
}

function fmtDateTime(iso: string | null | undefined, localeTag: string, empty: string) {
  if (!iso) return empty
  return new Date(iso).toLocaleString(localeTag, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function fmtRupee(value: number | undefined, empty: string) {
  if (!value) return empty
  return `₹${value.toLocaleString("en-IN")}`
}

function fmtRupeeAmount(value: number | null | undefined, empty: string) {
  if (value == null || !Number.isFinite(value)) return empty
  return `₹${value.toLocaleString("en-IN")}`
}

function hasQuoteBeenViewed(quote: QuoteRow) {
  return Boolean(quote.firstViewedAt || quote.lastViewedAt || quote.viewCount > 0)
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

function reminderFilterLabel(filter: QuoteReminderFilter, messages: AdminMessages) {
  return messages.reminders.filters[filter]
}

function reminderStatusLabel(status: QuoteReminderStatus, messages: AdminMessages) {
  return messages.reminders.statuses[status]
}

function paymentStatusLabel(status: QuotePaymentStatus, messages: AdminMessages) {
  return messages.payments.statuses[status]
}

function isAppLocale(value: unknown): value is AppLocale {
  return value === "en" || value === "hi"
}

function countQuotesByStatus(quotes: QuoteRow[], status: QuotePipelineStatus) {
  return quotes.filter((quote) => quote.status === status).length
}

function countQuotesByReminderBucket(quotes: QuoteRow[], bucket: Exclude<QuoteReminderFilter, "all">) {
  return quotes.filter((quote) => getQuoteReminderFilterBucket(quote.reminderDate, quote.reminderStatus) === bucket).length
}

function countQuotesByPaymentStatus(quotes: QuoteRow[], status: QuotePaymentStatus) {
  return quotes.filter((quote) => getQuotePaymentStatus(getQuoteTotalAmount(quote.total), quote.amountReceived) === status).length
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
  onLogin: () => void
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

    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      onLogin()
    } else {
      setError(messages.wrongPassword)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-svh bg-slate-950 flex items-center justify-center px-4">
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
  const now = new Date()
  const thisMonth = quotes.filter((q) => {
    if (!q.createdAt) return false
    const date = new Date(q.createdAt)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })

  const newCount = countQuotesByStatus(quotes, "new")
  const followUpCount = countQuotesByStatus(quotes, "follow_up")
  const negotiatingCount = countQuotesByStatus(quotes, "negotiating")
  const confirmedCount = countQuotesByStatus(quotes, "confirmed")
  const cancelledCount = countQuotesByStatus(quotes, "cancelled")
  const dueTodayCount = countQuotesByReminderBucket(quotes, "due_today")
  const overdueCount = countQuotesByReminderBucket(quotes, "overdue")
  const upcomingCount = countQuotesByReminderBucket(quotes, "upcoming")
  const totalRevenueReceived = quotes.reduce((sum, quote) => {
    if (getQuoteTotalAmount(quote.total) == null) return sum
    return sum + getAmountReceived(quote.amountReceived)
  }, 0)
  const totalOutstandingBalance = quotes.reduce((sum, quote) => {
    const balanceDue = getBalanceDue(getQuoteTotalAmount(quote.total), quote.amountReceived)
    return sum + (balanceDue ?? 0)
  }, 0)
  const paidQuotesCount = countQuotesByPaymentStatus(quotes, "paid")
  const partiallyPaidQuotesCount = countQuotesByPaymentStatus(quotes, "partially_paid")
  const unpaidQuotesCount = countQuotesByPaymentStatus(quotes, "unpaid")

  const cards = [
    {
      icon: Users,
      label: messages.stats.totalLeads,
      value: quotes.length.toString(),
      sub: applyTemplate(messages.stats.thisMonth, { count: String(thisMonth.length) }),
    },
    {
      icon: Clock,
      label: messages.stats.new,
      value: newCount.toString(),
      sub: messages.stats.incoming,
    },
    {
      icon: MessageCircle,
      label: messages.stats.followUp,
      value: followUpCount.toString(),
      sub: messages.stats.needsAttention,
    },
    {
      icon: TrendingUp,
      label: messages.stats.negotiating,
      value: negotiatingCount.toString(),
      sub: messages.stats.inDiscussion,
    },
    {
      icon: CheckCircle,
      label: messages.stats.confirmed,
      value: confirmedCount.toString(),
      sub: messages.stats.booked,
    },
    {
      icon: XCircle,
      label: messages.stats.cancelled,
      value: cancelledCount.toString(),
      sub: messages.stats.closedLost,
    },
    {
      icon: Clock,
      label: messages.reminders.stats.dueToday,
      value: dueTodayCount.toString(),
      sub: messages.reminders.stats.dueTodaySub,
    },
    {
      icon: XCircle,
      label: messages.reminders.stats.overdue,
      value: overdueCount.toString(),
      sub: messages.reminders.stats.overdueSub,
    },
    {
      icon: Calendar,
      label: messages.reminders.stats.upcoming,
      value: upcomingCount.toString(),
      sub: messages.reminders.stats.upcomingSub,
    },
    {
      icon: IndianRupee,
      label: messages.payments.stats.revenueReceived,
      value: fmtRupeeAmount(totalRevenueReceived, messages.emptyValue),
      sub: messages.payments.stats.revenueReceivedSub,
    },
    {
      icon: IndianRupee,
      label: messages.payments.stats.outstandingBalance,
      value: fmtRupeeAmount(totalOutstandingBalance, messages.emptyValue),
      sub: messages.payments.stats.outstandingBalanceSub,
    },
    {
      icon: CheckCircle,
      label: messages.payments.stats.paidQuotes,
      value: paidQuotesCount.toString(),
      sub: messages.payments.stats.paidQuotesSub,
    },
    {
      icon: TrendingUp,
      label: messages.payments.stats.partiallyPaidQuotes,
      value: partiallyPaidQuotesCount.toString(),
      sub: messages.payments.stats.partiallyPaidQuotesSub,
    },
    {
      icon: Clock,
      label: messages.payments.stats.unpaidQuotes,
      value: unpaidQuotesCount.toString(),
      sub: messages.payments.stats.unpaidQuotesSub,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-3">
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
        {STATUS_FILTER_OPTIONS.map((status) => (
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

      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-[11px] uppercase tracking-wide text-slate-500">{messages.reminders.filters.label}</span>
        {QUOTE_REMINDER_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setField("reminder", filter)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filters.reminder === filter ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
          >
            {reminderFilterLabel(filter, messages)}
          </button>
        ))}
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

function QuoteDetail({
  quote,
  onActiveLinkChange,
  onPaymentChange,
  onReminderChange,
  messages,
  localeTag,
}: {
  quote: QuoteRow
  onActiveLinkChange: (id: string, link: ActiveLinkMetadata) => void
  onPaymentChange: (id: string, payment: Pick<QuoteRow, "amountReceived">) => void
  onReminderChange: (id: string, reminder: Pick<QuoteRow, "reminderDate" | "reminderStatus">) => void
  messages: AdminMessages
  localeTag: string
}) {
  const locale = useCurrentLocale()
  const [shareUrl, setShareUrl] = useState("")
  const [loadingActiveShareLink, setLoadingActiveShareLink] = useState(false)
  const [generatingShareLink, setGeneratingShareLink] = useState(false)
  const [copiedShareLink, setCopiedShareLink] = useState(false)
  const [shareLinkError, setShareLinkError] = useState("")
  const [shareLinkLegacy, setShareLinkLegacy] = useState(!quote.hasRecoverableActiveLink)
  const [shareLinkUpdatedAt, setShareLinkUpdatedAt] = useState<string | null>(quote.activeAccessTokenUpdatedAt)
  const [amountReceivedInput, setAmountReceivedInput] = useState(quote.amountReceived != null ? String(quote.amountReceived) : "")
  const [updatingPayment, setUpdatingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [reminderDateInput, setReminderDateInput] = useState(quote.reminderDate ?? "")
  const [updatingReminder, setUpdatingReminder] = useState(false)
  const [reminderError, setReminderError] = useState("")
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([])
  const [internalNotesLoading, setInternalNotesLoading] = useState(true)
  const [internalNotesError, setInternalNotesError] = useState("")
  const [newInternalNote, setNewInternalNote] = useState("")
  const [savingInternalNote, setSavingInternalNote] = useState(false)
  const viewed = hasQuoteBeenViewed(quote)
  const totalAmount = getQuoteTotalAmount(quote.total)
  const amountReceived = getAmountReceived(quote.amountReceived)
  const balanceDue = getBalanceDue(totalAmount, quote.amountReceived)
  const paymentStatus = getQuotePaymentStatus(totalAmount, quote.amountReceived)
  const reminderStatus = getQuoteReminderStatus(quote.reminderDate, quote.reminderStatus)

  useEffect(() => {
    setAmountReceivedInput(quote.amountReceived != null ? String(quote.amountReceived) : "")
    setPaymentError("")
  }, [quote.id, quote.amountReceived])

  useEffect(() => {
    setReminderDateInput(quote.reminderDate ?? "")
    setReminderError("")
  }, [quote.id, quote.reminderDate])

  useEffect(() => {
    setShareUrl("")
    setCopiedShareLink(false)
    setShareLinkError("")
    setShareLinkLegacy(!quote.hasRecoverableActiveLink)
    setShareLinkUpdatedAt(quote.activeAccessTokenUpdatedAt)
  }, [quote.id, quote.hasRecoverableActiveLink, quote.activeAccessTokenUpdatedAt])

  useEffect(() => {
    let isMounted = true

    async function loadInternalNotes() {
      setInternalNotesLoading(true)
      setInternalNotesError("")

      try {
        const response = await fetch(`/api/admin/quotes/${quote.id}/notes`, { cache: "no-store" })
        const data = await response.json().catch(() => null)

        if (!response.ok || !Array.isArray(data?.notes)) {
          throw new Error("load-failed")
        }

        if (!isMounted) return

        setInternalNotes(data.notes as InternalNote[])
      } catch {
        if (isMounted) {
          setInternalNotesError(messages.internalNotes.loadFail)
        }
      } finally {
        if (isMounted) {
          setInternalNotesLoading(false)
        }
      }
    }

    loadInternalNotes()

    return () => {
      isMounted = false
    }
  }, [quote.id, messages.internalNotes.loadFail])

  async function loadActiveShareLink() {
    if (!quote.hasRecoverableActiveLink && !shareUrl) return

    setLoadingActiveShareLink(true)
    setCopiedShareLink(false)
    setShareLinkError("")

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/link`, { cache: "no-store" })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error("load-failed")
      }

      if (data?.recoverable && typeof data?.shareUrl === "string") {
        const activeLinkLocale = isAppLocale(data?.activeLinkLocale) ? data.activeLinkLocale : null
        const activeAccessTokenUpdatedAt = typeof data?.activeAccessTokenUpdatedAt === "string" ? data.activeAccessTokenUpdatedAt : null

        setShareUrl(data.shareUrl)
        setShareLinkLegacy(false)
        setShareLinkUpdatedAt(activeAccessTokenUpdatedAt)
        onActiveLinkChange(quote.id, {
          hasRecoverableActiveLink: true,
          activeLinkLocale,
          activeAccessTokenUpdatedAt,
        })
        return
      }

      if (data?.legacy) {
        setShareUrl("")
        setShareLinkLegacy(true)
        setShareLinkUpdatedAt(null)
        onActiveLinkChange(quote.id, {
          hasRecoverableActiveLink: false,
          activeLinkLocale: null,
          activeAccessTokenUpdatedAt: null,
        })
        return
      }

      throw new Error("load-failed")
    } catch {
      setShareLinkError(messages.shareLink.loadFail)
    } finally {
      setLoadingActiveShareLink(false)
    }
  }

  async function generateShareLink() {
    setGeneratingShareLink(true)
    setCopiedShareLink(false)
    setShareLinkError("")

    try {
      const response = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: quote.id, locale }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || typeof data?.shareUrl !== "string") {
        alert(messages.shareLink.generateFail)
        return
      }

      const activeLinkLocale = isAppLocale(data?.activeLinkLocale) ? data.activeLinkLocale : locale
      const activeAccessTokenUpdatedAt = typeof data?.activeAccessTokenUpdatedAt === "string" ? data.activeAccessTokenUpdatedAt : null

      setShareUrl(data.shareUrl)
      setShareLinkLegacy(false)
      setShareLinkUpdatedAt(activeAccessTokenUpdatedAt)
      onActiveLinkChange(quote.id, {
        hasRecoverableActiveLink: true,
        activeLinkLocale,
        activeAccessTokenUpdatedAt,
      })
    } catch {
      alert(messages.shareLink.generateFail)
    } finally {
      setGeneratingShareLink(false)
    }
  }

  async function copyShareLink() {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedShareLink(true)
      window.setTimeout(() => setCopiedShareLink(false), 2000)
    } catch {
      alert(messages.shareLink.copyFail)
    }
  }

  async function handlePaymentSubmit(event: FormEvent) {
    event.preventDefault()
    if (totalAmount == null) return

    setUpdatingPayment(true)
    setPaymentError("")

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountReceived: amountReceivedInput }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error("payment-failed")
      }

      const nextAmountReceived = typeof data?.amountReceived === "number" && Number.isFinite(data.amountReceived)
        ? Math.floor(data.amountReceived)
        : null

      onPaymentChange(quote.id, { amountReceived: nextAmountReceived })
      setAmountReceivedInput(nextAmountReceived != null ? String(nextAmountReceived) : "")
    } catch {
      setPaymentError(messages.payments.updateFail)
    } finally {
      setUpdatingPayment(false)
    }
  }

  async function updateReminder(action: "set" | "complete" | "remove") {
    setUpdatingReminder(true)
    setReminderError("")

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/reminder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "set" ? { action, reminderDate: reminderDateInput } : { action }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error("update-failed")
      }

      const nextReminderDate = typeof data?.reminderDate === "string" ? data.reminderDate : null
      const nextReminderStatus = data?.reminderStatus === "pending" || data?.reminderStatus === "completed"
        ? data.reminderStatus as StoredQuoteReminderStatus
        : null

      onReminderChange(quote.id, {
        reminderDate: nextReminderDate,
        reminderStatus: nextReminderStatus,
      })
      setReminderDateInput(nextReminderDate ?? "")
    } catch {
      setReminderError(
        action === "complete"
          ? messages.reminders.completeFail
          : action === "remove"
            ? messages.reminders.removeFail
            : messages.reminders.updateFail
      )
    } finally {
      setUpdatingReminder(false)
    }
  }

  async function handleReminderSubmit(event: FormEvent) {
    event.preventDefault()
    if (!reminderDateInput) return
    await updateReminder("set")
  }

  async function handleAddInternalNote(event: FormEvent) {
    event.preventDefault()

    const body = newInternalNote.trim()
    if (!body) return

    setSavingInternalNote(true)
    setInternalNotesError("")

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.note) {
        throw new Error("save-failed")
      }

      setInternalNotes((prev) => [data.note as InternalNote, ...prev])
      setNewInternalNote("")
    } catch {
      setInternalNotesError(messages.internalNotes.saveFail)
    } finally {
      setSavingInternalNote(false)
    }
  }

  const canViewActiveLink = quote.hasRecoverableActiveLink || Boolean(shareUrl)
  const shareLinkMessage = shareUrl
    ? shareUrl
    : shareLinkError
      ? shareLinkError
      : shareLinkLegacy
        ? messages.shareLink.legacyUnavailable
        : messages.shareLink.empty
  const shareLinkMessageClass = shareUrl
    ? "text-slate-400"
    : shareLinkError
      ? "text-red-400"
      : shareLinkLegacy
        ? "text-amber-400"
        : "text-slate-600"

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

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
        <div>
          <p className="text-slate-200 text-xs font-semibold uppercase tracking-wide">{messages.shareLink.title}</p>
          <p className="text-slate-500 text-xs mt-1">{messages.shareLink.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadActiveShareLink}
            disabled={!canViewActiveLink || loadingActiveShareLink || generatingShareLink}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
          >
            {loadingActiveShareLink ? messages.shareLink.loading : messages.shareLink.view}
          </button>

          <button
            type="button"
            onClick={generateShareLink}
            disabled={generatingShareLink || loadingActiveShareLink}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {generatingShareLink ? messages.shareLink.generating : messages.shareLink.regenerate}
          </button>

          <button
            type="button"
            onClick={copyShareLink}
            disabled={!shareUrl}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
          >
            {copiedShareLink ? messages.shareLink.copied : messages.shareLink.copy}
          </button>

          {shareUrl ? (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {messages.shareLink.open}
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-50 transition-colors"
            >
              {messages.shareLink.open}
            </button>
          )}
        </div>

        <p className={`text-xs break-all ${shareLinkMessageClass}`}>
          {shareLinkMessage}
        </p>

        {shareLinkUpdatedAt ? (
          <p className="text-[11px] text-slate-500">
            {messages.shareLink.updatedAt}: {fmtDateTime(shareLinkUpdatedAt, localeTag, messages.emptyValue)}
          </p>
        ) : null}

        <p className="text-[11px] text-amber-400">{messages.shareLink.replacementNotice}</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
        <div>
          <p className="text-slate-200 text-xs font-semibold uppercase tracking-wide">{messages.viewTracking.title}</p>
          <p className="text-slate-500 text-xs mt-1">{messages.viewTracking.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-slate-800 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.viewTracking.status}</p>
            <p className={`mt-1 inline-flex items-center gap-1.5 text-sm font-medium ${viewed ? "text-emerald-300" : "text-slate-300"}`}>
              {viewed ? <Eye size={14} /> : <EyeOff size={14} />}
              {viewed ? messages.viewTracking.viewed : messages.viewTracking.notViewed}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.viewTracking.firstViewed}</p>
            <p className="mt-1 text-sm text-slate-300">{fmtDateTime(quote.firstViewedAt, localeTag, messages.emptyValue)}</p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.viewTracking.lastViewed}</p>
            <p className="mt-1 text-sm text-slate-300">{fmtDateTime(quote.lastViewedAt, localeTag, messages.emptyValue)}</p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.viewTracking.viewCount}</p>
            <p className="mt-1 text-sm text-slate-300">{quote.viewCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4">
        <div>
          <p className="text-slate-200 text-xs font-semibold uppercase tracking-wide">{messages.payments.title}</p>
          <p className="text-slate-500 text-xs mt-1">{messages.payments.description}</p>
        </div>

        {totalAmount != null ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-slate-800 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.payments.totalAmount}</p>
                <p className="mt-1 text-sm text-slate-300">{fmtRupeeAmount(totalAmount, messages.emptyValue)}</p>
              </div>

              <div className="rounded-xl bg-slate-800 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.payments.amountReceived}</p>
                <p className="mt-1 text-sm text-slate-300">{fmtRupeeAmount(amountReceived, messages.emptyValue)}</p>
              </div>

              <div className="rounded-xl bg-slate-800 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.payments.balanceDue}</p>
                <p className="mt-1 text-sm text-slate-300">{fmtRupeeAmount(balanceDue, messages.emptyValue)}</p>
              </div>

              <div className="rounded-xl bg-slate-800 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.payments.status}</p>
                {paymentStatus ? (
                  <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${PAYMENT_STATUS_STYLES[paymentStatus]}`}>
                    {paymentStatusLabel(paymentStatus, messages)}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-slate-300">{messages.payments.unavailable}</p>
                )}
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">{messages.payments.amountReceived}</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={amountReceivedInput}
                  onChange={(e) => setAmountReceivedInput(e.target.value)}
                  placeholder={messages.payments.amountReceivedPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPayment}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                {updatingPayment ? messages.payments.saving : messages.payments.save}
              </button>
            </form>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-sm text-slate-400">
            {messages.payments.unavailable}
          </div>
        )}

        {paymentError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {paymentError}
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4">
        <div>
          <p className="text-slate-200 text-xs font-semibold uppercase tracking-wide">{messages.reminders.title}</p>
          <p className="text-slate-500 text-xs mt-1">{messages.reminders.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-800 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.reminders.date}</p>
            <p className="mt-1 text-sm text-slate-300">{fmtReminderDate(quote.reminderDate, localeTag, messages.emptyValue)}</p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{messages.reminders.status}</p>
            {reminderStatus ? (
              <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${REMINDER_STATUS_STYLES[reminderStatus]}`}>
                {reminderStatusLabel(reminderStatus, messages)}
              </span>
            ) : (
              <p className="mt-1 text-sm text-slate-300">{messages.reminders.none}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleReminderSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{messages.reminders.date}</label>
            <input
              type="date"
              value={reminderDateInput}
              onChange={(e) => setReminderDateInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={updatingReminder || !reminderDateInput}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {updatingReminder ? messages.reminders.saving : quote.reminderDate ? messages.reminders.update : messages.reminders.set}
            </button>

            <button
              type="button"
              disabled={updatingReminder || !quote.reminderDate || quote.reminderStatus === "completed"}
              onClick={() => updateReminder("complete")}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
            >
              {messages.reminders.complete}
            </button>

            <button
              type="button"
              disabled={updatingReminder || !quote.reminderDate}
              onClick={() => updateReminder("remove")}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
            >
              {messages.reminders.remove}
            </button>
          </div>
        </form>

        {reminderError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {reminderError}
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-slate-200 text-xs font-semibold uppercase tracking-wide">{messages.internalNotes.title}</p>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-amber-400">{messages.internalNotes.adminOnly}</span>
          </div>
          <p className="text-slate-500 text-xs mt-1">{messages.internalNotes.description}</p>
        </div>

        <form onSubmit={handleAddInternalNote} className="space-y-3">
          <textarea
            value={newInternalNote}
            onChange={(e) => setNewInternalNote(e.target.value)}
            placeholder={messages.internalNotes.placeholder}
            rows={3}
            maxLength={2000}
            disabled={internalNotesLoading}
            className="w-full resize-y bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">{messages.internalNotes.newestFirst}</p>
            <button
              type="submit"
              disabled={internalNotesLoading || savingInternalNote || !newInternalNote.trim()}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {savingInternalNote ? messages.internalNotes.saving : messages.internalNotes.add}
            </button>
          </div>
        </form>

        {internalNotesError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {internalNotesError}
          </div>
        )}

        {internalNotesLoading ? (
          <div className="rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-400">{messages.internalNotes.loading}</div>
        ) : internalNotes.length > 0 ? (
          <div className="space-y-3">
            {internalNotes.map((note) => {
              const wasUpdated = Boolean(note.updatedAt && note.updatedAt !== note.createdAt)

              return (
                <div key={note.id} className="rounded-xl bg-slate-800 px-4 py-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>{messages.internalNotes.createdAt}: {fmtDateTime(note.createdAt, localeTag, messages.emptyValue)}</span>
                    {wasUpdated ? <span>{messages.internalNotes.updatedAt}: {fmtDateTime(note.updatedAt, localeTag, messages.emptyValue)}</span> : null}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{note.body}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-sm text-slate-400">
            {messages.internalNotes.empty}
          </div>
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
  onStatusChange,
  onActiveLinkChange,
  onPaymentChange,
  onReminderChange,
  messages,
  localeTag,
}: {
  quote: QuoteRow
  onStatusChange: (id: string, status: QuoteRow["status"]) => void
  onActiveLinkChange: (id: string, link: ActiveLinkMetadata) => void
  onPaymentChange: (id: string, payment: Pick<QuoteRow, "amountReceived">) => void
  onReminderChange: (id: string, reminder: Pick<QuoteRow, "reminderDate" | "reminderStatus">) => void
  messages: AdminMessages
  localeTag: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const StatusIcon = STATUS_ICONS[quote.status] ?? Clock
  const viewed = hasQuoteBeenViewed(quote)

  async function updateStatus(status: QuoteRow["status"]) {
    setUpdating(true)
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${viewed ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700 text-slate-300"}`}>
            {viewed ? <Eye size={11} /> : <EyeOff size={11} />}
            {viewed ? messages.viewTracking.viewed : messages.viewTracking.notViewed}
          </span>
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
            {QUOTE_PIPELINE_STATUSES.map((status) => (
              <option key={status} value={status}>{messages.statuses[status]}</option>
            ))}
          </select>
        </div>
      </div>

      {expanded && <QuoteDetail quote={quote} onActiveLinkChange={onActiveLinkChange} onPaymentChange={onPaymentChange} onReminderChange={onReminderChange} messages={messages} localeTag={localeTag} />}
    </div>
  )
}

function Dashboard({
  onLogout,
  messages,
  localeTag,
}: {
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
    reminder: "all",
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
      const res = await fetch("/api/admin/quotes", { cache: "no-store" })
      if (!res.ok) throw new Error("load-failed")
      const data = await res.json()
      setQuotes(data.quotes ?? [])
    } catch {
      setError(messages.loadError)
    }
    setLoading(false)
  }, [messages.loadError])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  function handleStatusChange(id: string, status: QuoteRow["status"]) {
    setQuotes((prev) => prev.map((quote) => (quote.id === id ? { ...quote, status } : quote)))
  }

  function handlePaymentChange(id: string, payment: Pick<QuoteRow, "amountReceived">) {
    setQuotes((prev) => prev.map((quote) => (quote.id === id ? { ...quote, ...payment } : quote)))
  }

  function handleActiveLinkChange(id: string, link: ActiveLinkMetadata) {
    setQuotes((prev) => prev.map((quote) => (quote.id === id ? { ...quote, ...link } : quote)))
  }

  function handleReminderChange(id: string, reminder: Pick<QuoteRow, "reminderDate" | "reminderStatus">) {
    setQuotes((prev) => prev.map((quote) => (quote.id === id ? { ...quote, ...reminder } : quote)))
  }

  const cities = useMemo(() => {
    const set = new Set(quotes.map((quote) => quote.city).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [quotes])

  const filtered = useMemo(() => {
    const result = quotes.filter((quote) => {
      if (filters.status !== "all" && quote.status !== filters.status) return false
      if (filters.reminder !== "all" && getQuoteReminderFilterBucket(quote.reminderDate, quote.reminderStatus) !== filters.reminder) return false
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
    <div className="min-h-svh bg-slate-950 text-white">
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
            {filters.search || filters.status !== "all" || filters.reminder !== "all" || filters.source !== "all" || filters.city || filters.eventDateFrom || filters.eventDateTo
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
                onStatusChange={handleStatusChange}
                onActiveLinkChange={handleActiveLinkChange}
                onPaymentChange={handlePaymentChange}
                onReminderChange={handleReminderChange}
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" })
        if (!response.ok) {
          if (isMounted) setIsAuthenticated(false)
          return
        }

        const data = await response.json()
        if (isMounted) setIsAuthenticated(Boolean(data.authenticated))
      } catch {
        if (isMounted) setIsAuthenticated(false)
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-svh bg-slate-950 flex items-center justify-center px-4">
        <p className="text-sm text-slate-400">{messages.checking}</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={() => setIsAuthenticated(true)}
        messages={messages}
      />
    )
  }

  return (
    <Dashboard
      onLogout={() => {
        fetch("/api/admin/session", { method: "DELETE" }).finally(() => {
          setIsAuthenticated(false)
        })
      }}
      messages={messages}
      localeTag={localeTag}
    />
  )
}