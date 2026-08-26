import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

/**
 * Initializes and returns the Firebase Admin Firestore instance.
 */
export const useFirebaseAdmin = () => {
  const apps = getApps()

  if (!apps.length) {
    const config = useRuntimeConfig()

    initializeApp({
      credential: cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'),
      }),
    })
  }

  const db = getFirestore()
  return { db }
}
