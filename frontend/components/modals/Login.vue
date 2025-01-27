
<template>
  <v-navigation-drawer v-model="shouldShowLoginDrawer" width="400" location="right" sticky temporary @close="handleReset">
    <div class="container">
      <v-btn variant="plain" class="mt-2" @click="handleReset">
        <font-awesome icon="chevron-left" />
      </v-btn>
    </div>

    <v-divider />
    
    <Transition name="opacity">
      <BlockSignup v-if="showSignup" @authenticate="handleAuthenticateCart" />
      <BlockLogin v-else @show-signup="showSignup=true" @authenticate="handleAuthenticateCart" />
    </Transition>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core'

const route = useRoute()
const authStore = useAuthentication()
const authenticatedCart = useSessionStorage('authenticated_cart', false)
const sessionId = useCookie('session_id')

const { $client } = useNuxtApp()
const { handleError } = useErrorHandler()
const { showLoginDrawer } = storeToRefs(authStore)

const showSignup = ref(false)

/**
 * Indicates whether the login modal should open
 * based on a parameter present in the url -; or, uses
 * `showLoginDrawer` to manipulate the modal
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
 * When the user has added a set of products to his
 * cart when he was not logged in, this function will
 * get called in order to attribute all the products
 * to his authenticated account once he logs in  
 */
async function handleAuthenticateCart () {
  try {
    if (authenticatedCart.value) {
      await $client.post('cart/authenticate', {
        session_id: sessionId.value
      })
    }
  } catch (e) {
    handleError(e)
  }
}

function handleReset() {
  showLoginDrawer.value = false
  setTimeout(() => {
    showSignup.value = false
  }, 1000);
}
</script>
