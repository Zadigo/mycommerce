<template>
  <div>
    <h1>Cart - Payment</h1>

    <NuxtLink to="/cart/success">
      Success
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'payment-layout'
})

useHead({
  title: 'Cart'
})
</script>
