<template>
  <section id="shop" class="relative">
    <!-- Navbar -->
    <base-navbar />

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

    <!-- Debug -->
    <website-data />
  </section>
</template>

<script lang="ts" setup>
const showWhatsAppModal = ref<boolean>(false)
</script>
