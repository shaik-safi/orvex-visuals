import { DOMAIN } from "@/lib/constants"

type GuardOptions = {
  routeKey: string
  maxBytes: number
  limit: number
  windowMs: number
}

type GuardSuccess = {
  ok: true
  body: unknown
}

type GuardFailure = {
  ok: false
  response: Response
}

type RateLimitBucket = {
  count: number
  resetAt: number
}

declare global {
  var __orvexPublicWriteBuckets__: Map<string, RateLimitBucket> | undefined
}

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ error: message }, { status, headers })
}

function getBuckets() {
  if (!globalThis.__orvexPublicWriteBuckets__) {
    globalThis.__orvexPublicWriteBuckets__ = new Map<string, RateLimitBucket>()
  }

  return globalThis.__orvexPublicWriteBuckets__
}

function getForwardedHost(request: Request) {
  return request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host")?.trim() || ""
}

function getForwardedProto(request: Request) {
  const host = getForwardedHost(request)
  return request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https")
}

function getAllowedOrigins(request: Request) {
  const allowedOrigins = new Set<string>([new URL(DOMAIN).origin])
  const host = getForwardedHost(request)

  if (host) {
    allowedOrigins.add(`${getForwardedProto(request)}://${host}`)
  }

  return allowedOrigins
}

function getOriginCandidate(request: Request) {
  const origin = request.headers.get("origin")?.trim()
  if (origin) return origin

  const referer = request.headers.get("referer")?.trim()
  if (!referer) return null

  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

function validateOrigin(request: Request) {
  const origin = getOriginCandidate(request)

  if (!origin) {
    const host = getForwardedHost(request)
    return host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? null
      : jsonError("Invalid request origin", 403)
  }

  return getAllowedOrigins(request).has(origin)
    ? null
    : jsonError("Invalid request origin", 403)
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const realIp = request.headers.get("x-real-ip")?.trim()
  const clientIp = forwardedFor || realIp

  if (clientIp) return clientIp

  const fallbackSeed = [
    request.headers.get("user-agent")?.trim() || "unknown-agent",
    getForwardedHost(request) || "unknown-host",
  ].join(":")

  return fallbackSeed.slice(0, 256)
}

function enforceRateLimit(request: Request, options: GuardOptions) {
  const now = Date.now()
  const buckets = getBuckets()

  if (buckets.size > 500) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key)
    }
  }

  const key = `${options.routeKey}:${getClientIdentifier(request)}`
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return null
  }

  if (current.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    return jsonError("Too many requests. Please wait and try again.", 429, {
      "Retry-After": String(retryAfterSeconds),
    })
  }

  current.count += 1
  buckets.set(key, current)
  return null
}

function validateContentType(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() || ""
  return contentType.includes("application/json")
    ? null
    : jsonError("Unsupported content type", 415)
}

function validateContentLength(request: Request, maxBytes: number) {
  const contentLengthHeader = request.headers.get("content-length")
  if (!contentLengthHeader) return null

  const contentLength = Number(contentLengthHeader)
  if (!Number.isFinite(contentLength) || contentLength < 0) {
    return jsonError("Invalid content length", 400)
  }

  return contentLength > maxBytes
    ? jsonError("Request body too large", 413)
    : null
}

async function readJsonBody(request: Request, maxBytes: number) {
  if (!request.body) {
    return { ok: true, body: null } as const
  }

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let rawBody = ""
  let receivedBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    receivedBytes += value.byteLength
    if (receivedBytes > maxBytes) {
      return { ok: false, response: jsonError("Request body too large", 413) } as const
    }

    rawBody += decoder.decode(value, { stream: true })
  }

  rawBody += decoder.decode()

  try {
    return { ok: true, body: JSON.parse(rawBody || "null") } as const
  } catch {
    return { ok: false, response: jsonError("Invalid JSON body", 400) } as const
  }
}

export async function guardPublicWriteRequest(request: Request, options: GuardOptions): Promise<GuardSuccess | GuardFailure> {
  const originError = validateOrigin(request)
  if (originError) return { ok: false, response: originError }

  const contentTypeError = validateContentType(request)
  if (contentTypeError) return { ok: false, response: contentTypeError }

  const contentLengthError = validateContentLength(request, options.maxBytes)
  if (contentLengthError) return { ok: false, response: contentLengthError }

  const rateLimitError = enforceRateLimit(request, options)
  if (rateLimitError) return { ok: false, response: rateLimitError }

  return readJsonBody(request, options.maxBytes)
}