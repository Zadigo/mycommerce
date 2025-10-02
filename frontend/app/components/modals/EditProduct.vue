<template>
  <volt-drawer id="dialog-edit-product" v-model:open="showEditProductDrawer">
    <div v-if="currentEditedProduct">
      <volt-button class="mb-2" @click="handleCloseProductEdition">
        <Icon name="i-fa7-solid:angle-left" />
      </volt-button>

      <h2 class="font-bold">{{ $t('Modifier') }}</h2>

      <div v-if="currentEditedProduct.product_info" class="row">
        <div class="col-12">
          <NuxtImg :src="mediaPath(currentEditedProduct.product_info.product.get_main_image.original)" />
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

            <volt-input-number v-model="currentEditedProduct.quantity" :min="1" :max="999" class="w-[2/4]" />
          </div>

          <volt-button class="w-full" @click="handleCloseProductEdition">
            {{ $t('Enregistrer') }}
          </volt-button>
        </div>
      </div>

      <ModalsSkeletonLoader v-else class="mt-4" />
    </div>

    <div v-else>
      <ModalsSkeletonLoader class="mt-4" />
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import type { ProductToEdit } from '~/types'

const cartStore = useCart()
const { showEditProductDrawer, showCartDrawer } = storeToRefs(cartStore)
const { mediaPath } = useDjangoUtilies()

// const currentEditedProduct = inject<ComputedRef<ProductToEdit>>('currentEditedProduct')
const currentEditedProduct = ref<ProductToEdit | null>(null)

/**
 * Closes the modal that edits a given product
 */
function handleCloseProductEdition() {
  showEditProductDrawer.value = false
  showCartDrawer.value = true
}
</script>
