<template>
  <section id="shop" class="relative">
    <!-- Navbar -->
    <NavbarBase />

    <slot />

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
    <ClientOnly>
      <BaseFooter :items="footerLinks" class="mt-40" @show-whatsapp="showWhatsAppModal=true" />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { footerLinks } from '~/data/footer'
import type { ProductToEdit } from '~/types';

const cartStore = useCart()
const { showCartDrawer, showEditProductDrawer } = storeToRefs(cartStore)

const currentEditedProduct = ref<ProductToEdit>()
const showWhatsAppModal = ref(false)

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
