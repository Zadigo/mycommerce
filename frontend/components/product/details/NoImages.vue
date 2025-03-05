<template>
  <div id="product-images" class="grid grid-cols-2 grid-rows-2 gap-1 col-span-8">
    <NuxtImg src="/placeholder.svg" :alt="product.name" class="w-full" />
    <NuxtImg src="/placeholder.svg" :alt="product.name" class="w-full" />
    <NuxtImg src="/placeholder.svg" :alt="product.name" class="w-full" />
    <NuxtImg src="/placeholder.svg" :alt="product.name" class="w-full" />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})
</script>
