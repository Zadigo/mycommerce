import { useErrorHandler } from '#imports'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import { baseSessionCacheData } from '~/data'

import type { SessionCacheData } from '~/types'

const cookieOptions = { sameSite: 'strict', secure: true } as const

/**
 * Composable used to create a unique sessionId for the user
 * and store it in a cookie that we can use to identify anonymous users
 * when they add products to the cart or like products
 * @deprecated
 */
export function useDjangoSession() {
  if (import.meta.server) {
    return {
      requestSessionId: () => Promise.resolve()
    }
  }

  const { customHandleError } = useErrorHandler()
  const djangoSessionId = useCookie('shopSessionId', cookieOptions)

  /**
   * Request a new sessionId via the API and ensure a
   * corresponding Firestore document exists
   * TODO: Use server?
   */
  async function requestSessionId() {
    try {
      if (!djangoSessionId.value) {
        const { data } = await useFetch<{ token: string }>('/api/v1/cart/session-id', {
          method: 'POST',
          baseURL: useRuntimeConfig().public.prodDomain,
          immediate: true
        })

        if (data.value) {
          djangoSessionId.value = data.value.token

          if (isDefined(djangoSessionId)) {
            const db = useFirestore()
            await updateDoc(doc(db, 'sessions', djangoSessionId.value), { sessionId: data.value.token })
          }
        }
      }
    } catch (e) {
      customHandleError(e)
    }
  }

  return {
    /**
     * ID used by Django to identify anonymous users when
     * they add products to their cart
     */
    djangoSessionId,
    requestSessionId
  }
}
  
/**
 * Setup the storage for the user session in order to store data
 * such as liked products, session cache, etc.
 * @todo rename to useSessionSetup
 * @deprecated
 */
export async function useStorageSetup() {
  if (import.meta.server) {
    return {
      sessionCache: baseSessionCacheData,
      likedProducts: ref<number[]>([])
    }
  }

  // Setup the containers that we will be using locally in order to register
  // some of the user actions - This can/should be done directly into Firebase
  // but as the data is not sensitive either way is good
  // const sessionCache = useSessionStorage<SessionCacheData>('cache', baseSessionCacheData)
  const sessionId = useCookie('sessionId', cookieOptions)
  const { djangoSessionId, requestSessionId } = useDjangoSession()
  
  onBeforeMount(async () => { await requestSessionId() })

  const likedProducts = useLocalStorage<number[]>('likedProducts', [])
  
  const db = useFirestore()
  const collectionRef = collection(db, 'sessions')
  
  if (!isDefined(sessionId)) {
    const docRef = await addDoc(collectionRef, baseSessionCacheData)
    sessionId.value = docRef.id

    const sessionCache = useDocument<SessionCacheData>(docRef)

    console.log('useStorageSetup.sessionCache', sessionCache)

    return {
      /**
       * ID used by Django to identify anonymous users when
       * they add products to their cart
       */
      djangoSessionId,
      /**
       * Document ID in firebase under which the session cache is stored
       * This is used to identify the user session and link it with
       * the cart, liked products, etc.
       */
      sessionId,
      /**
       * Session cache used to store data that is not sensitive
       * and include elements such as the cart, recommendations,
       * search history, etc.
       */
      sessionCache,
      /**
       * Local storage used to store the products that the user has liked
       * This is not sensitive data and can be stored locally
       */
      likedProducts
    }
  } else {
    const docRef = doc(db, 'sessions', sessionId.value)
    const sessionCache = useDocument<SessionCacheData>(docRef)
    
    console.log('docRef', docRef)
    
    return {
      /**
       * ID used by Django to identify anonymous users when
       * they add products to their cart
       */
      djangoSessionId,
      /**
       * Document ID in firebase under which the session cache is stored
       * This is used to identify the user session and link it with
       * the cart, liked products, etc.
       */
      sessionId,
      /**
       * Session cache used to store data that is not sensitive
       * and include elements such as the cart, recommendations,
       * search history, etc.
       */
      sessionCache,
      /**
       * Local storage used to store the products that the user has liked
       * @todo Sync to Firebase
       */
      likedProducts
    }
  }
}

/**
 * Creates a global state and watches for changes in the URL query parameters
 * in order to update its value accordingly
 * @param name Name of the global state
 * @param queryValue Query parameter to watch for changes
 * @param value Default value of the global state
 */
export function useWatchGlobalState(name: string, queryValue: string, value: string | boolean | number) {
  if (import.meta.server) {
    return
  }

  const state = useState(name, () => value)
  const queryParams = useUrlSearchParams('history') as { [key: string]: string | undefined }

  watchDebounced(() => queryParams[queryValue], (newValue) => {
    if (isDefined(newValue)) {
      state.value = newValue === '1'
    }
  }, {
    debounce: 300
  })
}
