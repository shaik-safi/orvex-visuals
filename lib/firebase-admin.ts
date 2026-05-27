import "server-only"

import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey() {
  let value = process.env.FIREBASE_PRIVATE_KEY
  if (!value) {
    console.warn("⚠️ FIREBASE_PRIVATE_KEY environment variable is not set")
    return undefined
  }

  // Strip outer quotes if present (common with env var storage)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }

  // Replace escaped newlines with actual newlines
  value = value.replace(/\\n/g, "\n").trim()

  // Try to decode from Base64 if it doesn't look like a standard PEM header
  if (!value.startsWith("-----BEGIN PRIVATE KEY-----")) {
    try {
      console.log("Attempting to decode private key from Base64...")
      const decoded = Buffer.from(value, "base64").toString("utf8")
      return decoded.trim().replace(/\\n/g, "\n")
    } catch (e) {
      console.error("❌ Failed to decode Base64 private key:", e)
      return undefined
    }
  }

  // Validate the key format
  if (!value.endsWith("-----END PRIVATE KEY-----")) {
    console.error("❌ Private key format is invalid. Missing END PRIVATE KEY marker")
    return undefined
  }

  return value
}

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = getPrivateKey()

let adminApp: App | null = getApps()[0] ?? null

if (!adminApp) {
  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️ Firebase environment variables are missing. Skipping initialization during build.");
    adminApp = null // TypeScript will accept this now
  } else {
    try {
      adminApp = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      })
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error)
      adminApp = null
    }
  }
}

export const adminDb = adminApp ? getFirestore(adminApp) : null