import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY
  if (!value) return undefined

  // Decode from Base64 if it doesn't look like a standard PEM header
  if (!value.startsWith("-----BEGIN PRIVATE KEY-----")) {
    try {
      return Buffer.from(value, "base64").toString("utf8")
    } catch (e) {
      console.error("Failed to decode Base64 private key:", e)
      return undefined
    }
  }

  return value.trim().replace(/\\n/g, "\n")
}

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = getPrivateKey()

let adminApp = getApps()[0]

if (!adminApp) {
  // If variables are missing during 'next build', log a warning instead of crashing
  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️ Firebase environment variables are missing. Skipping initialization during build.");
    adminApp = null
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

// Export adminDb safely. If adminApp is null, adminDb becomes null.
export const adminDb = adminApp ? getFirestore(adminApp) : null