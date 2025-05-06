<template>
  <section id="products-feed" class="my-10">
    <!-- Page Title -->
    <div id="feed-title" class="px-10">
      <TailCard class="shadow-none border-none p-1">
        <TailCardContent class="flex flex-row justify-start">
          <h1 class="uppercase font-bold text-2xl">
            {{ id }}
          </h1>
        </TailCardContent>
      </TailCard>
    </div>

    <!-- Feed -->
    <Suspense>
      <AsyncProductsFeed @products-loaded="handleLoadedProducts" />

      <template #fallback>
        <ProductsLoadingFeed />
      </template>
    </Suspense>

    <ClientOnly>
      <ModalsProductFilters v-model="showProductFilters" :count="productCount" @update-products="handleUpdateProducts" @products-filter="() => showProductFilters=true" />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { Product } from '~/types'

const AsyncProductsFeed = defineAsyncComponent({
  loader: async () => import('~/components/products/Feed.vue')
})

const showProductFilters = ref<boolean>(true)
const productsLoading = ref<boolean>(true)
const products = ref<Product[]>([])

const { t } = useI18n()
const { id } = useRoute().params

provide('productsLoading', productsLoading)

useHead({
  title: useChangeCase(id as string, 'capitalCase'),
  meta: [
    {
      key: 'description',
      content: t('Découvrez toutes notre collection de vêtements')
    }
  ]
})

const productCount = computed(() => {
  if (products.value) {
    return products.value.length
  } else {
    return 0
  }
})

/**
 * Callback function used to set the products loaded
 * in the async component feed back to here
 * 
 * @param data The product to use
 */
function handleLoadedProducts(data: Product[]) {
  productsLoading.value = false
  products.value = data
}

/**
 * Returns a list of products based on the filters
 * that were provided by the user
 * 
 * @param data The filtered products
 */
function handleUpdateProducts(data: Product[]) {
  console.log(data)
}
</script>
