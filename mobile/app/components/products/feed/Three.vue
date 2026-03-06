<template>
  <products-feed-grid :products="products" @navigate="setProduct" />
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
