
<template>
  <volt-drawer v-model:visible="showLoginDrawer" position="right" @close="handleReset">
    <div class="flex justify-between align-center">
      <volt-button variant="destructive" @click="handleReset">
        <icon name="i-fa7-solid:chevron-left" />
      </volt-button>
    </div>
    
    <div class="mb-10 overflow-y-scroll">
      <Transition name="opacity">
        <block-signup v-if="showSignup" @authenticate="debouncedAuthenticateCart" />
        <block-login v-else @show-signup="showSignup=true" @authenticate="debouncedAuthenticateCart" />
      </Transition>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
const showSignup = ref<boolean>(false)
const showLoginDrawer = useState<boolean>('showLoginDrawer')

/**
 * Resets the login modal state:
 * - Immediately hides the login drawer.
 * - Clears the sign-up view after a 1-second delay.
 */
function handleReset() {
  if (showSignup.value) {
    showLoginDrawer.value = true
    showSignup.value = false
  } else {
    showLoginDrawer.value = false

    useTimeout(1000, {
      callback: () => {
        showSignup.value = false
      }
    })
  }
}

/**
 * Syncing
 */

const { sessionId } = useSession()
const { customHandleError } = useErrorHandler()
const { $client } = useNuxtApp()

// Syncs the unauthenticated cart to the authenticated user's account
// by calling an API endpoint with the current session ID
async function _handleAuthenticateCart() {
  const cartAuthenticated = useState<boolean>('authenticatedCart')

  if (!cartAuthenticated.value && isDefined(sessionId)) {
    await $client('/api/v1/cart/authenticate', {
      method: 'POST',
      body: {
        session_id: sessionId.value
      },
      onRequestError: (error) => {
        customHandleError(error)
      }
    })
  }
}

const debouncedAuthenticateCart = useDebounceFn(_handleAuthenticateCart, 5000)
</script>
