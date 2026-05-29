import { NextRequest, NextResponse } from "next/server"

import {
  ADMIN_API_SESSION_COOKIE_NAME,
  ADMIN_API_SESSION_COOKIE_OPTIONS,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_COOKIE_OPTIONS,
  getAdminSessionValue,
  isAdminPasswordConfigured,
  isValidAdminPassword,
  isValidAdminSession,
} from "@/lib/admin-auth"

function getAdminSessionCookieValue(request: NextRequest): string | undefined {
  return request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
}

function clearAdminSessionCookies(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", { ...ADMIN_SESSION_COOKIE_OPTIONS, maxAge: 0 })
  response.cookies.set(ADMIN_API_SESSION_COOKIE_NAME, "", { ...ADMIN_API_SESSION_COOKIE_OPTIONS, maxAge: 0 })
}

export async function GET(request: NextRequest) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ authenticated: false, error: "Admin password not configured" }, { status: 503 })
  }

  return NextResponse.json({ authenticated: isValidAdminSession(getAdminSessionCookieValue(request)) })
}

export async function POST(request: NextRequest) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ error: "Admin password not configured" }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const password = typeof body?.password === "string" ? body.password : ""

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionValue = getAdminSessionValue()
  if (!sessionValue) {
    return NextResponse.json({ error: "Admin password not configured" }, { status: 503 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, sessionValue, ADMIN_SESSION_COOKIE_OPTIONS)
  response.cookies.set(ADMIN_API_SESSION_COOKIE_NAME, sessionValue, ADMIN_API_SESSION_COOKIE_OPTIONS)
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  clearAdminSessionCookies(response)
  return response
}