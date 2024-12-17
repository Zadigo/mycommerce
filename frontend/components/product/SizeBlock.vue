<template>
  <div v-if="sizes.length > 0" id="sizes" class="d-flex justify-content-start gap-1" aria-label="Product sizes">
    <ProductSizeButton v-for="size in sizes" :key="size.id" :size="size" :selected-size="selectedSize" @select-size="handleSizeSelection" />
  </div>

  <div v-else>
    <p class="fw-bold">
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

import type { ProductSizes } from '~/types';
import { useRefHistory } from '@vueuse/core';

defineProps({
  sizes: {
    type: Array as PropType<ProductSizes[]>,
    required: true,
    default: () => []
  }
})

const emit = defineEmits({
  'update-size' (_size: string | number | undefined) {
    return true
  }
})

const selectedSize = ref<string | number | undefined>()
useRefHistory(selectedSize)

/**
 * 
 */
function handleSizeSelection (size: string | number | undefined) {
  selectedSize.value = size
  emit('update-size', selectedSize.value)
}
</script>
