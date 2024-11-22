<template>
  <div>
    <h1>Account - orders</h1>

    <NuxtLink to="/">
      Back to home
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'account-layout',
  middleware: [
    'auth'
  ]
})
</script>
