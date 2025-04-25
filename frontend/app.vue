<template>
  <VApp>
    <NuxtLayout>
      <!-- Loader -->
      <NuxtLoadingIndicator />
      
      <ClientOnly>
        <Toaster />
      </ClientOnly>
    
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
const cookieOptions = { sameSite: 'strict', secure: true } as const
const accessToken = useCookie('access', cookieOptions)
const refreshToken = useCookie('refresh', cookieOptions)
const cookieSessionId = useCookie('sessionId', cookieOptions)

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

watch([accessToken, refreshToken], ([access, refresh]) => {
  authenticationStore.accessToken = access
  authenticationStore.refreshToken = refresh
})

// Synchronize store state with local storage
shopStore.$subscribe((_, state) => {
  // state.sessionCache = sessionCache.value
  shopStore.likedProducts = likedProducts.value
}, {
  detached: true
})

// cartStore.$subscribe((_, state) => {
//   state.sessionCache = sessionCache.value
// }, {
//   detached: true
// })

// authenticationStore.$subscribe((_, state) => {
//   state.sessionCache = sessionCache.value
//   accessToken.value = state.accessToken
//   refreshToken.value = state.refreshToken

//   console.log('state.sessionCache.authenticationStore', state.sessionCache)
// }, {
//   detached: true
// })

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

function syncSessionToStores() {
  const cache = sessionCache.value

  shopStore.sessionCache = cache
  cartStore.sessionCache = cache
  authenticationStore.sessionCache = cache
}

onBeforeMount(async () => {
  syncSessionToStores()
  authenticationStore.accessToken = accessToken.value
  authenticationStore.refreshToken = refreshToken.value
  await requestSessionId()
})

onMounted(() => {
  cartStore.sessionCache.sessionId = cookieSessionId.value || null
  if (!shopStore.sessionCache.language.selected) {
    shopStore.showLanguageModal = true
  }
})
</script>
