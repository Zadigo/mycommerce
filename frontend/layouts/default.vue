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
      <ModalsAddedProduct />
      <ModalsEditProduct />
      <ModalsCart @edit-product="handleProductEdition" />
      <ModalsSearch />

      <!-- Modals -->
      <v-dialog v-model="showWhatsAppModal" width="400" transition="dialog-bottom-transition">
        <v-card>
          <v-card-text>
            <div class="text-center">
              <h6 claass="fw-bold mb-5">WhatsApp</h6>
              
              QR CODE

              <p class="text-small mt-5">Scanne ce code QR pour accéder à whatsapp à partir de ton téléphone</p>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </ClientOnly>

    <!-- Footer -->
    <BaseFooter @show-modal="showWhatsAppModal=true" />
  </section>
</template>

<script lang="ts" setup>
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
