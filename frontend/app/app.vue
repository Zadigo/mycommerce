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
useUser()

/**
 * Provides global state to the app
 */

const isMobile = useMediaQuery('(min-width: 320px)').value
const { isSupported: screenOrientation } = useScreenOrientation()

provide('isMobile', isMobile)
provide('screenOrientation', screenOrientation)
provide('documentVisible', useDocumentVisibility())

/**
 * State
 */

useState('showSearchModal', () => false)
useState('showLanguageModal', () => false)
useState('showWhatsAppModal', () => false)
useState('showCartDrawer', () => false)
useState('showLoginDrawer', () => false)

/**
 * Load Stripe.js
 */

useScript({
  async: true,
  src: 'https://js.stripe.com/v3/'
})
</script>
