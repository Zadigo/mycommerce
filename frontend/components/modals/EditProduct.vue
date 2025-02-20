<template>
  <v-navigation-drawer id="dialog-edit-product" v-model="showEditProductDrawer" location="right" width="400" temporary>
    <v-toolbar class="border-bottom" color="white">
      <v-btn variant="text" rounded @click="handleCloseProductEdition">
        <font-awesome icon="angle-left" />
      </v-btn>

      <v-toolbar-title>{{ $t('Modifier') }}</v-toolbar-title>
    </v-toolbar>

    <div v-if="currentEditedProduct" class="container my-5">
      <div v-if="currentEditedProduct.product_info" class="row">
        <div class="col-12">
          <v-img :src="mediaPath(currentEditedProduct.product_info.product.get_main_image.original)" />
        </div>

        <div class="col-12">
          <div class="my-4">
            <p class="fw-bold mb-1">
              {{ currentEditedProduct.product_info.price }}
              <!-- {{ $n(currentEditedProduct.product_info.price, 'currency') }} -->
            </p>
            <p>
              {{ currentEditedProduct.product_info.product.name }}
            </p>
          </div>

          <div class="my-4">
            <p class="fw-bold">
              {{ $t('Couleur') }}
            </p>
            <p>
              {{ currentEditedProduct.product_info.product.color }}
            </p>
          </div>

          <div class="my-4">
            <p class="fw-bold">
              {{ $t('Taille') }}
            </p>

            <div v-if="currentEditedProduct.product_info.product.has_sizes" class="d-flex gap-2">
              <!-- <v-btn v-for="i in 3" :key="i" color="primary" rounded>
                XS
              </v-btn> -->

              <ProductSizeButton v-for="size in currentEditedProduct.product_info.product.sizes" :key="size.id" :size="size" />
            </div>

            <p v-else class="fw-light">
              Taille unique
            </p>
          </div>

          <div class="my-4">
            <p class="fw-bold">
              {{ $t('Quantité') }}
            </p>
            
            <v-text-field v-model="currentEditedProduct.quantity" type="number" min="1" max="999" variant="outlined" style="width:50%;" />
          </div>

          <v-btn color="primary" block @click="handleCloseProductEdition">
            {{ $t('Enregistrer') }}
          </v-btn>
        </div>
      </div>

      <ModalsSkeletonLoader v-else class="mt-4" />
    </div>
    
    <div v-else class="container my-5">
      <ModalsSkeletonLoader class="mt-4" />
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { ProductToEdit } from '~/types';

const { showEditProductDrawer, showCartDrawer } = storeToRefs(useCart())
const { mediaPath } = useDjangoUtilies()

const currentEditedProduct = inject<ProductToEdit>('currentEditedProduct')

function handleCloseProductEdition () {
  showEditProductDrawer.value = false
  showCartDrawer.value = true
}
</script>
