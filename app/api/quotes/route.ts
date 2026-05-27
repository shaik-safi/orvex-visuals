import { NextResponse } from "next/server"

import { adminDb } from "@/lib/firebase-admin"
import { encryptQuotePayload, generateAccessToken, generateQuoteId, hashAccessToken } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

function normalizeString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, maxLength)
}

function normalizeSelections(value: unknown): QuotePayload["events"] {
  if (!Array.isArray(value)) return undefined

  const events = value
    .map((event) => {
      if (!event || typeof event !== "object") return null
      const source = event as Record<string, unknown>
      const selections = Array.isArray(source.selections)
        ? source.selections
          .map((selection) => {
            if (!selection || typeof selection !== "object") return null
            const sourceSelection = selection as Record<string, unknown>
            const name = normalizeString(sourceSelection.name, 120)
            const qty = typeof sourceSelection.qty === "number" && Number.isFinite(sourceSelection.qty)
              ? Math.max(0, Math.min(20, Math.floor(sourceSelection.qty)))
              : 0
            const unitPrice = typeof sourceSelection.unitPrice === "number" && Number.isFinite(sourceSelection.unitPrice)
              ? Math.max(0, Math.floor(sourceSelection.unitPrice))
              : 0
            if (!name || qty <= 0) return null
            return { name, qty, unitPrice }
          })
          .filter((selection): selection is { name: string; qty: number; unitPrice: number } => Boolean(selection))
        : []

      const name = normalizeString(source.name, 120)
      const duration = normalizeString(source.duration, 60)
      const price = typeof source.price === "number" && Number.isFinite(source.price)
        ? Math.max(0, Math.floor(source.price))
        : 0

      if (!name || !duration) return null

      return {
        name,
        duration,
        selections,
        price,
      }
    })
    .filter((event): event is NonNullable<QuotePayload["events"]>[number] => Boolean(event))

  return events.length > 0 ? events : undefined
}

function normalizeGlobalAddOns(value: unknown): QuotePayload["globalAddOns"] {
  if (!Array.isArray(value)) return undefined

  const addOns = value
    .map((addOn) => {
      if (!addOn || typeof addOn !== "object") return null
      const source = addOn as Record<string, unknown>
      const name = normalizeString(source.name, 120)
      const qty = typeof source.qty === "number" && Number.isFinite(source.qty)
        ? Math.max(0, Math.min(20, Math.floor(source.qty)))
        : 0
      const price = typeof source.price === "number" && Number.isFinite(source.price)
        ? Math.max(0, Math.floor(source.price))
        : 0
      if (!name || qty <= 0) return null
      return { name, qty, price }
    })
    .filter((addOn): addOn is NonNullable<QuotePayload["globalAddOns"]>[number] => Boolean(addOn))

  return addOns.length > 0 ? addOns : undefined
}

function sanitizeQuotePayload(input: unknown): QuotePayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid quote payload")
  }

  const source = input as Record<string, unknown>
  const quoteSource = source.source === "booking" ? "booking" : source.source === "calculator" ? "calculator" : null
  const customerName = normalizeString(source.customerName, 120)
  const customerPhone = normalizeString(source.customerPhone, 20)

  if (!quoteSource || !customerName || !customerPhone) {
    throw new Error("Missing required quote fields")
  }

  const total = typeof source.total === "number" && Number.isFinite(source.total)
    ? Math.max(0, Math.floor(source.total))
    : undefined

  return {
    source: quoteSource,
    customerName,
    customerPhone,
    customerEmail: normalizeString(source.customerEmail, 160),
    date: normalizeString(source.date, 40),
    timeSlot: normalizeString(source.timeSlot, 80),
    city: normalizeString(source.city, 80),
    venue: normalizeString(source.venue, 160),
    service: normalizeString(source.service, 160),
    budget: normalizeString(source.budget, 80),
    notes: normalizeString(source.notes, 2000),
    foundVia: normalizeString(source.foundVia, 80),
    events: normalizeSelections(source.events),
    globalAddOns: normalizeGlobalAddOns(source.globalAddOns),
    total,
  }
}

export async function POST(request: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: "Booking system not configured" }, { status: 503 })
  }

  try {
    const payload = sanitizeQuotePayload(await request.json())
    const quoteId = generateQuoteId()
    const accessToken = generateAccessToken()

    await adminDb.collection("quotes").doc(quoteId).set({
      status: "new",
      createdAt: new Date(),
      accessTokenHash: hashAccessToken(accessToken),
      encryptedPayload: encryptQuotePayload(payload),
    })

    return NextResponse.json({ quoteId, accessToken })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create booking"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}