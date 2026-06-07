<template>
  <section id="shop" class="relative">
    <!-- Navbar -->
    <base-navbar />

    <slot />

    <!-- Modals -->
    <client-only>
      <lazy-modals-login hydrate-on-visible />
      <lazy-modals-cart hydrate-on-visible />
      <lazy-modals-added-product hydrate-on-visible />
      <lazy-modals-edit-product hydrate-on-visible />
      <lazy-modals-search hydrate-on-visible />
      <lazy-modals-whats-app v-model="showWhatsAppModal" hydrate-on-visible />
    </client-only>

    <!-- Footer -->
    <lazy-base-footer class="mt-40" hydrate-on-visible @show-whatsapp="showWhatsAppModal=true" />

    <!-- Debug -->
    <website-data />
  </section>
</template>

<script lang="ts" setup>
const showWhatsAppModal = ref<boolean>(false)
</script>
