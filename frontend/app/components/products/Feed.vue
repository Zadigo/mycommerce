<template>
  <ProductsFeedLayout>
    <!-- Filters -->
    <template #filtering>
      <ProductsFeedHeader :count="totalProductCount" @modal:productFilters="emit('modal:product-filters')" />
    </template>

    <!-- Products -->
    <template v-if="totalProductCount > 0" #default>
      <ProductsIterator :columns="currentGridSize" @has-navigated="sendAnalytics" />
    </template>

    <template v-else #default>
      <div class="mx-auto text-center font-light text-2xl max-w-3xl p-10 my-10">
        <p class="font-light">
          {{ $t('Page not available text') }}
        </p>

        <TailButton size="lg" as-child>
          <NuxtLinkLocale id="link-collections-more" to="/shop/collection/all" class="mt-8" @click="query.offset=0">
            {{ $t('Voir toute la collection') }}
          </NuxtLinkLocale>
        </TailButton>
      </div>
    </template>

    <template #intersect>
      <!-- Intersect -->
      <ClientOnly>
        <div v-if="totalProductCount > 0" id="product-pagination" ref="intersectionTarget" class="font-bold text-uppercase flex justify-center mt-5">
          <TailButton v-if="isEndOfPage" id="scroll-top" size="lg" @click="scrollToTop">
            <Icon name="i-fa7-solid:arrow-up" class="me-2" />
            {{ $t('Tu es arrivé à la fin') }}
          </TailButton>

          <div v-else class="flex-grow">
            <p v-if="isLoadingMoreProducts">Loading...</p>

            <TailButton v-else id="load-more" size="lg">
              <Icon name="arrow-down" class="me-2" />
              {{ $t('Voir plus de produits') }}
            </TailButton>
          </div>
        </div>
      </ClientOnly>
    </template>
  </ProductsFeedLayout>
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

// const { gtag } = useGtag()

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

console.log('products', products.value)


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

const isEndOfPage = computed(() => apiResponse.value?.next === null)

const isLoadingMoreProducts = ref<boolean>(false)
const intersectionTarget = ref<HTMLElement | null>(null)

/**
 * This is the main pagination function that is
 * used to load more products on the page when
 * the trigger section is reached
 * @param offset The page to get
 * @todo No need to create this function. Run the logic directly inside useIntersectionObserver
 */
async function requestOffsetProducts(offset: number) {
  query.value.offset = offset
  refresh()
}

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
</script>
