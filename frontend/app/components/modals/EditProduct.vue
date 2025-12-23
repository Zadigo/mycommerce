<template>
  <volt-drawer id="dialog-edit-product" v-model:open="showEditProductDrawer">
    <div v-if="editedCartItem">
      <volt-button class="mb-2" @click="handleCloseProductEdition">
        <icon name="i-fa7-solid:angle-left" />
      </volt-button>

      <h2 class="font-bold">{{ $t('Modifier') }}</h2>

      <div>
        <nuxt-img :src="editedCartItem.product.mainImage.original" :alt="editedCartItem.product.name" />

        <div class="my-4">
          <p class="font-bold mb-1">
            {{ editedCartItem.product.price }}
          </p>
          <p>
            {{ editedCartItem.product.name }}
          </p>
        </div>

        <div class="my-4">
          <p class="font-bold">
            {{ $t('Couleur') }}
          </p>
          <p>
            {{ editedCartItem.product.variant.name }}
          </p>
        </div>

        <div class="my-4">
          <p class="font-bold">
            {{ $t('Taille') }}
          </p>

          <div class="flex gap-2">
            <product-size-button v-for="size in editedCartItem.product.sizesSet" :key="size.id" :size="size" @select-size="handleSizeSelection" />
          </div>
        </div>

        <div class="my-4">
          <p class="font-bold">
            {{ $t('Quantité') }}
          </p>

          <volt-input-number v-model="editedCartItem.quantity" :min="1" :max="999" class="w-[2/4]" />
        </div>

        <volt-button class="w-full" @click="handleCloseProductEdition">
          {{ $t('Enregistrer') }}
        </volt-button>
      </div>
    </div>

    <div v-else>
      <modals-skeleton-loader class="mt-4" />
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import type { BaseSizeSet } from '~/types'

const { editedCartItem } = useEditCartItemStore()

const showEditProductDrawer = useState<boolean>('showEditProductDrawer')

/**
 * Closes the modal that edits a given product
 */
function handleCloseProductEdition() {
  showEditProductDrawer.value = false
  showCartDrawer.value = true
}

function handleSizeSelection(size: BaseSizeSet) {
  if (isDefined(editedCartItem)) {
    editedCartItem.value.size = size
  }
}
</script>
