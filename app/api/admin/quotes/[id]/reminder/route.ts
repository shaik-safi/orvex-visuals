import { NextRequest, NextResponse } from "next/server"

import { ADMIN_API_SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth"
import { normalizeReminderDate, type StoredQuoteReminderStatus } from "@/lib/admin-reminders"
import { adminDb } from "@/lib/firebase-admin"

type QuoteDocument = {
  reminderDate?: string | Date | { toDate?: () => Date } | null
  reminderStatus?: StoredQuoteReminderStatus | "due" | null
}

type ReminderRequestBody = {
  action?: "set" | "complete" | "remove"
  reminderDate?: string | null
}

function checkAdminAuth(request: NextRequest): boolean {
  const sessionValue = request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  return isValidAdminSession(sessionValue)
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

    const payload = await request.json().catch(() => null) as ReminderRequestBody | null
    const action = payload?.action

    if (!action) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const quoteRef = adminDb.collection("quotes").doc(id)
    const snapshot = await quoteRef.get()

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const quote = snapshot.data() as QuoteDocument | undefined

    if (action === "set") {
      const reminderDate = normalizeReminderDate(payload?.reminderDate)
      if (!reminderDate) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
      }

      await quoteRef.update({
        reminderDate,
        reminderStatus: "pending",
      })

      return NextResponse.json({
        reminderDate,
        reminderStatus: "pending",
      })
    }

    const existingReminderDate = normalizeReminderDate(quote?.reminderDate)

    if (!existingReminderDate) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 409 })
    }

    if (action === "complete") {
      await quoteRef.update({
        reminderDate: existingReminderDate,
        reminderStatus: "completed",
      })

      return NextResponse.json({
        reminderDate: existingReminderDate,
        reminderStatus: "completed",
      })
    }

    if (action === "remove") {
      await quoteRef.update({
        reminderDate: null,
        reminderStatus: null,
      })

      return NextResponse.json({
        reminderDate: null,
        reminderStatus: null,
      })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 })
  }
}