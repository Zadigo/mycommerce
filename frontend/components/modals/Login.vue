
<template>
  <v-navigation-drawer v-model="shouldShowLoginDrawer" width="400" location="right" sticky temporary @close="handleReset">
    <div class="container">
      <v-btn variant="plain" class="mt-2" @click="handleReset">
        <font-awesome icon="chevron-left" />
      </v-btn>
    </div>

    <v-divider />
    
    <Transition name="opacity">
      <BlockSignup v-if="showSignup" @authenticate="debouncedAuthenticateCart" />
      <BlockLogin v-else @show-signup="showSignup=true" @authenticate="debouncedAuthenticateCart" />
    </Transition>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const route = useRoute()
const authStore = useAuthentication()
const sessionId = useCookie('sessionId', { sameSite: 'strict', secure: true })

const { debounce } = useDebounce()
const { $client } = useNuxtApp()
const { handleError } = useErrorHandler()
const { showLoginDrawer } = storeToRefs(authStore)

const showSignup = ref(false)

/**
 * Computed property to control the login modal visibility.
 * If the URL query parameter `login` equals '0', the modal will open.
 * Otherwise, it defaults to the store’s value
 */
const shouldShowLoginDrawer = computed<boolean>({
  get: () => {
    return route.query.login === '0' || showLoginDrawer.value
  },
  set: (value: boolean) => {
    showLoginDrawer.value = value
  }
})

/**
 * Syncs the unauthenticated cart to the authenticated user's account
 * by calling an API endpoint with the current session ID
 */
async function handleAuthenticateCart () {
  try {
    if (!authStore.sessionCache.authenticatedCart) {
      await $client.post('/api/v1/cart/authenticate', {
        session_id: sessionId.value
      })
    }
  } catch (e) {
    handleError(e)
  }
}

/**
 * Resets the login modal state:
 * - Immediately hides the login drawer.
 * - Clears the sign-up view after a 1-second delay.
 */
function handleReset() {
  showLoginDrawer.value = false
  
  setTimeout(() => {
    showSignup.value = false
  }, 1000)
}

const debouncedAuthenticateCart = debounce(handleAuthenticateCart, 5000)
</script>
