<template>
  <section id="shop" class="relative">
    <!-- Navbar -->
    <navbar-base />

    <slot />

    <!-- Modals -->
    <client-only>
      <!-- <ModalsLogin />
      <ModalsCart />
      <ModalsAddedProduct />
      <ModalsEditProduct />
      <ModalsSearch />
      <ModalsWhatsApp v-model="showWhatsAppModal" /> -->
    </client-only>

    <!-- Footer -->
    <base-footer class="mt-40" @show-whatsapp="showWhatsAppModal=true" />
  </section>
</template>

<script setup lang="ts">
const showWhatsAppModal = ref<boolean>(false)
</script>
