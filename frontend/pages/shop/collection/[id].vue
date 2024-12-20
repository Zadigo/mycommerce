<template>
  <section class="mb-5" style="margin-top: 59px;">
    <div class="row">
      <!-- Page Title -->
      <div class="col-12">
        <div class="card shadow-none">
          <div class="card-body pb-1 d-flex flex-row justify-content-start">
            <h1 :aria-labelledby="$route.params.id as string" class="text-uppercase fw-bold h4">
              {{ $route.params.id }}
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
// import { useScroll } from '@vueuse/core'
import type { Product } from '~/types'

const route = useRoute()

useHead({
  title: useChangeCase(route.params.id as string, 'capitalCase'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

// const { x } = useScroll(window, { behavior:'smooth' })

const productsLoading = ref(true)
const products = ref<Product[]>([])

const AsyncFeed = defineAsyncComponent({
  loader: async () => import('~/components/products/Feed.vue'),
  timeout: 10000
})

provide('productsLoading', productsLoading)

function handleLoadedProducts(data: Product[]) {
  productsLoading.value = false
  products.value = data
}
</script>
