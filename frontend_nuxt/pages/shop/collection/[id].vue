<template>
  <section class="section-margin-2">
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
        <!-- Products -->
        <Suspense>
          <template #default>
            <AsyncFeed @products-loaded="handleLoadedProducts" />
          </template>

          <template #fallback>
            <ProductsLoadingFeed />
          </template>
        </Suspense>
      </div>

      <div v-if="products.length === 0" class="col-6 offset-md-3 text-center p-5">
        <p class="h4 fw-light">
          {{ $t('Page not available text') }}
        </p>

        <NuxtLink to="/shop/collections/all" class="mt-3" color="secondary" variant="tonal" rounded>
          {{ $t('Voir toute la collection') }}
        </NuxtLink>
      </div>
    </div>

    <ModalsProductFilters :show="showProductFilters" @close="showProductFilters=false" />
  </section>
</template>

<script lang="ts" setup>
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { Product } from '~/types';

const route = useRoute()
const productsLoading = ref(true)
const products = ref<Product[]>([])
const showProductFilters = ref(true)

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
  loader: async () => import('@/components/products/AsyncFeed.vue')
})

function handleLoadedProducts(data: Product[]) {
  productsLoading.value = false
  products.value = data
}
</script>
