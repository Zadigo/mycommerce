<template>
  <products-feed-layout>
    <!-- Filters -->
    <template #filtering>
      <products-feed-header :count="totalProductCount" @modal:productFilters="emit('modal:product-filters')" />
    </template>

    <!-- Products -->
    <template v-if="totalProductCount > 0" #default>
      <products-iterator :columns="currentGridSize" @has-navigated="sendAnalytics" />
    </template>

    <template v-else #default>
      <div class="mx-auto text-center font-light text-2xl max-w-3xl p-10 my-10">
        <p class="font-light">
          {{ $t('Page not available text') }}
        </p>

        <tail-button size="lg" as-child>
          <nuxt-link-locale id="link-collections-more" to="/shop/collection/all" class="mt-8" @click="query.offset=0">
            {{ $t('Voir toute la collection') }}
          </nuxt-link-locale>
        </tail-button>
      </div>
    </template>

    <template #intersect>
      <!-- Intersect -->
      <ClientOnly>
        <div v-if="totalProductCount > 0" id="product-pagination" ref="intersectionTarget" class="font-bold text-uppercase flex justify-center mt-5">
          <tail-button v-if="isEndOfPage" id="scroll-top" size="lg" @click="scrollToTop">
            <Icon name="i-fa7-solid:arrow-up" class="me-2" />
            {{ $t('Tu es arrivé à la fin') }}
          </tail-button>

          <div v-else class="flex-grow">
            <p v-if="isLoadingMoreProducts">Loading...</p>

            <tail-button v-else id="load-more" size="lg">
              <Icon name="arrow-down" class="me-2" />
              {{ $t('Voir plus de produits') }}
            </tail-button>
          </div>
        </div>
      </ClientOnly>
    </template>
  </products-feed-layout>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { useProductNavigationAnalytics } from '~/composables/use/analytics'
import { useHandleGridSize } from '~/composables/use/grid'
import { productSymbol } from '~/data/constants/symbols'
import type { Product, ProductsApiResponse, ProductsQuery } from '~/types'

const emit = defineEmits<{ 'products:list': [products: Product[]], 'modal:product-filters': [] }>()

/**
 * Products
 */

const { id } = useRoute().params
const query = ref<Partial<ProductsQuery>>({ offset: 0 })
const { customHandleError } = useErrorHandler()

const { data: apiResponse, status, error, refresh } = await useFetch<ProductsApiResponse>(`/api/collections/${id}`, {
  method: 'GET',
  query: query.value,
  onResponseError({ error }) {
    // TODO: G-Analytics
    // gtag('event', 'exception', {
    //   fatal: true, 
    //   description: error?.message
    // })
    customHandleError(error)
  }
})

provide('productsLoading', ref<boolean>(status.value !== 'success'))

if (error.value) {
  throw createError({
    statusCode: 500,
    statusText: error.value.message
  })
}

const products = computed(() => isDefined(apiResponse.value) ? apiResponse.value.results : [])
const totalProductCount = computed(() => products.value.length)

whenever(() => status.value === 'success', () => {
  emit('products:list', products.value)
})

provide(productSymbol, products)

/**
 * Analytics
 */

const { sendAnalytics } = useProductNavigationAnalytics()

/**
 * Grid
 */

const { currentGridSize } = useHandleGridSize()

/**
 * Intersection
 */

const isLoadingMoreProducts = ref<boolean>(false)
const intersectionTarget = ref<HTMLElement | null>(null)

/**
 * Main logic that loads more products into the feed once
 * the user has reached the limit of the intersection 
 */
if (import.meta.client) {
  useIntersectionObserver(intersectionTarget, ([{ isIntersecting }]) => {
    if (isIntersecting && isDefined(apiResponse.value)) {
      isLoadingMoreProducts.value = true
      
      if (apiResponse.value.next !== null) {
        query.value.offset = apiResponse.value.next
        refresh()
      } else {
        console.error('Intersection does not have a next page')
      }

      isLoadingMoreProducts.value = false
    }
  }, {})
}

/**
 * Other
 */

const isEndOfPage = computed(() => apiResponse.value?.next === null)

console.log('products', products.value)
</script>
