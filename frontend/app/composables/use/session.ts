import { useAuthentication, useErrorHandler } from '#imports'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import { baseSessionCacheData } from '~/data'

import type { SessionCacheData } from '~/types'

const cookieOptions = { sameSite: 'strict', secure: true } as const

/**
 * Composable used to manage the state of modals
 * that are in the global site (login, language...)
 * and can be accessible from anywhere in the app
 */
export const useGlobalModals = createGlobalState(() => {
  const showLoginDrawer = shallowRef<boolean>(false)
  const showSearchModal = shallowRef<boolean>(false)
  const showLanguageModal = shallowRef<boolean>(false)
  const showWhatsAppModal = shallowRef<boolean>(false)

  return {
    /**
     * Login and signup
     */
    showLoginDrawer,
    /** 
     * Search items in the shop
     */
    showSearchModal,
    /**
     * Language selection
     */
    showLanguageModal,
    /**
     * WhatsApp chat
     */
    showWhatsAppModal
  }
})

/**
 * Setup the storage for the user session in order to store data
 * such as liked products, session cache, etc.
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
  const likedProducts = useLocalStorage<number[]>('likedProducts', [])

  const sessionId = useCookie('sessionId', cookieOptions)
  
  const db = useFirestore()
  const collectionRef = collection(db, 'sessions')
  
  if (!isDefined(sessionId)) {
    const docRef = await addDoc(collectionRef, baseSessionCacheData)
    sessionId.value = docRef.id

    const sessionCache = useDocument<SessionCacheData>(docRef)

    return {
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
 * Composable used to create a unique sessionId for the user
 * and store it in a cookie that we can use to identify anonymous users
 * when they add products to the cart or like products
 */
export function useUserSession() {
  if (import.meta.server) {
    return {
      requestSessionId: () => Promise.resolve()
    }
  }

  const { customHandleError } = useErrorHandler()
  const cookieSessionId = useCookie('shopSessionId', cookieOptions)
  
  /**
   * Request a new sessionId via the API and ensure a
   * corresponding Firestore document exists
   * TODO: Use server?
   */
  async function requestSessionId() {
    try {
      if (!cookieSessionId.value) {
        const { data } = await useFetch<{ token: string }>('/api/v1/cart/session-id', {
          method: 'POST',
          baseURL: useRuntimeConfig().public.prodDomain,
          immediate: true
        })

        if (data.value) {
          cookieSessionId.value = data.value.token
          
          if (isDefined(cookieSessionId)) {
            const db = useFirestore()
            await updateDoc(doc(db, 'sessions', cookieSessionId.value), { sessionId: data.value.token })
          }
        }
      }
    } catch (e) {
      customHandleError(e)
    }
  }

  onBeforeMount(async () => {
    await requestSessionId()
  })

  return {
    /**
     * ID used by Django to identify anonymous users when
     * they add products to their cart
     */
    cookieSessionId,
    requestSessionId
  }
}

/**
 * Composable used to manage authentication tokens
 * and handle the login drawer visibility
 * @deprecated use `useLogin` instead
 */
export function useAuthenticationTokens() {
  if (import.meta.server) {
    return {
      accessToken: ref(''),
      refreshToken: ref('')
    }
  }


  const globalModals = useGlobalModals()
  const queryParams = useUrlSearchParams('history') as { login: string | undefined }

  watchDebounced(() => queryParams.login, (newValue) => {
    if (isDefined(newValue)) {
      // authenticationStore.showLoginDrawer = (newValue === '1')
      globalModals.showLoginDrawer.value = newValue === '1'
    }
  })

  // Watch route query for login parameter to open login drawer
  // const query = useRoute().query as ExtendedLocationQuery

  // watchDebounced(() => query, (newValue) => {
  //   if (newValue.login && newValue.login === '1') {
  //     authenticationStore.showLoginDrawer = true
  //   }
  // }, {
    //   immediate: true,
    //   debounce: 500
    // })

  /**
   * TODO: Remove authenticationStore and accessToken/refreshToken
   * and use only the cookies directly
   */
    
  // Use secure cookies (with sameSite strict, secure enabled)
  const authenticationStore = useAuthentication()
  const accessToken = useCookie('access', cookieOptions)
  const refreshToken = useCookie('refresh', cookieOptions)

  watch([accessToken, refreshToken], ([access, refresh]) => {
    authenticationStore.accessToken = access
    authenticationStore.refreshToken = refresh
  })

  return {
    /**
     * Access token used for authenticated requests
     * This is stored in a secure cookie
     */
    accessToken,
    /**
     * Refresh token used to refresh the access token
     * This is also stored in a secure cookie
     */
    refreshToken
  }
}
