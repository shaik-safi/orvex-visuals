import { NextRequest, NextResponse } from "next/server"

import { adminDb } from "@/lib/firebase-admin"
import { decryptQuotePayload, hashAccessToken } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

type QuoteDocument = {
  status?: string
  createdAt?: Date | { toDate?: () => Date }
  accessTokenHash?: string
  encryptedPayload?: string
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
    if (!data.accessTokenHash || !data.encryptedPayload) {
      return NextResponse.json({ error: "Booking data is invalid" }, { status: 500 })
    }

    if (hashAccessToken(token) !== data.accessTokenHash) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 403 })
    }

    const payload = decryptQuotePayload<QuotePayload>(data.encryptedPayload)
    const createdAt =
      data.createdAt instanceof Date
        ? data.createdAt.toISOString()
        : typeof data.createdAt?.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : null

    return NextResponse.json({
      quote: {
        ...payload,
        status: data.status ?? "new",
        createdAt,
      },
    })
  } catch {
    return NextResponse.json({ error: "Unable to load booking" }, { status: 500 })
  }
}