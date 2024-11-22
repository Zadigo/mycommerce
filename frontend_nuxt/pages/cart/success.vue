<template>
  <div>
    <h1>Success</h1>

    <NuxtLink to="/">
      Back to home
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth']
})

useHead({
  title: 'Success'
})
</script>
