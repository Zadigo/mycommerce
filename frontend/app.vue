<template>
  <v-app>
    <NuxtLoadingIndicator />
    
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Modals -->
    <ModalsLanguage />
  </v-app>
</template>

<script lang="ts" setup>
import { useMediaQuery, useScreenOrientation, useDocumentVisibility, useSessionStorage } from '@vueuse/core'
import type { CartUpdateAPIResponse, Profile } from '~/types';

const profile = useSessionStorage<Profile>('profile', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const cart = useSessionStorage<CartUpdateAPIResponse>('cart', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const currentLanguage = useSessionStorage<'en' | 'fr' | 'es'>('language', null)

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

// watch(currentLanguage, (newValue) => {
//   if (newValue) {
//     i18n.locale.value = newValue
//   }
// }, {
//   immediate: true
// })

// TODO: Use cookie or session?
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
  authenticationStore.accessToken = accessToken.value
  authenticationStore.refreshToken = refreshToken.value
  authenticationStore.profile = profile.value
  cartStore.cache = cart.value
  await requestSessionId()
})

// TODO: Open the language modal when the user first
// lands on the page. Problem is we have to sync it
// with the session/cookie 
// onMounted(() => {
//   if (!currentLanguage.value) {
//     shopStore.showLanguageModal = true
//   }
// })
</script>
