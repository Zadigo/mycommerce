<template>
  <v-navigation-drawer id="dialog-edit-product" v-model="showEditProductDrawer" location="right" width="400" temporary>
    <v-toolbar class="border-bottom" color="white">
      <v-btn variant="text" rounded @click="handleCloseProductEdition">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </v-btn>

      <v-toolbar-title>{{ $t('Modifier') }}</v-toolbar-title>
    </v-toolbar>

    <div v-if="currentEditedProduct" class="container my-5">
      <div class="row">
        <div class="col-12">
          <v-img :src="mediaPath(currentEditedProduct.product.get_main_image.original)" />
        </div>

        <div class="col-12">
          <div class="my-4">
            <p class="fw-bold mb-1">
              29.99€
            </p>

            <p>
              {{ currentEditedProduct.product.name }}
            </p>
          </div>

          <div class="my-4">
            <p class="fw-bold">
              {{ $t('Couleur') }}
            </p>
          </div>

          <div class="my-4">
            <p class="fw-bold">
              {{ $t('Taille') }}
            </p>

            <div class="d-flex gap-2">
              <v-btn v-for="i in 3" :key="i" color="primary" rounded>
                XS
              </v-btn>
            </div>
          </div>

          <div class="my-4">
            <p class="fw-bold">
              {{ $t('Quantité') }}
            </p>
            
            <v-text-field type="number" min="1" max="999" variant="outlined" style="width:50%;" />
          </div>

          <v-btn color="primary" block @click="handleCloseProductEdition">
            {{ $t('Enregistrer') }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const { showEditProductDrawer, showCartDrawer } = storeToRefs(useCart())
const { mediaPath } = useDjangoUtilies()

const currentEditedProduct = inject('currentEditedProduct')

function handleCloseProductEdition () {
  showEditProductDrawer.value = false
  showCartDrawer.value = true
}
</script>
