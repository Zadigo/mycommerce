import { promiseTimeout } from '@vueuse/core'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import { baseSessionCacheData } from '~/data/constants'

import type { SessionCacheData } from '~/types'

/**
 * A composable to manage user sessions using Firestore and cookies.
 * It creates a new session if one does not exist and keeps the session data
 * synchronized with Firestore.
 *
 * @param name - The name of the cookie to store the session ID. Defaults to 'sessionId'.
 * @returns An object containing the sessionId cookie and a reactive session object.
 */
export const useSession = createGlobalState((name: string = 'sessionId') => {
  if (import.meta.server) {
    return {
      sessionId: null,
      session: null
    }
  }

  const fireStore = useFirestore()
  const sessionId = useCookie(name, { sameSite: 'strict', secure: true, expires: undefined })

  async function createSession() {
    if (isDefined(sessionId)) {
      const docRef = doc(fireStore, 'sessions', sessionId.value)
      const result = await getDoc(docRef) // Ensure document exists
      if (result.exists()) {
        return
      } else {
        sessionId.value = '' // Invalidate cookie if session does not exist
      }
    }

    const collectionRef = collection(fireStore, 'sessions')
    const result = await addDoc(collectionRef, baseSessionCacheData)
    sessionId.value = result.id

    await promiseTimeout(1000) // Wait for Firestore to propagate
  }

  createSession()

  if (!isDefined(sessionId)) throw new Error('Session ID is undefined after creation.')

  const docRef = doc(fireStore, 'sessions', sessionId.value)
  const _session = useDocument<SessionCacheData>(docRef)

  if (!isDefined(_session)) console.error('Session document is undefined.')
  
  const session = computed({
    get: () => _session.value,
    set: (val: SessionCacheData) => {
      console.log('Updated', val)
      if (isDefined(val) && isDefined(sessionId)) {
        useDebounceFn(async () => { await updateDoc(docRef, val, { merge: true }) }, 500)()
      }
    }
  })

  return {
    sessionId,
    session
  }
})
