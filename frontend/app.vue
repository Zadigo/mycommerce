<template>
  <VApp>
    <NuxtLayout>
      <!-- Loader -->
      <NuxtLoadingIndicator />
      <Toaster />
    
      <NuxtPage />
 
      <ClientOnly>
        <ModalsLanguage />
      </ClientOnly>
    </NuxtLayout>
  </VApp>
</template>

<script setup lang="ts">
import 'animate.css'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Toaster } from 'vue-sonner'
import { baseSessionCacheData } from '~/data'

import type { SessionCacheData } from '~/types'
import type { ExtendedLocationQuery } from './types'

// useSchemaOrg([
//   defineWebSite({
//     potentialAction: [
//       defineSearchAction({
//         target: '/search?q={search}'
//       })
//     ]
//   }),
//   defineWebPage({
//     '@type': ['CollectionPage', 'AboutPage', 'FAQPage']
//   })
// ])

const sessionCache = useSessionStorage<SessionCacheData>('cache', baseSessionCacheData)
const likedProducts = useLocalStorage<number[]>('likedProducts', [])

const route = useRoute()
const shopStore = useShop()
const authenticationStore = useAuthentication()
const cartStore = useCart()

// Use secure cookies (with sameSite strict, secure enabled)
const accessToken = useCookie('access', { sameSite: 'strict', secure: true })
const refreshToken = useCookie('refresh', { sameSite: 'strict', secure: true })
const cookieSessionId = useCookie('sessionId', { sameSite: 'strict', secure: true })

const { $client, $fireStore } = useNuxtApp()
const { handleError } = useErrorHandler()
const isMmobile = useMediaQuery('(min-width: 320px)').value
const { isSupported: screenOrientation } = useScreenOrientation()

provide('isMobile', isMmobile)
provide('screenOrientation', screenOrientation)
provide('documentVisible', useDocumentVisibility())

// Watch route query for login parameter to open login drawer
watch((): ExtendedLocationQuery => route.query, (newValue) => {
  if (newValue.login && newValue.login === '1') {
    authenticationStore.showLoginDrawer = true
  }
})

// Synchronize store state with local storage
shopStore.$subscribe((_, state) => {
  state.sessionCache = sessionCache.value
  shopStore.likedProducts = likedProducts.value
}, {
  detached: true
})

cartStore.$subscribe((_, state) => {
  state.sessionCache = sessionCache.value
}, {
  detached: true
})

authenticationStore.$subscribe((_, state) => {
  state.sessionCache = sessionCache.value
  accessToken.value = state.accessToken
  refreshToken.value = state.refreshToken

  console.log('state.sessionCache.authenticationStore', state.sessionCache)
}, {
  detached: true
})

/**
 * Request a new sessionId via the API and ensure a
 * corresponding Firestore document exists
 * 
 * TODO: Use server?
 */
async function requestSessionId () {
  try {
    if (!cookieSessionId.value) {
      const response = await $client<{ token: string }>('/api/v1/cart/session-id', {
        method: 'POST'
      })

      cookieSessionId.value = response.token
      
      const userRef = doc($fireStore, 'users', cookieSessionId.value)
      const userSnapshot = await getDoc(userRef)
      
      if (!userSnapshot.exists()) {
        await setDoc(userRef, baseSessionCacheData)
      }
    }
  } catch (e) {
    handleError(e)
  }
}

onBeforeMount(async () => {
  // Ensure all store caches are initialized from session storage
  shopStore.sessionCache = shopStore.sessionCache || sessionCache.value
  cartStore.sessionCache = cartStore.sessionCache || sessionCache.value
  authenticationStore.sessionCache = authenticationStore.sessionCache || sessionCache.value

  // Load authentication tokens from cookies into the store
  authenticationStore.accessToken = accessToken.value
  authenticationStore.refreshToken = refreshToken.value

  await requestSessionId()
})

onMounted(() => {
  cartStore.sessionCache.sessionId = cookieSessionId.value || null
  
  if (!shopStore.sessionCache.language.selected) {
    // Upon mounting, show language modal if no language is selected
    shopStore.showLanguageModal = true
  }
})
</script>
