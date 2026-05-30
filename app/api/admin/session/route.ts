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
import {
  checkAdminLoginProtection,
  clearFailedAdminLogins,
  registerFailedAdminLogin,
} from "@/lib/admin-login-protection"

function getAdminSessionCookieValue(request: NextRequest): string | undefined {
  return request.cookies.get(ADMIN_API_SESSION_COOKIE_NAME)?.value ?? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
}

function clearAdminSessionCookies(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", { ...ADMIN_SESSION_COOKIE_OPTIONS, maxAge: 0 })
  response.cookies.set(ADMIN_API_SESSION_COOKIE_NAME, "", { ...ADMIN_API_SESSION_COOKIE_OPTIONS, maxAge: 0 })
}

function tooManyAttemptsResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many login attempts. Please wait and try again." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  )
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

  const protection = checkAdminLoginProtection(request)
  if (!protection.allowed) {
    return tooManyAttemptsResponse(protection.retryAfterSeconds)
  }

  const body = await request.json().catch(() => null)
  const password = typeof body?.password === "string" ? body.password : ""

  if (!isValidAdminPassword(password)) {
    const failure = registerFailedAdminLogin(protection.key)
    if (failure.retryAfterSeconds > 0) {
      return tooManyAttemptsResponse(failure.retryAfterSeconds)
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionValue = getAdminSessionValue()
  if (!sessionValue) {
    return NextResponse.json({ error: "Admin password not configured" }, { status: 503 })
  }

  clearFailedAdminLogins(protection.key)

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