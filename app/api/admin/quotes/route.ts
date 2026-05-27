import { NextRequest, NextResponse } from "next/server"

import { adminDb } from "@/lib/firebase-admin"
import { decryptQuotePayload } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

function checkAdminAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  const key = request.headers.get("x-admin-key")
  return key === adminPassword
}

type QuoteDocument = {
  status?: string
  createdAt?: Date | { toDate?: () => Date }
  accessTokenHash?: string
  encryptedPayload?: string
}

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const snapshot = await adminDb
      .collection("quotes")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get()

    const quotes = snapshot.docs.map((doc: { id: string; data: () => QuoteDocument }) => {
      const data = doc.data() as QuoteDocument

      const createdAt =
        data.createdAt instanceof Date
          ? data.createdAt.toISOString()
          : typeof data.createdAt?.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : null

      // Decrypt the payload
      let payload: QuotePayload | null = null
      if (data.encryptedPayload) {
        try {
          payload = decryptQuotePayload<QuotePayload>(data.encryptedPayload)
        } catch {
          // quote was saved before encryption was enabled — skip gracefully
          payload = null
        }
      }

      return {
        id: doc.id,
        status: data.status ?? "new",
        createdAt,
        ...(payload ?? {}),
      }
    })

    return NextResponse.json({ quotes })
  } catch {
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}

// Update quote status (new → confirmed / cancelled)
export async function PATCH(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const { id, status } = await request.json()
    if (!id || !["new", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await adminDb.collection("quotes").doc(id).update({ status })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 })
  }
}
