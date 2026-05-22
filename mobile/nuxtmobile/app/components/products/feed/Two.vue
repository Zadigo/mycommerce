<template>
  <div class="grid grid-cols-2 gap-1">
    <products-feed-image v-for="product in products" :key="product.node.id" :image-src="product.node.mainImage.original" @click="setProduct(product)" />
  </div>
</template>

<script lang="ts" setup>
/**
 * Products
 */

const { products } = await useProductsStore()

/**
 * Product
 */

const { setProduct } = useDelayedProductDetailComposable()
</script>
