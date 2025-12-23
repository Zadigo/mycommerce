<template>
  <section id="shop" class="relative">
    <!-- Navbar -->
    <navbar-base />

    <slot />

    <!-- Modals -->
    <client-only>
      <modals-login />
      <modals-cart />
      <modals-added-product />
      <modals-edit-product />
      <modals-search />
      <modals-whats-app v-model="showWhatsAppModal" />
    </client-only>

    <!-- Footer -->
    <base-footer class="mt-40" @show-whatsapp="showWhatsAppModal=true" />

    <dev-only>
      <div class="fixed top-1/12 right-5 bg-white rounded-lg shadow-lg p-4 z-50 w-100 space-y-5">
        <p class="font-bold">Website data</p>
        <p>{{ cartSession }}</p>
        <p>Cart: {{ cart }}</p>
        <p>session: {{ sessionId }} ({{ isInitialized }})</p>
        <p>Cart session: {{ cartSessionId }}</p>
      </div>
    </dev-only>
  </section>
</template>

<script lang="ts" setup>
const showWhatsAppModal = ref<boolean>(false)

const { sessionId, isInitialized } = useSession()
const { cartSession, cart, cartSessionId } = useCartComposable()

/**
 * Modify Cart Item
 */

useEditCartItemComposable()
</script>
