export interface QuoteEvent {
  name: string
  duration: string
  selections: { name: string; qty: number; unitPrice: number }[]
  price: number
}

export interface QuotePayload {
  source: "calculator" | "booking"
  customerName: string
  customerPhone: string
  customerEmail?: string
  date?: string
  timeSlot?: string
  city?: string
  venue?: string
  events?: QuoteEvent[]
  globalAddOns?: { name: string; qty: number; price: number }[]
  // direct booking-only fields
  service?: string
  budget?: string
  notes?: string
  foundVia?: string
  total?: number
}

export interface SaveQuoteResult {
  quoteId: string
  accessToken: string
}

export async function saveQuote(payload: QuotePayload): Promise<SaveQuoteResult> {
  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.quoteId || !data?.accessToken) {
    throw new Error(data?.error || "Unable to create booking")
  }

  return {
    quoteId: data.quoteId,
    accessToken: data.accessToken,
  }
}
