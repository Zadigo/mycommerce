<template>
  <div class="grid grid-cols-3 gap-1">
    <template v-if="products">
      <products-feed-image v-for="product in products" :key="product.node.id" :image-src="product.node.mainImage.original" @click="emit('navigate', product)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Arrayable, ProductNode } from '~/types'

const { products } = defineProps<{ products?: Arrayable<ProductNode> }>()
const emit = defineEmits<{ navigate: [product: ProductNode] }>()
</script>
