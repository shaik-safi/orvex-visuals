export const QUOTE_PAYMENT_STATUSES = ["unpaid", "partially_paid", "paid"] as const

export type QuotePaymentStatus = (typeof QUOTE_PAYMENT_STATUSES)[number]

export function getQuoteTotalAmount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null
  }

  return Math.floor(value)
}

export function normalizeStoredAmountReceived(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null
  }

  return Math.floor(value)
}

export function normalizeAmountReceivedInput(value: unknown): number | null | undefined {
  if (value == null) return null

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return null

    const parsed = Number(trimmed)
    if (!Number.isFinite(parsed)) return undefined

    return parsed <= 0 ? null : Math.floor(parsed)
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value <= 0 ? null : Math.floor(value)
  }

  return undefined
}

export function getAmountReceived(value: unknown): number {
  return normalizeStoredAmountReceived(value) ?? 0
}

export function getBalanceDue(totalAmount: number | null | undefined, amountReceived: unknown): number | null {
  if (totalAmount == null) return null
  return Math.max(totalAmount - getAmountReceived(amountReceived), 0)
}

export function getQuotePaymentStatus(totalAmount: number | null | undefined, amountReceived: unknown): QuotePaymentStatus | null {
  if (totalAmount == null) return null

  const received = getAmountReceived(amountReceived)
  if (received <= 0) return "unpaid"
  if (received >= totalAmount) return "paid"
  return "partially_paid"
}