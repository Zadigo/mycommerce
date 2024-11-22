<template>
  <div>
    <BaseSkeleton v-if="!product" :loading="true" />
    <div v-else>
      <h1>Product: {{ product.name }}</h1>
      <NuxtImg :src="mediaPath(product.get_main_image?.original)" />
    </div>

    <NuxtLink to="/cart/">
      Go to cart
    </NuxtLink>

    <NuxtLink to="/wishlist/">
      Go to wishlist
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types';
import BaseSkeleton from '~/components/BaseSkeleton.vue';

const { mediaPath } = useDjangoUtilies()
const route = useRoute()

const { data } = await useFetch<Product>(`/api/products/${route.params.id}`, {
  method: 'GET'
})

const product = ref<Product>(data.value)

useHead({
  title: product.value.name,
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
