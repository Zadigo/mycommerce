<template>
  <!-- Main -->
  <VApp>
    <NuxtLayout>
      <!-- Loader -->
      <NuxtLoadingIndicator />
      <Toaster />
    
      <NuxtPage />
 
      <!-- Modals -->
      <!-- <ModalsLanguage /> -->
    </NuxtLayout>
  </VApp>
</template>

<script setup lang="ts">
import 'animate.css';

// import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { Toaster } from 'vue-sonner';
import { baseSessionCacheData } from '~/data';
import type { SessionCacheData } from '~/types';

const sessionCache = useSessionStorage<SessionCacheData>('cache', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const likedProducts = useLocalStorage<number[]>('likedProducts', [], {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const shopStore = useShop()
const authenticationStore = useAuthentication()
const cartStore = useCart()

const accessToken = useCookie('access')
const refreshToken = useCookie('refresh')
const cookieSessionId = useCookie('sessionId')

const { $client } = useNuxtApp()
const { handleError } = useErrorHandler()
const { value } = useMediaQuery('(min-width: 320px)')
const { isSupported } = useScreenOrientation()
const documentVisible = useDocumentVisibility()

provide('isMobile', value)
provide('screenOrientation', isSupported)
provide('documentVisible', documentVisible)

shopStore.$subscribe(({ storeId }) => {
  if (storeId === 'shop') {
    shopStore.sessionCache = sessionCache.value
    shopStore.likedProducts = likedProducts.value

    // OPTIONAL: Activate Firebase as localstorage for user data
    // When the data changes in the store,
    // sync it with the Firestore directly
    // if (cookieSessionId) {
    //   const dbDocument = doc(db, 'user', cookieSessionId)
    //   setDoc(dbDocument, state.sessionCache)
    // }
  }
})

cartStore.$subscribe(({ storeId }) => {
  if (storeId === 'cart') {
    cartStore.sessionCache = sessionCache.value
  }
})

authenticationStore.$subscribe(({ storeId }, state) => {
  if (storeId === 'authentication') {
    // When we update the tokens in the store,
    // automatically update them in the cookies
    accessToken.value = state.accessToken
    refreshToken.value = state.refreshToken
  }
})

async function requestSessionId () {
  try {
    if (!cookieSessionId.value) {
      // TODO: Check typing for $client
      const response = await $client.post<{ token: string }>('/cart/session-id')
      cookieSessionId.value = response.data.token

      // OPTIONAL: Activate Firebase as localstorage for user data
      // Create an entry in the Firestore
      // const dbDocument = doc(db, 'user', response.data.token)  
      // await setDoc(dbDocument, baseSessionCacheData)
    }
  } catch (e) {
    handleError(e)
  }
}

onBeforeMount(async () => {
  // Populate the cache with the required data
  // before loading each page
  if (!sessionCache.value) {
    sessionCache.value = baseSessionCacheData
  }

  // Hook the data from the session to
  // the cache of the store
  if (!shopStore.sessionCache) {
    shopStore.sessionCache = sessionCache.value
  }

  if (!cartStore.sessionCache) {
    cartStore.sessionCache = sessionCache.value
  }
  
  // Load the default values that will be used for
  // authentication and for the user's profile inforamtion
  authenticationStore.accessToken = accessToken.value
  authenticationStore.refreshToken = refreshToken.value
  authenticationStore.profile = sessionCache.value.profile

  await requestSessionId()
})

// When the user first comes on the
// // platform, invite him to select
// // his preferred language
// onMounted(() => {
//   if (!sessionCache.value.language.selected) {
//     shopStore.showLanguageModal = true
//   }
// })
</script>
