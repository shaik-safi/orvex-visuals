import "server-only"

import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto"

export const ADMIN_SESSION_COOKIE_NAME = "orvex_admin_session"
export const ADMIN_API_SESSION_COOKIE_NAME = "orvex_admin_api_session"

const ADMIN_SESSION_SALT = "orvex-admin-session-v2"
const ADMIN_SESSION_VERSION = 1
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

type AdminSessionPayload = {
  v: number
  iat: number
  exp: number
  nonce: string
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? ""
}

function getAdminSessionSecret(): string {
  const dedicatedSecret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (dedicatedSecret) return dedicatedSecret
  return getAdminPassword()
}

function getSessionSigningKey(): Buffer | null {
  const adminPassword = getAdminPassword()
  const sessionSecret = getAdminSessionSecret()

  if (!adminPassword || !sessionSecret) return null

  return createHash("sha256")
    .update(`${ADMIN_SESSION_SALT}:${sessionSecret}:${adminPassword}`)
    .digest()
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminPassword().length > 0
}

export function isValidAdminPassword(value: string | null | undefined): boolean {
  const adminPassword = getAdminPassword()
  if (!adminPassword || !value) return false
  return safeCompare(value, adminPassword)
}

function encodeSessionPayload(payload: AdminSessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
}

function decodeSessionPayload(value: string): AdminSessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<AdminSessionPayload>
    const { v, iat, exp, nonce } = parsed

    if (
      v !== ADMIN_SESSION_VERSION ||
      !Number.isInteger(iat) ||
      !Number.isInteger(exp) ||
      typeof nonce !== "string"
    ) {
      return null
    }

    const issuedAt = iat as number
    const expiresAt = exp as number

    return {
      v,
      iat: issuedAt,
      exp: expiresAt,
      nonce,
    }
  } catch {
    return null
  }
}

function signSessionPayload(value: string, key: Buffer): string {
  return createHmac("sha256", key).update(value).digest("base64url")
}

export function getAdminSessionValue(): string | null {
  const signingKey = getSessionSigningKey()
  if (!signingKey) return null

  const now = Math.floor(Date.now() / 1000)
  const payload = encodeSessionPayload({
    v: ADMIN_SESSION_VERSION,
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS,
    nonce: randomBytes(18).toString("base64url"),
  })

  return `${payload}.${signSessionPayload(payload, signingKey)}`
}

export function isValidAdminSession(value: string | null | undefined): boolean {
  if (!value) return false

  const signingKey = getSessionSigningKey()
  if (!signingKey) return false

  const parts = value.split(".")
  if (parts.length !== 2) return false

  const [encodedPayload, signature] = parts
  if (!encodedPayload || !signature) return false

  const expectedSignature = signSessionPayload(encodedPayload, signingKey)
  if (!safeCompare(signature, expectedSignature)) return false

  const payload = decodeSessionPayload(encodedPayload)
  if (!payload) return false

  const now = Math.floor(Date.now() / 1000)
  if (payload.iat > now + 60) return false
  if (payload.exp <= now) return false
  if (payload.exp - payload.iat > ADMIN_SESSION_MAX_AGE_SECONDS) return false

  return payload.nonce.length >= 16
}

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
}

export const ADMIN_API_SESSION_COOKIE_OPTIONS = {
  ...ADMIN_SESSION_COOKIE_OPTIONS,
  path: "/api/admin",
}
