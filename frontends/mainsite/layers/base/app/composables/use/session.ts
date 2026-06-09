import { promiseTimeout } from '@vueuse/core'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import { baseSessionCacheData } from '~~/layers/base/app/utils/constants'

import type { CartSessionData, SessionCacheData } from '~/types'

export const SESSIONNAME = 'sessionId'

export const CARTSESSIONNAME = 'cart-session'

/**
 * Composable used to initalize the sessions for the user in Firestore. A global session
 * is created to track user interactions and a cart session is created to manage the user's cart. The composable
 * also manages the state of the session initialization and any errors that may occur during the process.
 */
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
    /**
     * errors is an array of error messages that may occur 
     * during the session setup process. This allows the application to track 
     * and display any issues that arise while creating or managing the sessions 
     * in Firestore.
     */
    errors,
    /**
     * isWriting indicates whether the session setup process 
     * is currently writing to Firestore. This is important for
     * ensuring that we don't perform operations that depend on the session
     * data before it has been fully written and initialized.
     */
    isWriting,
    /**
     * isInitialized indicates whether the session has 
     * been successfully initialized in Firestore. This is important for
     * ensuring that the session data is ready before performing any operations
     * that depend on it.
     */
    isInitialized,
    /**
     * hasKey indicates whether a session ID exists in the cookies, 
     * which is used to determine if a session has already been initialized for 
     * the user. This is important for ensuring that we don't create multiple sessions 
     * for the same user and that we can link the user's interactions across the site 
     * using the session ID.
     */
    hasKey,
    /**
     * The sessionId is the unique identifier for the 
     * user's session, stored in a cookie and used to link the user's 
     * interactions across the site. It is created if it does not already exist and 
     * is used to manage both the global session and the cart session in Firestore.
     */
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
  const [isSyncing, toggleSyncing] = useToggle(false)
  const [isInitialized, toggleInitialized] = useToggle(false)

  if (import.meta.server) {
    return {
      docRef: null,
      isInitialized,
      isSyncing,
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

  const _docRef = computed(() => {
    if (!isDefined(sessionId)) return null
    return doc(fireStore, 'sessions', sessionId.value)
  })

  const _session = computed(() => {
    if (!isDefined(docRef)) return null
    return useDocument<SessionCacheData>(_docRef.value)
  })

  console.log('Session data from Firestore:', _session.value?.value)

  whenever(() => isDefined(session), () => {
    toggleInitialized(true)
  })

  /**
   * Writeable session
   */

  const writeableSession = ref<SessionCacheData>()

  watchDebounced(() => _session.value?.value, async (newSession) => {
    if (!isDefined(docRef) || !isDefined(newSession)) return
    
    try {
      toggleSyncing(true)
      await setDoc(docRef, newSession)
    } catch (error) {
      console.log('Error writing session data to Firestore:', error)
    } finally {
      toggleSyncing(false)
    }
  }, { deep: true, debounce: 500 })

  // Watch for when the session is defined in Firestore 
  // and update the local session state accordingly
  watch(() => _session.value?.value, (newValue) => {
    if (isDefined(newValue)) {
      writeableSession.value = newValue
    }
  })

  return {
    docRef,
    isInitialized,
    isSyncing,
    session,
    writeableSession,
    sessionId: readonly(sessionId)
  }
})
