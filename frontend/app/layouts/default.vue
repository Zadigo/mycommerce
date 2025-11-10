<template>
  <section id="shop" class="relative">
    <!-- Navbar -->
    <NavbarBase />

    <slot />

    <!-- Modals -->
    <client-only>
      <ModalsLogin />
      <ModalsCart />
      <ModalsAddedProduct />
      <ModalsEditProduct />
      <ModalsSearch />
      <ModalsWhatsApp v-model="showWhatsAppModal" />
    </client-only>

    <!-- Footer -->
    <client-only>
      <base-footer class="mt-40" @show-whatsapp="showWhatsAppModal=true" />
    </client-only>
  </section>
</template>

<script setup lang="ts">
import type { ProductToEdit } from '~/types'

const cartStore = useCart()
const { showCartDrawer, showEditProductDrawer } = storeToRefs(cartStore)

const currentEditedProduct = ref<ProductToEdit>()
const showWhatsAppModal = ref<boolean>(false)

provide('currentEditedProduct', currentEditedProduct)

/**
 * 
 */
function handleProductEdition (data: ProductToEdit) {
  if (data) {
    currentEditedProduct.value = data
    showCartDrawer.value = false
    showEditProductDrawer.value = true
  }
}
</script>
