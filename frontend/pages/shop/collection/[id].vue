<template>
  <section id="products" class="mb-5" style="margin-top: 59px;">
    <div class="row">
      <!-- Page Title -->
      <div class="col-12">
        <div class="card shadow-none">
          <div class="card-body pb-1 d-flex flex-row justify-content-start">
            <h1 :aria-labelledby="route.params.id" class="text-uppercase fw-bold h4">
              {{ route.params.id }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Feed -->
      <div class="col-12">
        <Suspense>
          <template #default>
            <AsyncFeed @products-loaded="handleLoadedProducts" />
          </template>

          <template #fallback>
            <ProductsLoadingFeed />
          </template>
        </Suspense>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { Product } from '~/types'

const route = useRoute()

const productsLoading = ref(true)
const products = ref<Product[]>([])

provide('productsLoading', productsLoading)

useHead({
  title: useChangeCase(route.params.id as string, 'capitalCase'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const AsyncFeed = defineAsyncComponent({
  loader: async () => import('~/components/products/Feed.vue'),
  timeout: 10000
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
