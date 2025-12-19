<template>
  <div v-if="product.node.hasSizes" id="sizes" class="flex justify-start gap-1" aria-label="Product sizes">
    <product-size-button v-for="size in product.node.sizeSet" :key="size.name" :size="size" :selected-size="userSelection.size" @select-size="(size) => { cartStore.sizeSelection(product, size) }" />
  </div>

  <div v-else>
    <p class="font-bold">
      {{ $t("Taille unique") }}
    </p>
  </div>
</template>

<script lang="ts" setup>
/**
 * Provides the correct section for the consumer on products
 * that require size selection (X, XS, S...) or information on 
 * the model that is carrying clothing
 */

import type { ClotheSizes, ProductNode } from '~/types'

defineProps<{ product: ProductNode }>()
const emit = defineEmits<{ 'update-size': [size: ClotheSizes] }>()

const cartStore = useCart()
const { userSelection } = storeToRefs(cartStore)
</script>
