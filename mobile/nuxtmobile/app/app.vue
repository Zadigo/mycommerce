<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<script lang="ts" setup>
import { provideSSRWidth } from '@vueuse/core'
import type { PaymentIntentApiResponse, Undefineable } from './types'

/**
 * Session
 */

const { create } = useCreateSession()

await create()

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

const { isSupported: screenOrientation } = useScreenOrientation()

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
  src: 'https://js.stripe.com/v3/',
  crossorigin: 'anonymous',
  tagPriority: 'high'
})
</script>
