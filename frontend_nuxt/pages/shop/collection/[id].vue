<template>
  <div>
    <h1>Products for the collection</h1>

    <NuxtLink :to="`/shop/1`">
      Go to product
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const route = useRoute()

useHead({
  title: useChangeCase(route.params.id, 'capitalCase'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
