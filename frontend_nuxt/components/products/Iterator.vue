<template>
  <TransitionGroup name="opacity">
    <div v-for="product in products" :key="product.id" :class="gridClass">
      <ProductCard :product="product" :show-like-button="showLikeButton" />
    </div>
  </TransitionGroup>
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
  }
})

const gridClass = computed(() => {
  return {
    [`col-md-${props.columns} col-sm-6`]: true
  }
})
</script>
