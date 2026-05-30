import { NextRequest, NextResponse } from "next/server"

import { ADMIN_API_SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth"
import { adminDb } from "@/lib/firebase-admin"
import { DEFAULT_LOCALE, parseSupportedLocale, type AppLocale } from "@/lib/i18n/config"
import { withLocaleHref } from "@/lib/i18n/routing"
import { decryptActiveAccessToken, hashAccessToken } from "@/lib/quote-security"

type QuoteDocument = {
  accessTokenHash?: string
  encryptedPayload?: string
  activeAccessTokenCiphertext?: string
  activeLinkLocale?: AppLocale | string | null
  activeAccessTokenUpdatedAt?: Date | { toDate?: () => Date } | null
}

function checkAdminAuth(request: NextRequest): boolean {
  const sessionValue = request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  return isValidAdminSession(sessionValue)
}

function toIsoString(value: Date | { toDate?: () => Date } | null | undefined): string | null {
  if (value instanceof Date) return value.toISOString()
  if (typeof value?.toDate === "function") return value.toDate().toISOString()
  return null
}

export async function GET(
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

    const quoteRef = adminDb.collection("quotes").doc(id)
    const snapshot = await quoteRef.get()

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const quote = snapshot.data() as QuoteDocument | undefined
    if (!quote?.accessTokenHash || !quote.encryptedPayload) {
      return NextResponse.json({ error: "Quote cannot be shared" }, { status: 409 })
    }

    if (!quote.activeAccessTokenCiphertext) {
      return NextResponse.json({
        recoverable: false,
        legacy: true,
        activeLinkLocale: null,
        activeAccessTokenUpdatedAt: null,
      })
    }

    const accessToken = decryptActiveAccessToken(quote.activeAccessTokenCiphertext)
    if (hashAccessToken(accessToken) !== quote.accessTokenHash) {
      return NextResponse.json({ error: "Active link unavailable for this quote" }, { status: 409 })
    }

    const activeLinkLocale = parseSupportedLocale(typeof quote.activeLinkLocale === "string" ? quote.activeLinkLocale : null) ?? DEFAULT_LOCALE
    const sharePath = withLocaleHref(`/quote/${id}?token=${encodeURIComponent(accessToken)}`, activeLinkLocale)
    const shareUrl = `${request.nextUrl.origin}${sharePath}`

    return NextResponse.json({
      recoverable: true,
      legacy: false,
      sharePath,
      shareUrl,
      activeLinkLocale,
      activeAccessTokenUpdatedAt: toIsoString(quote.activeAccessTokenUpdatedAt),
    })
  } catch {
    return NextResponse.json({ error: "Failed to load active link" }, { status: 500 })
  }
}