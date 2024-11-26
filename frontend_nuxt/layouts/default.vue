<template>
  <section id="shop" class="position-relative">
    <!-- Navbar -->
    <BaseNavbar />

    <div class="container-fluid">
      <slot />

      <!-- Modals -->
      <ModalsLogin />
      <ModalsCart />
      <ModalsAddedProduct />
    </div>

    <!-- Footer -->
    <BaseFooter />
  </section>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import type { CartUpdateAPIResponse } from '~/types';

const cartStore = useCart()

const cart = useLocalStorage<CartUpdateAPIResponse>('cart', null, {
  serializer: {
    read: (data) => {
      return JSON.parse(data)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

onMounted(() => {
  cartStore.cache = cart.value
})
</script>
