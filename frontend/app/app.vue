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
      <lazy-modals-whats-app />
    </client-only>
  </nuxt-layout>
</template>

<script setup lang="ts">
import { provideSSRWidth } from '@vueuse/core'
import type { PaymentIntentApiResponse, Undefineable } from './types'

/**
 * Session
 */

useSetupSession()

/**
 * Authentication
 */

useNuxtAuthentication()

/**
 * SSR
 */

provideSSRWidth(1280)

/**
 * Provides global state to the app
 */

const isMobile = useMediaQuery('(min-width: 320px)').value
const { isSupported: screenOrientation } = useScreenOrientation()

provide('isMobile', isMobile)
provide('screenOrientation', screenOrientation)
provide('documentVisible', useDocumentVisibility())

/**
 * State: Modals
 */

useState('showSearchModal', () => false)
useState('showLanguageModal', () => false)
useState('showWhatsAppModal', () => false)
useState('showCartDrawer', () => false)
useState('showLoginDrawer', () => false)
useState('authenticatedCart', () => false)
useState('showAddedProductDrawer', () => false)
useState('showEditProductDrawer', () => false)

/**
 * Other global setups
 */

useState<Undefineable<PaymentIntentApiResponse>>('paymentIntent', () => undefined)

/**
 * Load Stripe.js
 */

useScript({
  async: true,
  src: 'https://js.stripe.com/v3/'
})
</script>
