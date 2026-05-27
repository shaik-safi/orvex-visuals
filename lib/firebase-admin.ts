import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY
  return value ? value.replace(/\\n/g, "\n") : undefined
}

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = getPrivateKey()

const adminApp =
  getApps()[0] ||
  (projectId && clientEmail && privateKey
    ? initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
    : null)

export const adminDb = adminApp ? getFirestore(adminApp) : null