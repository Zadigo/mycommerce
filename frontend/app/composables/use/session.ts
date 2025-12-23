import { promiseTimeout } from '@vueuse/core'
import { addDoc, collection, doc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import { baseSessionCacheData } from '~/data/constants'

import type { CartSessionData, SessionCacheData } from '~/types'

export const SESSIONNAME = 'sessionId'

export const CARTSESSIONNAME = 'cart-session'

export function useSetupSession() {
  const errors = ref<string[]>([])
  const [isInitialized, toggleInitialized] = useToggle(false)
  const [isWriting, toggleWriting] = useToggle(false)

  if (import.meta.server) {
    return {
      errors,
      isWriting,
      isInitialized,
      hasKey: ref(false),
      sessionId: ref<string | undefined>(undefined)
    }
  }

  const fireStore = useFirestore()

  const _sessionId = useCookie(SESSIONNAME, { sameSite: 'strict', secure: true, expires: undefined })
  const sessionId = refDefault(_sessionId, '')

  const _cartSessionId = useCookie(CARTSESSIONNAME, { sameSite: 'strict', secure: true, expires: undefined })
  const cartSessionId = refDefault(_cartSessionId, '')

  // Creates a new global session key
  async function _createSession() {
    return new Promise<string>((resolve) => {
      toggleWriting(true)

      // If session already exists, return it
      if (isDefined(sessionId) && sessionId.value !== '') {
        toggleWriting(false)
        resolve(sessionId.value)
        return
      }

      const wrapper = async () => {
        try {
          const collectionRef = collection(fireStore, 'sessions')
          const result = await addDoc(collectionRef, baseSessionCacheData)
          _sessionId.value = result.id
        } catch (error) {
          console.log('Error creating session document:', error)
          errors.value.push((error as Error).message)
        } finally {
          toggleWriting(false)
        }
      }

      wrapper().then(() => {
        promiseTimeout(500).then(() => {
          resolve(sessionId.value)
        })
      })
    })
  }

  // Creates a new cart session linked to the global session
  async function _createCartSession(id: string) {
    return new Promise<string[]>((resolve) => {
      const wrapper = async () => {
        toggleWriting(true)

        if (!isDefined(sessionId) || sessionId.value === '') {
          sessionId.value = id
        }

        if (isDefined(cartSessionId) && cartSessionId.value !== '') {
          toggleWriting(false)
          resolve([sessionId.value, cartSessionId.value])
          return
        }

        try {
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
        } catch (error) {
          console.log('Error creating cart session document:', error)
          errors.value.push((error as Error).message)
        } finally {
          toggleWriting(false)
          toggleInitialized(true)
        }
      }

      wrapper().then(() => {
        if (isWriting.value) {
          promiseTimeout(1000)
        }

        resolve([sessionId.value, cartSessionId.value])
      })
    })
  }

  useAsyncQueue([_createSession, _createCartSession])

  const hasKey = computed(() => isDefined(sessionId) && sessionId.value !== '')

  return {
    errors,
    isWriting,
    isInitialized,
    hasKey,
    sessionId
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
  const [isInitialized, toggleInitialized] = useToggle(false)

  if (import.meta.server) {
    return {
      docRef: null,
      isInitialized,
      session: readonly(ref(null)),
      sessionId: ref<string | null>(null)
    }
  }

  const fireStore = useFirestore()
  const sessionId = useCookie(SESSIONNAME)
  
  if (!isDefined(sessionId)) {
    throw new Error('Session ID cookie is undefined.')
  }
        
  const docRef = doc(fireStore, 'sessions', sessionId.value)
  const session = useDocument<SessionCacheData>(docRef)

  whenever(() => isDefined(session), () => {
    toggleInitialized(true)
  })

  return {
    docRef,
    isInitialized,
    session,
    sessionId: readonly(sessionId)
  }
})
