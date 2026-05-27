import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY
  if (!value) {
    console.warn("⚠️ FIREBASE_PRIVATE_KEY environment variable is not set")
    return undefined
  }

  // Decode from Base64 if it doesn't look like a standard PEM header
  if (!value.startsWith("-----BEGIN PRIVATE KEY-----")) {
    try {
      const decoded = Buffer.from(value, "base64").toString("utf8")
      return decoded.trim().replace(/\\n/g, "\n")
    } catch (e) {
      console.error("Failed to decode Base64 private key:", e)
      return undefined
    }
  }

  // Handle escaped newlines in PEM format
  let processedKey = value.trim().replace(/\\n/g, "\n")
  
  // Validate the key format
  if (!processedKey.startsWith("-----BEGIN PRIVATE KEY-----") || !processedKey.endsWith("-----END PRIVATE KEY-----")) {
    console.error("❌ Private key format is invalid. Expected PEM format with BEGIN/END markers")
    return undefined
  }
  
  return processedKey
}

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = getPrivateKey()

let adminApp: any = getApps()[0]

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