import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

// Only initialize if projectId is set (dev without Firebase stays safe)
const app =
  getApps().length > 0
    ? getApps()[0]
    : firebaseConfig.projectId
      ? initializeApp(firebaseConfig)
      : null

export const db = app ? getFirestore(app) : null
