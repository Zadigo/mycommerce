<template>
  <products-feed-grid :products="products" @navigate="setProduct" />
</template>

<script lang="ts" setup>
import type { Product } from '~/types'

const products = inject<Product[]>('products', [])
const { setProduct } = useProductStore()

console.log(products)
</script>
