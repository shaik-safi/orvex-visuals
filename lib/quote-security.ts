import "server-only"

import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto"

const ALGORITHM = "aes-256-gcm"
const ACTIVE_ACCESS_TOKEN_SCOPE = "active-access-token"

function getSecret(): string {
  const secret = process.env.QUOTE_ACCESS_SECRET
  if (!secret) {
    throw new Error("QUOTE_ACCESS_SECRET is not configured")
  }
  return secret
}

function getKey(): Buffer {
  return createHash("sha256").update(getSecret()).digest()
}

function getScopedKey(scope: string): Buffer {
  return createHash("sha256").update(`${getSecret()}:${scope}`).digest()
}

function encryptString(value: string, key: Buffer): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`
}

function decryptString(value: string, key: Buffer): string {
  const [ivEncoded, tagEncoded, payloadEncoded] = value.split(".")
  if (!ivEncoded || !tagEncoded || !payloadEncoded) {
    throw new Error("Invalid encrypted value")
  }

  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivEncoded, "base64url"))
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadEncoded, "base64url")),
    decipher.final(),
  ])

  return decrypted.toString("utf8")
}

export function generateQuoteId(): string {
  return randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()
}

export function generateAccessToken(): string {
  return randomBytes(24).toString("base64url")
}

export function hashAccessToken(token: string): string {
  return createHash("sha256").update(`${getSecret()}:${token}`).digest("hex")
}

export function encryptQuotePayload(payload: unknown): string {
  return encryptString(JSON.stringify(payload), getKey())
}

export function decryptQuotePayload<T>(value: string): T {
  return JSON.parse(decryptString(value, getKey())) as T
}

export function encryptActiveAccessToken(token: string): string {
  return encryptString(token, getScopedKey(ACTIVE_ACCESS_TOKEN_SCOPE))
}

export function decryptActiveAccessToken(value: string): string {
  return decryptString(value, getScopedKey(ACTIVE_ACCESS_TOKEN_SCOPE))
}