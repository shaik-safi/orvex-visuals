import { NextRequest, NextResponse } from "next/server"

import { ADMIN_API_SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth"
import { adminDb } from "@/lib/firebase-admin"
import { normalizeLocale } from "@/lib/i18n/config"
import { withLocaleHref } from "@/lib/i18n/routing"
import { decryptQuotePayload, generateAccessToken, hashAccessToken } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

function checkAdminAuth(request: NextRequest): boolean {
  const sessionValue = request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  return isValidAdminSession(sessionValue)
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

export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const { id, locale } = await request.json()
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const quoteRef = adminDb.collection("quotes").doc(id)
    const snapshot = await quoteRef.get()

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const data = snapshot.data() as QuoteDocument | undefined
    if (!data?.encryptedPayload) {
      return NextResponse.json({ error: "Quote cannot be shared" }, { status: 409 })
    }

    const accessToken = generateAccessToken()
    await quoteRef.update({ accessTokenHash: hashAccessToken(accessToken) })

    const sharePath = withLocaleHref(`/quote/${id}?token=${encodeURIComponent(accessToken)}`, normalizeLocale(locale))
    const shareUrl = `${request.nextUrl.origin}${sharePath}`

    return NextResponse.json({ sharePath, shareUrl })
  } catch {
    return NextResponse.json({ error: "Failed to generate share link" }, { status: 500 })
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
