<template>
  <NuxtLayout>
    <!-- Loader -->
    <NuxtLoadingIndicator />
    
    <ClientOnly>
      <Toaster />
    </ClientOnly>
  
    <NuxtPage />

    <ClientOnly>
      <ModalsLanguage />
      <ModalsWhatsApp />
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import 'animate.css'

useStorageSetup()
useUserSession()
useAuthenticationTokens()

/**
 * Provides global state to the app
 */

const isMmobile = useMediaQuery('(min-width: 320px)').value
const { isSupported: screenOrientation } = useScreenOrientation()

provide('isMobile', isMmobile)
provide('screenOrientation', screenOrientation)
provide('documentVisible', useDocumentVisibility())

useScript({
  async: true,
  src: 'https://js.stripe.com/v3/'
})
</script>
