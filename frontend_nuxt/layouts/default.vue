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
import type { ProductToEdit } from '~/types';

const cartStore = useCart()
const { showCartDrawer, showEditProductDrawer } = storeToRefs(cartStore)
const currentEditedProduct = ref<ProductToEdit>()

provide('currentEditedProduct', currentEditedProduct)

function handleProductEdition (data: ProductToEdit) {
  if (data) {
    currentEditedProduct.value = data
    showCartDrawer.value = false
    showEditProductDrawer.value = true
  }
}
</script>
