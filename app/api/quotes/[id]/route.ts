import { NextRequest, NextResponse } from "next/server"
import type { Transaction } from "firebase-admin/firestore"

import { adminDb } from "@/lib/firebase-admin"
import { decryptQuotePayload, hashAccessToken } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

const QUOTE_VIEW_WRITE_COOLDOWN_MS = 5 * 60 * 1000
const QUOTE_VIEW_COUNT_COOLDOWN_MS = 30 * 60 * 1000

type QuoteDocument = {
  status?: string
  createdAt?: Date | { toDate?: () => Date }
  accessTokenHash?: string
  encryptedPayload?: string
  firstViewedAt?: Date | { toDate?: () => Date }
  lastViewedAt?: Date | { toDate?: () => Date }
  viewCount?: number
}

function toDate(value: QuoteDocument["createdAt"] | QuoteDocument["firstViewedAt"] | QuoteDocument["lastViewedAt"]): Date | null {
  if (value instanceof Date) return value
  if (typeof value?.toDate === "function") return value.toDate()
  return null
}

async function recordQuoteView(id: string, viewedAt: Date) {
  if (!adminDb) return

  const quoteRef = adminDb.collection("quotes").doc(id)

  await adminDb.runTransaction(async (transaction: Transaction) => {
    const latestSnapshot = await transaction.get(quoteRef)
    if (!latestSnapshot.exists) return

    const latestData = latestSnapshot.data() as QuoteDocument | undefined
    const firstViewedAt = toDate(latestData?.firstViewedAt)
    const lastViewedAt = toDate(latestData?.lastViewedAt)
    const currentViewCount = typeof latestData?.viewCount === "number" && Number.isFinite(latestData.viewCount)
      ? latestData.viewCount
      : 0

    const shouldSetFirstViewedAt = !firstViewedAt
    const shouldRefreshLastViewedAt =
      !lastViewedAt || viewedAt.getTime() - lastViewedAt.getTime() >= QUOTE_VIEW_WRITE_COOLDOWN_MS
    const shouldIncrementViewCount =
      shouldSetFirstViewedAt ||
      currentViewCount <= 0 ||
      !lastViewedAt ||
      viewedAt.getTime() - lastViewedAt.getTime() >= QUOTE_VIEW_COUNT_COOLDOWN_MS

    if (!shouldSetFirstViewedAt && !shouldRefreshLastViewedAt && !shouldIncrementViewCount) {
      return
    }

    const updates: Record<string, unknown> = {}

    if (shouldSetFirstViewedAt) {
      updates.firstViewedAt = viewedAt
    }

    if (shouldSetFirstViewedAt || shouldRefreshLastViewedAt || shouldIncrementViewCount) {
      updates.lastViewedAt = viewedAt
    }

    if (shouldIncrementViewCount) {
      updates.viewCount = currentViewCount + 1
    }

    transaction.update(quoteRef, updates)
  })
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
    const createdAt = toDate(data.createdAt)?.toISOString() ?? null

    const response = NextResponse.json({
      quote: {
        ...payload,
        createdAt,
      },
    })

    try {
      const viewedAt = new Date()
      await recordQuoteView(id, viewedAt)
    } catch {
      // View tracking should never block quote retrieval.
    }

    return response
  } catch {
    return NextResponse.json({ error: "Unable to load booking" }, { status: 500 })
  }
}