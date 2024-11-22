<template>
  <div>
    <h1>Cart - Index</h1>

    <NuxtLink to="/cart/shipment/">
      Shipment
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
const { stripe } = useClientStripe()

definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth']
})

useHead({
  title: 'Cart'
})

watch(stripe, async () => {
  console.log(stripe.value)
  if (stripe.value) {
    const { clientSecret, error } = $fetch<{ clientSecret: string, error: string | null}>('/api/payment', {
      method: 'GET'
    })

    if (error) {
      return
    }

    console.log(clientSecret, error)
  }
})
</script>
