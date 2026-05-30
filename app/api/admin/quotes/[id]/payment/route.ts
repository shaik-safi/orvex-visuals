import { NextRequest, NextResponse } from "next/server"

import { ADMIN_API_SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth"
import { getQuoteTotalAmount, normalizeAmountReceivedInput } from "@/lib/admin-payments"
import { adminDb } from "@/lib/firebase-admin"
import { decryptQuotePayload } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

type QuoteDocument = {
  encryptedPayload?: string
  amountReceived?: number | null
}

type PaymentRequestBody = {
  amountReceived?: string | number | null
}

function checkAdminAuth(request: NextRequest): boolean {
  const sessionValue = request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  return isValidAdminSession(sessionValue)
}

function getQuoteTotalFromDocument(data: QuoteDocument | undefined): number | null {
  if (!data?.encryptedPayload) return null

  try {
    const payload = decryptQuotePayload<QuotePayload>(data.encryptedPayload)
    return getQuoteTotalAmount(payload.total)
  } catch {
    return null
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const payload = await request.json().catch(() => null) as PaymentRequestBody | null
    const normalizedAmountReceived = normalizeAmountReceivedInput(payload?.amountReceived)
    if (typeof normalizedAmountReceived === "undefined") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const quoteRef = adminDb.collection("quotes").doc(id)
    const snapshot = await quoteRef.get()
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const quote = snapshot.data() as QuoteDocument | undefined
    const totalAmount = getQuoteTotalFromDocument(quote)
    if (totalAmount == null) {
      return NextResponse.json({ error: "Payment tracking unavailable for this quote" }, { status: 409 })
    }

    await quoteRef.update({
      amountReceived: normalizedAmountReceived,
    })

    return NextResponse.json({
      amountReceived: normalizedAmountReceived,
    })
  } catch {
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}