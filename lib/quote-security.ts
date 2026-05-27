import "server-only"

import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto"

const ALGORITHM = "aes-256-gcm"

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
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`
}

export function decryptQuotePayload<T>(value: string): T {
  const [ivEncoded, tagEncoded, payloadEncoded] = value.split(".")
  if (!ivEncoded || !tagEncoded || !payloadEncoded) {
    throw new Error("Invalid encrypted quote payload")
  }

  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivEncoded, "base64url"))
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadEncoded, "base64url")),
    decipher.final(),
  ])

  return JSON.parse(decrypted.toString("utf8")) as T
}