
<template>
  <TailSheet v-model:open="showLoginDrawer" @close="handleReset">
    <TailSheetContent>
      <TailSheetHeader>
        <TailSheetTitle />
      </TailSheetHeader>

      <TailSheetHeader>
       <div class="flex justify-between align-center">
          <TailButton variant="destructive" @click="handleReset">
            <Icon name="i-fa7-solid:chevron-left" />
          </TailButton>

          <TailSheetClose />
       </div>
      </TailSheetHeader>
      
      <div class="mb-10 overflow-y-scroll">
        <Transition name="opacity">
          <BlockSignup v-if="showSignup" @authenticate="debouncedAuthenticateCart" />
          <BlockLogin v-else @show-signup="showSignup=true" @authenticate="debouncedAuthenticateCart" />
        </Transition>
      </div>
    </TailSheetContent>    
  </TailSheet>
</template>

<script setup lang="ts">
const authStore = useAuthentication()
const sessionId = useCookie('sessionId', { sameSite: 'strict', secure: true })

const { debounce } = useDebounce()
const { $client } = useNuxtApp()
const { customHandleError } = useErrorHandler()

/**
 * Syncs the unauthenticated cart to the authenticated user's account
 * by calling an API endpoint with the current session ID
 */
async function handleAuthenticateCart() {
  if (!authStore.sessionCache.authenticatedCart) {
    await $client('/api/v1/cart/authenticate', {
      method: 'POST',
      body: {
        session_id: sessionId.value
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
