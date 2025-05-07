<template>
  <div v-if="sizes.length > 0" id="sizes" class="d-flex justify-content-start gap-1" aria-label="Product sizes">
    <ProductSizeButton v-for="size in sizes" :key="size.id" :size="size" :selected-size="selectedSize" @select-size="handleSizeSelection" />
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

import { useRefHistory } from '@vueuse/core'

import type { ProductSizes } from '~/types'
import type { DefaultClotheSize } from '~/data'

defineProps({
  sizes: {
    type: Array as PropType<ProductSizes[]>,
    required: true,
    default: () => []
  }
})

const emit = defineEmits({
  'update-size' (_size: DefaultClotheSize) {
    return true
  }
})

const selectedSize = ref<DefaultClotheSize>()
useRefHistory(selectedSize)

/**
 * 
 */
function handleSizeSelection (size: DefaultClotheSize) {
  selectedSize.value = size
  emit('update-size', selectedSize.value)
}

function resetSize () {
  selectedSize.value = null
}

defineExpose({
  resetSize
})
</script>
