<template>
  <div v-for="product in products" :key="product.id" :class="gridClass">
    <ProductCard :product="product" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" />
  </div>
  <!-- <TransitionGroup name="opacity">
  </TransitionGroup> -->
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

const gridClass = computed(() => {
  return {
    [`col-md-${props.columns} col-sm-6`]: true
  }
})
</script>
