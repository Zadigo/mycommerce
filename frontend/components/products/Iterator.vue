<template>
  <template v-if="products && products.length > 0">
    <div id="products" class="grid grid-cols-2 md:grid-cols-4 gap-2 px-1">
      <div v-for="(product, i) in products" id="product" :key="product.id">
        <ProductCardBase :index="i" :product="product" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" @has-navigated="handleNavigation" />
      </div>
    </div>
  </template>
  <ProductSkeletonLoader v-else :quantity="8" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Product } from '~/types';

defineProps({
  products: {
    type: Array as PropType<Product[] | null | undefined>,
    default: () => [],
    required: true
  },
  columns: {
    type: Number,
    default: 3
  },
  showLikeButton: {
    type: Boolean,
    default: true
  },
  showCart: {
    type: Boolean,
    default: true
  },
  showPrices: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits({
  /** 
   * This emit is used to indicate to parent components
   * hosting this component that a navigation occured. This
   * is useful for Google Analytics for example
   */
  'has-navigated'(_data: (number | Product)[]) {
    return true
  }
})

/**
 * Function used to indicate to the parent that an
 * item within this block has been clicked for navigation
 */
function handleNavigation(data: (number | Product)[]) {
  emit('has-navigated', data)
}
</script>
