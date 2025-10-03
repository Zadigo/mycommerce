<template>
  <div class="grid grid-cols-2 gap-1">
    <products-feed-image v-for="product in products" :key="product.id" :image-src="product.get_main_image?.original" @click="setProduct(product)" />
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types'

const products = inject<Product[]>('products', [])
const { setProduct } = useProductStore()!

console.log(products)
</script>
