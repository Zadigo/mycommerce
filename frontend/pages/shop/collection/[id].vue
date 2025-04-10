<template>
  <section id="products-feed" class="my-10">
    <!-- Page Title -->
    <div id="feed-title" class="px-10">
      <div class="card shadow-none">
        <div class="card-body pb-1 d-flex flex-row justify-start">
          <h1 :aria-labelledby="id" class="uppercase font-bold text-2xl">
            {{ id }}
          </h1>
        </div>
      </div>
    </div>

    <!-- Feed -->
    <Suspense>
      <AsyncProductsFeed @products-loaded="handleLoadedProducts" />

      <template #fallback>
        <ProductsLoadingFeed />
      </template>
    </Suspense>
  </section>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { Product } from '~/types'

const AsyncProductsFeed = defineAsyncComponent({
  loader: async () => import('~/components/products/Feed.vue')
})

const productsLoading = ref(true)
const products = ref<Product[]>([])

const { id } = useRoute().params

provide('productsLoading', productsLoading)

useHead({
  title: useChangeCase(id as string, 'capitalCase'),
  meta: [
    {
      key: 'description',
      content: 'Découvrez toutes notre collection de vêtements'
    }
  ]
})

/**
 * Callback function used to set the products loaded
 * in the async component feed back to here 
 */
function handleLoadedProducts(data: Product[]) {
  productsLoading.value = false
  products.value = data
}
</script>
