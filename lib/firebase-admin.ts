import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY
  if (!value) return undefined

  // Check if it's base64 encoded (doesn't start with the standard PEM header)
  if (!value.startsWith("-----BEGIN PRIVATE KEY-----")) {
    return Buffer.from(value, "base64").toString("utf8")
  }

  // Fallback for standard string just in case
  return value.trim().replace(/\\n/g, "\n")
}

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = getPrivateKey()

// 1. Check if we've already initialized an app
let adminApp = getApps()[0]

// 2. If not, try to initialize it safely
if (!adminApp) {
  if (!projectId || !clientEmail || !privateKey) {
    // This will tell you EXACTLY if Vercel isn't reading the environment variables
    throw new Error(
      `Firebase initialization failed: Missing required environment variables. ` +
      `projectId: ${!!projectId}, clientEmail: ${!!clientEmail}, privateKey: ${!!privateKey}`
    );
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error)
    throw error
  }
}

// 3. Guarantee that adminDb is a valid Firestore instance when exported
export const adminDb = getFirestore(adminApp)