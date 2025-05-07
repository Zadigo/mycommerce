<template>
  <TailSheet id="dialog-edit-product" v-model:open="showEditProductDrawer">
    <v-toolbar class="border-bottom" color="white">
      <v-btn variant="text" rounded @click="handleCloseProductEdition">
        <font-awesome icon="angle-left" />
      </v-btn>

      <v-toolbar-title>{{ $t('Modifier') }}</v-toolbar-title>
    </v-toolbar>

    <TailSheetContent v-if="currentEditedProduct">
      <div v-if="currentEditedProduct.product_info" class="row">
        <div class="col-12">
          <v-img :src="mediaPath(currentEditedProduct.product_info.product.get_main_image.original)" />
        </div>

        <div class="col-12">
          <div class="my-4">
            <p class="font-bold mb-1">
              {{ currentEditedProduct.product_info.price }}
              <!-- {{ $n(currentEditedProduct.product_info.price, 'currency') }} -->
            </p>
            <p>
              {{ currentEditedProduct.product_info.product.name }}
            </p>
          </div>

          <div class="my-4">
            <p class="font-bold">
              {{ $t('Couleur') }}
            </p>
            <p>
              {{ currentEditedProduct.product_info.product.color }}
            </p>
          </div>

          <div class="my-4">
            <p class="font-bold">
              {{ $t('Taille') }}
            </p>

            <div v-if="currentEditedProduct.product_info.product.has_sizes" class="flex gap-2">
              <ProductSizeButton v-for="size in currentEditedProduct.product_info.product.sizes" :key="size.id" :size="size" />
            </div>

            <p v-else class="font-light">
              {{ $t("Taille unique") }}
            </p>
          </div>

          <div class="my-4">
            <p class="font-bold">
              {{ $t('Quantité') }}
            </p>
            
            <TailInput v-model="currentEditedProduct.quantity" type="number" class="w-[2/4]" min="1" max="999" />
          </div>

          <TailButton class="w-full" @click="handleCloseProductEdition">
            {{ $t('Enregistrer') }}
          </TailButton>
        </div>
      </div>

      <ModalsSkeletonLoader v-else class="mt-4" />
    </TailSheetContent>
    
    <TailSheetContent v-else>
      <ModalsSkeletonLoader class="mt-4" />
    </TailSheetContent>
  </TailSheet>
</template>

<script setup lang="ts">
import type { ProductToEdit } from '~/types'

const cartStore = useCart()
const { showEditProductDrawer, showCartDrawer } = storeToRefs(cartStore)
const { mediaPath } = useDjangoUtilies()

const currentEditedProduct = inject<ProductToEdit>('currentEditedProduct')

/**
 * Closes the modal that edits a given product
 */
function handleCloseProductEdition() {
  showEditProductDrawer.value = false
  showCartDrawer.value = true
}
</script>
