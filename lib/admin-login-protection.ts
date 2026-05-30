import "server-only"

type LoginAttemptRecord = {
  failureCount: number
  firstFailureAt: number
  lastFailureAt: number
  backoffUntil: number
  lockoutUntil: number
}

type LoginProtectionStatus = {
  allowed: true
  key: string
} | {
  allowed: false
  retryAfterSeconds: number
}

type FailedLoginResult = {
  retryAfterSeconds: number
  lockedOut: boolean
}

const FAILURE_WINDOW_MS = 15 * 60 * 1000
const BACKOFF_START_FAILURE_COUNT = 3
const MAX_BACKOFF_MS = 30 * 1000
const LOCKOUT_FAILURE_COUNT = 6
const LOCKOUT_MS = 15 * 60 * 1000

declare global {
  var __orvexAdminLoginAttempts__: Map<string, LoginAttemptRecord> | undefined
}

function getLoginAttemptStore() {
  if (!globalThis.__orvexAdminLoginAttempts__) {
    globalThis.__orvexAdminLoginAttempts__ = new Map<string, LoginAttemptRecord>()
  }

  return globalThis.__orvexAdminLoginAttempts__
}

function pruneExpiredAttempts(now: number) {
  const store = getLoginAttemptStore()

  if (store.size <= 1000) return

  for (const [key, attempt] of store) {
    const expired =
      attempt.lockoutUntil <= now &&
      attempt.backoffUntil <= now &&
      attempt.lastFailureAt + FAILURE_WINDOW_MS <= now

    if (expired) {
      store.delete(key)
    }
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  if (forwardedFor) return forwardedFor

  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp

  const cfIp = request.headers.get("cf-connecting-ip")?.trim()
  if (cfIp) return cfIp

  return "unknown"
}

function getBackoffMs(failureCount: number) {
  if (failureCount < BACKOFF_START_FAILURE_COUNT) return 0

  const step = failureCount - BACKOFF_START_FAILURE_COUNT
  return Math.min(2 ** step * 1000, MAX_BACKOFF_MS)
}

function getRetryAfterSeconds(until: number, now: number) {
  return Math.max(1, Math.ceil((until - now) / 1000))
}

export function checkAdminLoginProtection(request: Request): LoginProtectionStatus {
  const now = Date.now()
  pruneExpiredAttempts(now)

  const key = getClientIp(request)
  const attempt = getLoginAttemptStore().get(key)

  if (!attempt) {
    return { allowed: true, key }
  }

  if (attempt.lockoutUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: getRetryAfterSeconds(attempt.lockoutUntil, now),
    }
  }

  if (attempt.backoffUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: getRetryAfterSeconds(attempt.backoffUntil, now),
    }
  }

  if (attempt.lastFailureAt + FAILURE_WINDOW_MS <= now) {
    getLoginAttemptStore().delete(key)
  }

  return { allowed: true, key }
}

export function registerFailedAdminLogin(key: string): FailedLoginResult {
  const now = Date.now()
  pruneExpiredAttempts(now)

  const store = getLoginAttemptStore()
  const existingAttempt = store.get(key)

  const attempt = !existingAttempt || existingAttempt.lastFailureAt + FAILURE_WINDOW_MS <= now
    ? {
        failureCount: 0,
        firstFailureAt: now,
        lastFailureAt: now,
        backoffUntil: 0,
        lockoutUntil: 0,
      }
    : { ...existingAttempt }

  attempt.failureCount += 1
  attempt.lastFailureAt = now

  if (attempt.failureCount >= LOCKOUT_FAILURE_COUNT) {
    attempt.lockoutUntil = now + LOCKOUT_MS
    attempt.backoffUntil = attempt.lockoutUntil
    store.set(key, attempt)

    return {
      retryAfterSeconds: getRetryAfterSeconds(attempt.lockoutUntil, now),
      lockedOut: true,
    }
  }

  const backoffMs = getBackoffMs(attempt.failureCount)
  attempt.backoffUntil = backoffMs > 0 ? now + backoffMs : 0
  store.set(key, attempt)

  return {
    retryAfterSeconds: backoffMs > 0 ? getRetryAfterSeconds(attempt.backoffUntil, now) : 0,
    lockedOut: false,
  }
}

export function clearFailedAdminLogins(key: string) {
  getLoginAttemptStore().delete(key)
}