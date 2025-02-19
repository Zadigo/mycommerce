<template>
  <section id="products" class="mb-5" style="margin-top: 59px;">
    <div class="row">
      <!-- Page Title -->
      <div class="col-12">
        <div class="card shadow-none">
          <div class="card-body pb-1 d-flex flex-row justify-content-start">
            <h1 :aria-labelledby="id" class="text-uppercase fw-bold h4">
              {{ id }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Feed -->
      <div class="col-12">
        <Suspense>
          <AsyncProductsFeed @products-loaded="handleLoadedProducts" />

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
