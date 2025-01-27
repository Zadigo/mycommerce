<template>
  <VApp>
    <!-- Loader -->
    <NuxtLoadingIndicator />
    <Toaster />
    
    <!-- Main -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Modals -->
    <ModalsLanguage />
  </VApp>
</template>

<script lang="ts" setup>
import 'animate.css';

import { useDocumentVisibility, useLocalStorage, useMediaQuery, useScreenOrientation, useSessionStorage } from '@vueuse/core';
import { baseSessionCacheData } from '~/data';
import { Toaster } from 'vue-sonner'
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

// watch(currentLanguage, (newValue) => {
//   if (newValue) {
//     i18n.locale.value = newValue
//   }
// }, {
//   immediate: true
// })

// TODO: Use cookie or session? The session
// deletes the key which allows us to catch
// repeated connexions where as the cookie
// remembers single connexions
async function requestSessionId () {
  try {
    if (!cookieSessionId.value) {
      const response = await $client.post<{ token: string }>('/cart/session-id')
      cookieSessionId.value = response.data.token
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

  // Get the session ID token that we
  // will be using for the user adds
  // an item to his cart -; this is
  // is mainly for adding items to
  // the cart anonymously
  await requestSessionId()
})

// When the user first comes on the
// platform, invite him to select
// his preferred language
onMounted(() => {
  if (!sessionCache.value.language.selected) {
    shopStore.showLanguageModal = true
  }
})
</script>
