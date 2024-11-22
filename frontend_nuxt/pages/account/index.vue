<template>
  <div>
    <h1>Account - Home</h1>

    <NuxtLink to="/account/orders">
      Orders
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'account-layout',
  middleware: [
    'authentication'
  ]
})
</script>
