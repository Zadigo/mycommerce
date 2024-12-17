<template>
  <div v-for="(product, i) in products" :key="product.id" :class="gridClass">
    <ProductCard :index="i" :product="product" :show-like-button="showLikeButton" :show-cart="showCart" :show-prices="showPrices" @navigate="handleNavigation" />
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

const emit = defineEmits({
  navigate(_data: (number | Product)[] | null | undefined) {
    return true
  }
})

const gridClass = computed(() => {
  return {
    [`col-md-${props.columns} col-sm-6`]: true
  }
})

function handleNavigation(data: (number | Product)[] | null | undefined) {
  emit('navigate', data)
}
</script>
