<template>
  <ProductsFeedLayout>
    <!-- Filters -->
    <template #filtering>
      <ProductsFeedHeader :products="products" :count="totalProductCount" @update:grid-size="handleGridSize" @product-filters="emit('products-filter')" />
    </template>

    <!-- Products -->
    <template v-if="totalProductCount > 0" #default>
      <ProductsIterator :products="products" :columns="currentGridSize" @has-navigated="sendAnalytics" />
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
import { useIntersectionObserver, useLocalStorage  } from '@vueuse/core'
import type { Product, ProductsApiResponse, ProductsQuery, SelectedFilters } from '~/types'

const emit = defineEmits<{ 'products-loaded': [data: Product[]], 'products-filter': [] }>()

const { id } = useRoute().params

// const { gtag } = useGtag()
const { customHandleError } = useErrorHandler()

const query = ref<ProductsQuery>({
  offset: 0
})

// TODO: Add a provide so that all the components have access
// to the products from this parent component

const { data: cachedResponse, status, error, refresh } = await useFetch<ProductsApiResponse>(`/api/collections/${id}`, {
  method: 'GET',
  query: query.value,
  onResponseError({ error }) {
    // TODO: G-Analytics
    // gtag('event', 'exception', {
    //   fatal: true, 
    //   description: error?.message
    // })
    customHandleError(error)
  },
  transform(data) {
    emit('products-loaded', data.results)
    return data
  }
})

provide('productsLoading', ref<boolean>(status.value !== 'success'))

if (error.value) {
  throw createError({
    statusCode: 500,
    statusText: error.value.message
  })
}

const products = computed(() => isDefined(cachedResponse.value) ? cachedResponse.value.results : [])
const totalProductCount = computed(() => products.value.length)

provide('products', products)

console.log('products', products.value)


function useProductNavigationAnalytics() {
  /**
   * Function that handles and routes navigation events
   * to Google Analytics
   * @param data The product that is being navigated to
   */
  function sendAnalytics(data: (number | Product)[] | null | undefined) {
    if (isDefined(data)) {
      const [id, product] = data

      if (isDefined(product)) {
        // TODO: G-Analytics
        // if (product && typeof product === 'object' && 'id' in product) {
        //   gtag('event',  'select_item',  {
        //     items: [
        //       {
        //         item_id: product.id,
        //         item_name: product.name,
        //         price: product.get_price,
        //         item_brand: null,
        //         item_category: product.category,
        //         index: data[0]
        //       }
        //     ],
        //     item_list_name: route.params.id,
        //     item_list_id: route.params.id,
        //     currency: 'EUR'
        //   })
        // }
      }
  
    }
  }

  return {
    sendAnalytics
  }
}

const { sendAnalytics } = useProductNavigationAnalytics()

/**
 * Grid
 */

/**
 * Composable to handle changes to the size of the grid
 */
function useHandleGridSize() {
  if (import.meta.server) {
    return {
      currentGridSize: ref<number>(3),
      handleGridSize: () => {}
    }
  }

  const currentGridSize = useLocalStorage('grid', 3)
  
  function handleGridSize(grid: number) {
    currentGridSize.value = grid
  }

  return {
    currentGridSize,
    handleGridSize
  }
}

const { currentGridSize, handleGridSize } = useHandleGridSize()

/**
 * This is the main pagination function that is
 * used to load more products on the page when
 * the trigger section is reached
 * @param offset The page to get
 */
async function requestOffsetProducts(offset: number) {
  query.value.offset = offset
  refresh()
}

/**
 * Intersection
 */

const isEndOfPage = computed(() => cachedResponse.value?.next === null)

const isLoadingMoreProducts = ref<boolean>(false)
const intersectionTarget = ref<HTMLElement | null>(null)

/**
 * Main logic that loads more products into the feed once
 * the user has reached the limit of the intersection 
 * @todo Protect by running this ONLY on client side
 */
if (import.meta.client) {
  useIntersectionObserver(intersectionTarget, ([{ isIntersecting }]) => {
    if (isIntersecting && cachedResponse.value?.next) {
      isLoadingMoreProducts.value = true
      requestOffsetProducts(cachedResponse.value.next)
      isLoadingMoreProducts.value = false
    }
  }, {})
}
</script>
