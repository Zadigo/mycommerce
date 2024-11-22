<template>
  <div>
    <h1>Cart - Index</h1>

    <NuxtLink to="/cart/shipment/">
      Shipment
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
