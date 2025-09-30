import { doc, updateDoc } from 'firebase/firestore'
import type { CartUpdateApiResponse } from '~/types'

/**
 * Syncs the cart data received from Django
 *  with the Firestore
 */
export async function useSyncCart() {
  if (import.meta.server) {
    return {
      sync: async () => {}
    }
  }

  const storage = await useStorageSetup()
  const docRef = doc(useFirestore(), 'sessions', storage.sessionId?.value)

  async function sync(response: CartUpdateApiResponse) {
    await updateDoc(docRef, { cart: response }, { merge: true })
  }

  return {
    sync
  }
}
