<template>
  <!-- Main -->
  <VApp>
    <NuxtLayout>
      <!-- Loader -->
      <NuxtLoadingIndicator />
      <Toaster />
    
      <NuxtPage />
 
      <ClientOnly>
        <!-- Modals -->
        <ModalsLanguage />
      </ClientOnly>
    </NuxtLayout>
  </VApp>
</template>

<script setup lang="ts">
import 'animate.css';

// import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { Toaster } from 'vue-sonner';
import type { ExtendedLocationQuery } from './types';

useSchemaOrg([
  defineWebSite({
    potentialAction: [
      defineSearchAction({
        target: '/search?q={search}'
      })
    ]
  }),
  defineWebPage({
    '@type': ['CollectionPage', 'AboutPage', 'FAQPage']
  })
])

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

const route = useRoute()
const shopStore = useShop()
const authenticationStore = useAuthentication()

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

watch((): ExtendedLocationQuery => route.query, (newValue) => {
  if (newValue.login && newValue.login === '1') {
    authenticationStore.showLoginDrawer = true
  }
})

shopStore.$subscribe(({ storeId }) => {
  shopStore.likedProducts = likedProducts.value

  // OPTIONAL: Activate Firebase as localstorage for user data
  // When the data changes in the store,
  // sync it with the Firestore directly
  // if (cookieSessionId) {
  //   const dbDocument = doc(db, 'user', cookieSessionId)
  //   setDoc(dbDocument, state.sessionCache)
  // }
})

// cartStore.$subscribe(({ storeId }) => {
//   cartStore.sessionCache = sessionCache.value
// })

authenticationStore.$subscribe(({ storeId }, state) => {
  // When we update the tokens in the store,
  // automatically update them in the cookies
  accessToken.value = state.accessToken
  refreshToken.value = state.refreshToken
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
  // Load the default values that will be used for
  // authentication and for the user's profile inforamtion
  authenticationStore.accessToken = accessToken.value
  authenticationStore.refreshToken = refreshToken.value

  await requestSessionId()
})

// When the user first comes on the
// platform, invite him to select
// his preferred language
onMounted(() => {
  if (!shopStore.sessionCache.language.selected) {
    shopStore.showLanguageModal = true
  }
})
</script>
