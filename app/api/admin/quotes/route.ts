import { NextRequest, NextResponse } from "next/server"

import { ADMIN_API_SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth"
import {
  DEFAULT_QUOTE_PIPELINE_STATUS,
  isQuotePipelineStatus,
  type QuotePipelineStatus,
} from "@/lib/admin-quote-status"
import { normalizeStoredAmountReceived } from "@/lib/admin-payments"
import { normalizeReminderDate, normalizeStoredQuoteReminderStatus, type StoredQuoteReminderStatus } from "@/lib/admin-reminders"
import { adminDb } from "@/lib/firebase-admin"
import { normalizeLocale, parseSupportedLocale, type AppLocale } from "@/lib/i18n/config"
import { withLocaleHref } from "@/lib/i18n/routing"
import { decryptQuotePayload, encryptActiveAccessToken, generateAccessToken, hashAccessToken } from "@/lib/quote-security"
import type { QuotePayload } from "@/lib/save-quote"

function checkAdminAuth(request: NextRequest): boolean {
  const sessionValue = request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  return isValidAdminSession(sessionValue)
}

type QuoteDocument = {
  status?: QuotePipelineStatus
  createdAt?: Date | { toDate?: () => Date }
  accessTokenHash?: string
  activeAccessTokenCiphertext?: string
  activeLinkLocale?: AppLocale | string | null
  activeAccessTokenUpdatedAt?: Date | { toDate?: () => Date } | null
  encryptedPayload?: string
  firstViewedAt?: Date | { toDate?: () => Date }
  lastViewedAt?: Date | { toDate?: () => Date }
  viewCount?: number
  amountReceived?: number | null
  reminderDate?: string | Date | { toDate?: () => Date } | null
  reminderStatus?: StoredQuoteReminderStatus | "due" | null
}

function toIsoString(value: Date | { toDate?: () => Date } | null | undefined): string | null {
  if (value instanceof Date) return value.toISOString()
  if (typeof value?.toDate === "function") return value.toDate().toISOString()
  return null
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

      const createdAt = toIsoString(data.createdAt)
      const firstViewedAt = toIsoString(data.firstViewedAt)
      const lastViewedAt = toIsoString(data.lastViewedAt)
      const viewCount = typeof data.viewCount === "number" && Number.isFinite(data.viewCount) ? data.viewCount : 0
      const amountReceived = normalizeStoredAmountReceived(data.amountReceived)
      const reminderDate = normalizeReminderDate(data.reminderDate)
      const reminderStatus = normalizeStoredQuoteReminderStatus(data.reminderStatus)
      const hasRecoverableActiveLink = typeof data.activeAccessTokenCiphertext === "string" && data.activeAccessTokenCiphertext.length > 0
      const activeLinkLocale = hasRecoverableActiveLink
        ? parseSupportedLocale(typeof data.activeLinkLocale === "string" ? data.activeLinkLocale : null)
        : null
      const activeAccessTokenUpdatedAt = hasRecoverableActiveLink ? toIsoString(data.activeAccessTokenUpdatedAt) : null

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
        status: isQuotePipelineStatus(data.status) ? data.status : DEFAULT_QUOTE_PIPELINE_STATUS,
        createdAt,
        firstViewedAt,
        lastViewedAt,
        viewCount,
        hasRecoverableActiveLink,
        activeLinkLocale,
        activeAccessTokenUpdatedAt,
        amountReceived,
        reminderDate,
        reminderStatus,
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
    const activeLinkLocale = normalizeLocale(locale)
    const activeAccessTokenUpdatedAt = new Date()

    await quoteRef.update({
      accessTokenHash: hashAccessToken(accessToken),
      activeAccessTokenCiphertext: encryptActiveAccessToken(accessToken),
      activeLinkLocale,
      activeAccessTokenUpdatedAt,
    })

    const sharePath = withLocaleHref(`/quote/${id}?token=${encodeURIComponent(accessToken)}`, activeLinkLocale)
    const shareUrl = `${request.nextUrl.origin}${sharePath}`

    return NextResponse.json({
      sharePath,
      shareUrl,
      activeLinkLocale,
      activeAccessTokenUpdatedAt: activeAccessTokenUpdatedAt.toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Failed to generate share link" }, { status: 500 })
  }
}

// Update quote status within the lead pipeline.
export async function PATCH(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const { id, status } = await request.json()
    if (!id || !isQuotePipelineStatus(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await adminDb.collection("quotes").doc(id).update({ status })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 })
  }
}