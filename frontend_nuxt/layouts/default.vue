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

const store = useAuthentication()
const cartStore = useCart()

const accessToken = useCookie('access')
const refreshToken = useCookie('refresh')
const cart = useLocalStorage<CartUpdateAPIResponse>('cart', null, {
  serializer: {
    read: (data) => {
      return JSON.parse(data)
    }
  }
})

onMounted(() => {
  store.accessToken = accessToken.value
  store.refreshToken = refreshToken.value
  cartStore.cache = cart.value
})
</script>
