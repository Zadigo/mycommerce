<template>
  <section id="shop" class="position-relative">
    <!-- Navbar -->
    <BaseNavbar />

    <div class="container-fluid">
      <slot />

      <!-- Modals -->
      <ModalsLogin />
      <ModalsCart @edit-product="handleProductEdition" />
      <ModalsAddedProduct />
      <ModalsEditProduct />
    </div>

    <!-- Footer -->
    <BaseFooter />
  </section>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import type { CartUpdateAPIResponse, ProductToEdit } from '~/types';

const cartStore = useCart()
const { showCartDrawer, showEditProductDrawer } = storeToRefs(cartStore)
const currentEditedProduct = ref<ProductToEdit>()

provide('currentEditedProduct', currentEditedProduct)

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

function handleProductEdition (data: ProductToEdit) {
  if (data) {
    currentEditedProduct.value = data
    showCartDrawer.value = false
    showEditProductDrawer.value = true
  }
}

onMounted(() => {
  cartStore.cache = cart.value
})
</script>
