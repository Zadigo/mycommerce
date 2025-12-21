import { promiseTimeout } from '@vueuse/core'
import { addDoc, collection, doc, getDoc, setDoc, increment } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import { baseSessionCacheData } from '~/data/constants'

import type { CartSessionData, SessionCacheData } from '~/types'

export const SESSIONNAME = 'sessionId'

export const CARTSESSIONNAME = 'cart-session'

export function useSetupSession() {
  if (import.meta.server) {
    return {
      hasKey: ref(false),
      sessionId: ref<string | undefined>(undefined),
      createSession: async () => {}
    }
  }

  const fireStore = useFirestore()

  const sessionId = useCookie(SESSIONNAME, { sameSite: 'strict', secure: true, expires: undefined })
  const hasKey = computed(() => isDefined(sessionId) && sessionId.value !== '')

  const cartSessionId = useCookie(CARTSESSIONNAME, { sameSite: 'strict', secure: true, expires: undefined })

  async function _createSession() {
    if (isDefined(sessionId)) {
      await promiseTimeout(500)
      return 
    }
    // if (isDefined(sessionId)) {
    //   try {
    //     console.log('Checking existing session in Firestore (createSession):', sessionId.value)

    //     const docRef = doc(fireStore, 'sessions', sessionId.value)
    //     const result = await getDoc(docRef) // Ensure document exists

    //     if (result.exists()) {
    //       return
    //     } else {
    //       sessionId.value = '' // Invalidate cookie if session does not exist
    //       cartSessionId.value = ''
    //     }
    //   } catch (error) {
    //     console.error('Error fetching session document:', error)
    //   }
    // }

    const collectionRef = collection(fireStore, 'sessions')
    const result = await addDoc(collectionRef, baseSessionCacheData)
    sessionId.value = result.id
    
    await promiseTimeout(500) // Wait for Firestore to propagate

    const cartCollectionRef = collection(fireStore, 'carts')
    const cartResult = await addDoc(cartCollectionRef, {
      items: [],
      sessionId: sessionId.value,
      numberOfItems: 0,
      total: 0,
      paymentIntent: null,
      authenticated: false,
      viewCount: 0
    } as CartSessionData
    )
    cartSessionId.value = cartResult.id
    await promiseTimeout(500)
  }

  const createSession = useThrottleFn(_createSession, 10000)

  return {
    hasKey,
    sessionId,
    createSession
  }
}

/**
 * A composable to manage user sessions using Firestore and cookies.
 * It creates a new session if one does not exist and keeps the session data
 * synchronized with Firestore.
 *
 * @param name - The name of the cookie to store the session ID. Defaults to 'sessionId'.
 * @returns An object containing the sessionId cookie and a reactive session object.
 */
export const useSession = createGlobalState(() => {
  if (import.meta.server) {
    return {
      session: readonly(ref(null)),
      sessionId: ref<string | null>(null),
      writeableSession: ref<SessionCacheData | null>(null)
    }
  }

  const fireStore = useFirestore()
  const sessionId = useCookie(SESSIONNAME)
  
  if (!isDefined(sessionId)) {
    throw new Error('Session ID cookie is undefined.')
  }
        
  const db = doc(fireStore, 'sessions', sessionId.value)
  const session = useDocument<SessionCacheData>(db)

  console.log('Initialized session document binding:', session.value)

  if (!isDefined(session)) console.error('Session document is undefined.')

  const writeableSession = computed({
    get: () => session.value,
    set: async (val: SessionCacheData) => {
      await setDoc(db, toValue(val), { merge: true })
      console.log('Updated', val)
      if (isDefined(val) && isDefined(sessionId)) {
      }
    }
  })

  return {
    session,
    sessionId: readonly(sessionId),
    writeableSession
  }
})
