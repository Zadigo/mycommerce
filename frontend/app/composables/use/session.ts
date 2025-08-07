import { baseSessionCacheData } from '~/data'

import type { ExtendedLocationQuery, SessionCacheData } from '~/types'

const cookieOptions = { sameSite: 'strict', secure: true } as const


/**
 * Setup the storage for the user session in order to store data
 * such as liked products, session cache, etc.
 * @todo Simplify using Firesbase Realtime Database or Firestore
 */
export function useStorageSetup() {
  if (import.meta.server) {
    return {
      sessionCache: baseSessionCacheData,
      likedProducts: ref([])
    }
  }

  // Setup the containers that we will be using locally in order to register
  // some of the user actions - This can/should be done directly into Firebase
  // but as the data is not sensitive either way is good
  const sessionCache = useSessionStorage<SessionCacheData>('cache', baseSessionCacheData)
  const likedProducts = useLocalStorage<number[]>('likedProducts', [])

  const shopStore = useShop()
  const { sessionCache: shopSessionCache } = storeToRefs(shopStore)
  syncRef(sessionCache, shopSessionCache)

  const authenticationStore = useAuthentication()
  const { sessionCache: authSessionCache } = storeToRefs(authenticationStore)
  syncRef(sessionCache, authSessionCache)

  const cartStore = useCart()
  const { sessionCache: cartSessionCache } = storeToRefs(cartStore)
  syncRef(sessionCache, cartSessionCache)

  return {
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
  const cookieSessionId = useCookie('sessionId', cookieOptions)
  
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
          immediate: true,
        })

        if (data.value) {
          cookieSessionId.value = data.value.token
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
    requestSessionId
  }
}

/**
 * Composable used to manage authentication tokens
 * and handle the login drawer visibility
 */
export function useAuthenticationTokens() {
  if (import.meta.server) {
    return {
      accessToken: ref(''),
      refreshToken: ref('')
    }
  }

  const authenticationStore = useAuthentication()

  // Watch route query for login parameter to open login drawer
  const query = useRoute().query as ExtendedLocationQuery

  watchDebounced(() => query, (newValue) => {
    if (newValue.login && newValue.login === '1') {
      authenticationStore.showLoginDrawer = true
    }
  }, {
    immediate: true,
    debounce: 500
  })

  // Use secure cookies (with sameSite strict, secure enabled)
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
