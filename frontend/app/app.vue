<template>
  <nuxt-layout>
    <!-- Loader -->
    <nuxt-loading-indicator />
    
    <!-- Toaster -->
    <client-only>
      <toaster />
    </client-only>
    
    <!-- Main -->
    <nuxt-page />

    <!-- Modals -->
    <client-only>
      <modals-language />
      <modals-whats-app />
    </client-only>
  </nuxt-layout>
</template>

<script setup lang="ts">
useStorageSetup()
// Initialize user session management
// and global state
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
useState('authenticatedCart', () => false)

/**
 * Load Stripe.js
 */

useScript({
  async: true,
  src: 'https://js.stripe.com/v3/'
})
</script>
