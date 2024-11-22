<template>
  <div>
    <h1>Product</h1>

    <NuxtLink to="/cart/">
      Go to cart
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Product name',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
