import { NextRequest, NextResponse } from "next/server"

import { adminDb } from "@/lib/firebase-admin"
import { decryptQuotePayload, hashAccessToken } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

// type QuoteDocument = {
//   status?: string
//   createdAt?: Date | { toDate?: () => Date }
//   accessTokenHash?: string
//   encryptedPayload?: string
// }
type QuoteDocument = {
  status?: string
  createdAt?: Date | { toDate?: () => Date }
  accessTokenHash?: string

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

  events?: unknown[]
  globalAddOns?: unknown[]

  total?: number
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!adminDb) {
    return NextResponse.json({ error: "Booking system not configured" }, { status: 503 })
  }

  const token = request.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Missing access token" }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const snapshot = await adminDb.collection("quotes").doc(id).get()

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const data = snapshot.data() as QuoteDocument
    // if (!data.accessTokenHash || !data.encryptedPayload) {
    //   return NextResponse.json({ error: "Booking data is invalid" }, { status: 500 })
    // }
    if (!data.accessTokenHash) {
      return NextResponse.json({ error: "Booking data is invalid" }, { status: 500 })
    }

    if (hashAccessToken(token) !== data.accessTokenHash) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 403 })
    }

    // const payload = decryptQuotePayload<QuotePayload>(data.encryptedPayload)
    const createdAt =
      data.createdAt instanceof Date
        ? data.createdAt.toISOString()
        : typeof data.createdAt?.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : null

    // return NextResponse.json({
    //   quote: {
    //     ...payload,
    //     status: data.status ?? "new",
    //     createdAt,
    //   },
    // })
    return NextResponse.json({
        quote: {
          source: data.source ?? "",

          customerName: data.customerName ?? "",
          customerPhone: data.customerPhone ?? "",
          customerEmail: data.customerEmail ?? "",

          date: data.date ?? "",
          timeSlot: data.timeSlot ?? "",

          city: data.city ?? "",
          venue: data.venue ?? "",

          service: data.service ?? "",
          budget: data.budget ?? "",

          notes: data.notes ?? "",
          foundVia: data.foundVia ?? "",

          events: data.events ?? [],
          globalAddOns: data.globalAddOns ?? [],

          total: data.total ?? 0,

          status: data.status ?? "new",
          createdAt,
        },
      })
  } catch {
    return NextResponse.json({ error: "Unable to load booking" }, { status: 500 })
  }
}