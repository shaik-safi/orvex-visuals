import { NextRequest, NextResponse } from "next/server"

import { ADMIN_API_SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth"
import { adminDb } from "@/lib/firebase-admin"

const INTERNAL_NOTES_COLLECTION_NAME = "internalNotes"
const INTERNAL_NOTE_MAX_LENGTH = 2000

type NoteTimestamp = Date | { toDate?: () => Date }

type InternalNoteDocument = {
  id?: string
  body?: string
  createdAt?: NoteTimestamp
  updatedAt?: NoteTimestamp
}

function checkAdminAuth(request: NextRequest): boolean {
  const sessionValue = request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  return isValidAdminSession(sessionValue)
}

function toIsoString(value: NoteTimestamp | undefined): string | null {
  if (value instanceof Date) return value.toISOString()
  if (typeof value?.toDate === "function") return value.toDate().toISOString()
  return null
}

function normalizeNoteBody(value: unknown): string | null {
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  if (!trimmed) return null

  return trimmed.slice(0, INTERNAL_NOTE_MAX_LENGTH)
}

async function getQuoteRef(id: string) {
  if (!adminDb) return null

  const quoteRef = adminDb.collection("quotes").doc(id)
  const quoteSnapshot = await quoteRef.get()

  if (!quoteSnapshot.exists) {
    return null
  }

  return quoteRef
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

    const quoteRef = await getQuoteRef(id)
    if (!quoteRef) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const snapshot = await quoteRef
      .collection(INTERNAL_NOTES_COLLECTION_NAME)
      .orderBy("createdAt", "desc")
      .get()

    const notes = snapshot.docs
      .map((doc) => {
        const data = doc.data() as InternalNoteDocument
        const body = typeof data.body === "string" ? data.body : ""

        return {
          id: typeof data.id === "string" && data.id ? data.id : doc.id,
          body,
          createdAt: toIsoString(data.createdAt),
          updatedAt: toIsoString(data.updatedAt),
        }
      })
      .filter((note) => note.body)

    return NextResponse.json({ notes })
  } catch {
    return NextResponse.json({ error: "Failed to load internal notes" }, { status: 500 })
  }
}

export async function POST(
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

    const data = await request.json().catch(() => null)
    const body = normalizeNoteBody(data?.body)

    if (!body) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const quoteRef = await getQuoteRef(id)
    if (!quoteRef) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const noteRef = quoteRef.collection(INTERNAL_NOTES_COLLECTION_NAME).doc()
    const now = new Date()

    await noteRef.set({
      id: noteRef.id,
      body,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({
      note: {
        id: noteRef.id,
        body,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to save internal note" }, { status: 500 })
  }
}