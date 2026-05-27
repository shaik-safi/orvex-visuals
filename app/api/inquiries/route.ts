export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { encryptQuotePayload } from "@/lib/quote-security"

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
    return NextResponse.json({ error: "Inquiry system not configured" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const payload = sanitizeInquiryPayload(body)

    if (!payload) {
      return NextResponse.json({ error: "Invalid inquiry details" }, { status: 400 })
    }

    const inquiryId = generateInquiryId()

    await adminDb.collection("inquiries").doc(inquiryId).set({
      status: "new",
      createdAt: new Date(),
      encryptedPayload: encryptQuotePayload(payload),
    })

    return NextResponse.json({ inquiryId })
  } catch {
    return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 })
  }
}

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: "Database not initialized" }, { status: 500 })
  }

  try {
    const snapshot = await adminDb.collection("inquiries").get()
    // ... rest of your data fetching code ...
    return NextResponse.json({ success: true }) 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occured"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}