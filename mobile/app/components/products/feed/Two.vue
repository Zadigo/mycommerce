<template>
  <div class="grid grid-cols-2 gap-2">
    <ion-img v-for="i in 100" :key="i" src="img1.jpg" @click="setProduct(products[i])" />
  </div>
</template>

<script lang="ts" setup>
const products = inject('products', () => [])
const { setProduct } = useProductStore()!

console.log(products)
</script>
