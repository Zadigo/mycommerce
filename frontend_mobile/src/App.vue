<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { useErrorHandler } from '@/composables/errors';
import { Toast } from '@capacitor/toast';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';
import { useCookies } from '@vueuse/integrations/useCookies';
import { onBeforeMount } from 'vue';
import { baseSessionCacheData } from './data';
import { useAuthentication } from './stores/authentication';
import { useCart } from './stores/cart';
import { useShop } from './stores/shop';
import { SessionCacheData } from './types';
import { useAxiosClient } from './plugins/client';

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
const cartStore = useCart()
const { handleError } = useErrorHandler(Toast)
const authenticationStore = useAuthentication()
const { get, set } = useCookies(null, {
  autoUpdateDependencies: true
})
const { client } = useAxiosClient()

const cookieSessionId = get('sessionId')

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

async function requestSessionId () {
  try {
    if (!cookieSessionId) {
      const response = await client.post<{ token: string }>('/cart/session-id')
      set('sessionId', response.data.token)
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
  authenticationStore.accessToken = get('access')
  authenticationStore.refreshToken = get('refresh')
  authenticationStore.profile = sessionCache.value.profile

  // Get the session ID token that we
  // will be using for the user adds
  // an item to his cart -; this is
  // is mainly for adding items to
  // the cart anonymously
  await requestSessionId()
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
</style>
