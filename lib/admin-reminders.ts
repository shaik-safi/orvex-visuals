export const STORED_QUOTE_REMINDER_STATUSES = ["pending", "completed"] as const

export type StoredQuoteReminderStatus = (typeof STORED_QUOTE_REMINDER_STATUSES)[number]

export type QuoteReminderStatus = StoredQuoteReminderStatus | "due"

export const QUOTE_REMINDER_FILTERS = ["all", "due_today", "overdue", "upcoming", "completed"] as const

export type QuoteReminderFilter = (typeof QUOTE_REMINDER_FILTERS)[number]

type ReminderTimestamp = Date | { toDate?: () => Date }

function padDatePart(value: number) {
  return value.toString().padStart(2, "0")
}

export function toDateInputValue(value: Date): string {
  return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`
}

export function isStoredQuoteReminderStatus(value: unknown): value is StoredQuoteReminderStatus {
  return typeof value === "string" && STORED_QUOTE_REMINDER_STATUSES.includes(value as StoredQuoteReminderStatus)
}

export function normalizeStoredQuoteReminderStatus(value: unknown): StoredQuoteReminderStatus | null {
  if (value === "due") return "pending"
  return isStoredQuoteReminderStatus(value) ? value : null
}

export function normalizeReminderDate(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return null

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed
    }

    const parsed = new Date(trimmed)
    return Number.isNaN(parsed.getTime()) ? null : toDateInputValue(parsed)
  }

  if (value instanceof Date) {
    return toDateInputValue(value)
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return toDateInputValue(value.toDate())
  }

  return null
}

function addDays(dateInput: string, days: number): string {
  const [year, month, day] = dateInput.split("-").map(Number)
  const nextDate = new Date(year, (month ?? 1) - 1, day ?? 1)
  nextDate.setDate(nextDate.getDate() + days)
  return toDateInputValue(nextDate)
}

export function getQuoteReminderStatus(
  reminderDate: string | null | undefined,
  reminderStatus: StoredQuoteReminderStatus | null | undefined,
  now = new Date()
): QuoteReminderStatus | null {
  if (!reminderDate) return null
  if (reminderStatus === "completed") return "completed"

  const today = toDateInputValue(now)
  return reminderDate <= today ? "due" : "pending"
}

export function getQuoteReminderFilterBucket(
  reminderDate: string | null | undefined,
  reminderStatus: StoredQuoteReminderStatus | null | undefined,
  now = new Date()
): Exclude<QuoteReminderFilter, "all"> | null {
  if (!reminderDate) return null

  const effectiveStatus = getQuoteReminderStatus(reminderDate, reminderStatus, now)
  if (!effectiveStatus) return null
  if (effectiveStatus === "completed") return "completed"

  const today = toDateInputValue(now)
  if (reminderDate < today) return "overdue"
  if (reminderDate === today) return "due_today"

  const upcomingEnd = addDays(today, 7)
  if (reminderDate <= upcomingEnd) return "upcoming"

  return null
}
