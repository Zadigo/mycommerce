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

    <dev-only>
      <div class="fixed top-1/12 right-5 bg-white rounded-lg shadow-lg p-4 z-50 w-100 space-y-5">
        <p class="font-bold">Website data</p>
        <p>{{ writeableSession }}</p>
        <p>{{ cartSession }}</p>
        <p>Cart: {{ cart }}</p>
        <p>session: {{ sessionId }}</p>
        <p>Cart session: {{ cartSessionId }}</p>
      </div>
    </dev-only>
  </section>
</template>

<script lang="ts" setup>
const showWhatsAppModal = ref<boolean>(false)

const { writeableSession, sessionId } = useSession()
const { cartSession, cart, cartSessionId } = useCartComposable()
</script>
