import { adminDb } from "@/lib/firebase-admin"
import { guardPublicWriteRequest } from "@/lib/public-write-guard"
import { encryptQuotePayload } from "@/lib/quote-security"

const INQUIRY_MAX_BYTES = 8 * 1024
const INQUIRY_RATE_LIMIT = 5
const INQUIRY_RATE_WINDOW_MS = 10 * 60 * 1000

type InquiryPayload = {
  name: string
  phone: string
  email?: string
  service: string
  date?: string
  message?: string
  source: "contact-form"
}

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return ""
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength)
}

function sanitizeInquiryPayload(input: unknown): InquiryPayload | null {
  if (!input || typeof input !== "object") return null

  const record = input as Record<string, unknown>
  const name = normalizeString(record.name, 80)
  const phone = normalizeString(record.phone, 20).replace(/[^\d+]/g, "")
  const email = normalizeString(record.email, 120)
  const service = normalizeString(record.service, 120)
  const date = normalizeString(record.date, 40)
  const message = normalizeString(record.message, 2000)

  if (name.length < 2 || service.length < 2) return null
  if (!/^\+?\d{10,15}$/.test(phone)) return null
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null

  return {
    name,
    phone,
    email: email || undefined,
    service,
    date: date || undefined,
    message: message || undefined,
    source: "contact-form",
  }
}

function generateInquiryId() {
  return `inq_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`
}

export async function POST(request: Request) {
  if (!adminDb) {
    return Response.json({ error: "Inquiry system not configured" }, { status: 503 })
  }

  try {
    const guardedRequest = await guardPublicWriteRequest(request, {
      routeKey: "inquiries",
      maxBytes: INQUIRY_MAX_BYTES,
      limit: INQUIRY_RATE_LIMIT,
      windowMs: INQUIRY_RATE_WINDOW_MS,
    })

    if (!guardedRequest.ok) {
      return guardedRequest.response
    }

    const body = guardedRequest.body
    const payload = sanitizeInquiryPayload(body)

    if (!payload) {
      return Response.json({ error: "Invalid inquiry details" }, { status: 400 })
    }

    const inquiryId = generateInquiryId()

    await adminDb.collection("inquiries").doc(inquiryId).set({
      status: "new",
      createdAt: new Date(),
      encryptedPayload: encryptQuotePayload(payload),
    })

    return Response.json({ inquiryId })
  } catch {
    return Response.json({ error: "Failed to save inquiry" }, { status: 500 })
  }
}