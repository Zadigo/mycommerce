<template>
  <div v-for="(product, i) in products" id="product" :key="product.id" :class="gridClass">
    <ProductCard :index="i" :product="product" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" @has-navigated="handleNavigation" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Product } from '~/types';

const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
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
  'has-navigated'(_data: (number | Product)[] | null | undefined) {
    return true
  }
})

const gridClass = computed(() => {
  return {
    [`col-md-${props.columns} col-sm-6`]: true
  }
})

function handleNavigation(data: (number | Product)[] | null | undefined) {
  emit('has-navigated', data)
}
</script>
