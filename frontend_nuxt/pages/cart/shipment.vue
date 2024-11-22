<template>
  <div>
    <h1>Cart - Shipment</h1>

    <NuxtLink to="/cart/payment/">
      Payment
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth']
})

useHead({
  title: 'Cart'
})
</script>
