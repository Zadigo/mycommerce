<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { useErrorHandler } from '@/composables/errors';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';
import { useCookies } from '@vueuse/integrations/useCookies';
// import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { onBeforeMount } from 'vue';
import { baseSessionCacheData } from './data';
import { useAxiosClient } from './plugins/client';
import { useAuthentication } from './stores/authentication';
import { useCart } from './stores/cart';
import { useShop } from './stores/shop';
import { SessionCacheData } from './types';

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
const authStore = useAuthentication()
const { handleError } = useErrorHandler()
const authenticationStore = useAuthentication()
const { get, set } = useCookies()
const { client } = useAxiosClient()

const cookieSessionId = get('sessionId')

// OPTIONAL: Activate Firebase as localstorage for user data
// const db = getFirestore()

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

authStore.$subscribe(({ storeId }, state) => {
  if (storeId === 'authentication') {
    // Only sync the data from the store if
    // there are actual values or this might
    // raise 401 errors since the store items
    // in the cookie would be undefined
    if (state.accessToken) {
      set('access', state.accessToken)
    }

    if (state.refreshToken) {
      set('refresh', state.refreshToken)
    }
  }
})

// Firestore
// const db = getFirestore()
// const document = doc(db, 'user', 'users')
// async function getUser() {
//   const snapshot = await getDoc(document)
//   if (snapshot.exists()) {
//     console.info('firebase', snapshot.data())
//   }
// }

// Firebase
// const db = getDatabase()
// const node = dbRef(db, 'user/123')
// console.info('firebase', db, node)
// async function getUser() {
//   const snapshot = await getFromDb(node)
//   if (snapshot.exists()) {
//     console.info('value from the database', snapshot.val())
//   }
// }
// getUser()

async function requestSessionId () {
  try {
    if (!cookieSessionId) {
      const response = await client.post<{ token: string }>('/cart/session-id')
      set('sessionId', response.data.token)

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
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap');
</style>
