<template>
  <div>
    <h1>Products for the collection</h1>

    <div v-for="product in products" :key="product.id">
      <NuxtLink :to="`/shop/${product.id}`">
        {{ product.id }} - {{ product.name }} - {{ product.get_main_image }}
      </NuxtLink>
    </div>

    <NuxtLink :to="`/shop/1`">
      Go to product
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { ProductsAPIResponse } from '~/types';

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

const { data } = await useFetch<ProductsAPIResponse>(`/api/collections/${route.params.id}`, {
  method: 'GET',
  transform: (data) => {
    return data
  }
})
const products = computed(() => {
  return data.value?.results ?? []
})
</script>
