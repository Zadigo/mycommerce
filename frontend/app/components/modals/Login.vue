
<template>
  <tail-sheet v-model:open="showLoginDrawer" @close="handleReset">
    <tail-sheet-content>
      <tail-sheet-header>
        <tail-sheet-title />
      </tail-sheet-header>

      <tail-sheet-header>
       <div class="flex justify-between align-center">
          <tail-button variant="destructive" @click="handleReset">
            <Icon name="i-fa7-solid:chevron-left" />
          </tail-button>

          <tail-sheet-close />
       </div>
      </tail-sheet-header>
      
      <div class="mb-10 overflow-y-scroll">
        <Transition name="opacity">
          <BlockSignup v-if="showSignup" @authenticate="debouncedAuthenticateCart" />
          <BlockLogin v-else @show-signup="showSignup=true" @authenticate="debouncedAuthenticateCart" />
        </Transition>
      </div>
    </tail-sheet-content>
  </tail-sheet>
</template>

<script setup lang="ts">
const sessionId = useCookie('sessionId', { sameSite: 'strict', secure: true })

const { debounce } = useDebounce()
const { $client } = useNuxtApp()
const { customHandleError } = useErrorHandler()


const { djangoSessionId } = useDjangoSession() // Ensure session storage is initialized

/**
 * Syncs the unauthenticated cart to the authenticated user's account
 * by calling an API endpoint with the current session ID
 */
async function handleAuthenticateCart() {
  const cartAuthenticated = useState<boolean>('authenticatedCart')

  if (!cartAuthenticated.value && isDefined(djangoSessionId)) {
    await $client('/api/v1/cart/authenticate', {
      method: 'POST',
      body: {
        session_id: djangoSessionId.value
      },
      onRequestError: (error) => {
        customHandleError(error)
      }
    })
  }
}

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
    
    setTimeout(() => {
      showSignup.value = false
    }, 1000)
  }
}

const debouncedAuthenticateCart = debounce(handleAuthenticateCart, 5000)
</script>
