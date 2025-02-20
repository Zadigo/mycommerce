<template>
  <section id="shop" class="position-relative">
    <!-- Navbar -->
    <BaseNavbar />

    <div class="container-fluid">
      <slot />
    </div>

    <!-- Modals -->
    <ClientOnly>
      <ModalsLogin />
      <ModalsCart @edit-product="handleProductEdition" />
      <ModalsAddedProduct />
      <ModalsEditProduct />
      <ModalsSearch />
      <ModalsWhatsApp v-model="showWhatsAppModal" />
    </ClientOnly>

    <!-- Footer -->
    <BaseFooter @show-whatsapp="showWhatsAppModal=true" />
  </section>
</template>

<script setup lang="ts">
import type { ProductToEdit } from '~/types';

const cartStore = useCart()
const { showCartDrawer, showEditProductDrawer } = storeToRefs(cartStore)

const currentEditedProduct = ref<ProductToEdit>()
const showWhatsAppModal = ref(false)

provide('currentEditedProduct', currentEditedProduct)

function handleProductEdition (data: ProductToEdit) {
  if (data) {
    currentEditedProduct.value = data
    showCartDrawer.value = false
    showEditProductDrawer.value = true
  }
}
</script>
