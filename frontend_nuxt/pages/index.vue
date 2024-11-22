<template>
  <div>
    <h1>Collections page</h1>

    <NuxtLink :to="`/shop/collection/all`">
      All products
    </NuxtLink>
    
    <NuxtLink to="/account/">
      Profile
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Collections',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
