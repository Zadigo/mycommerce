<template>
  <ProductsFeedLayout>
    <!-- Filters -->
    <template #filtering>
      <ProductsFeedHeader :products="products" :count="totalProductCount" @update:grid-size="handleGridSize" @show-product-filters="showProductFilters=true" />
    </template>

    <!-- Products -->
    <template v-if="products.length > 0" #default>
      <!-- FIXME: Raises hydration error -->
      <ProductsIterator :products="products" :columns="currentGridSize" @has-navigated="handleNavigation" />

      <!-- Intersect -->
      <!-- <div v-if="products.length > 0" id="product-pagination" ref="intersectionTarget" class="fw-bold text-uppercase d-flex justify-content-center mt-5">
        <v-btn v-if="isEndOfPage" size="x-large" variant="tonal" rounded flat @click="scrollToTop">
          <font-awesome icon="arrow-up" class="me-2" />
          {{ $t('Tu es arrivé à la fin') }}
        </v-btn>

        <div v-else class="flex-grow">
          <v-progress-circular v-if="isLoadingMoreProducts" :size="50" color="dark" indeterminate />

          <v-btn v-else size="x-large" variant="tonal" rounded flat>
            <font-awesome icon="arrow-down" class="me-2" />
            {{ $t('Voir plus de produits') }}
          </v-btn>
        </div>
      </div> -->

      <!-- Modals -->
      <!-- <ClientOnly>
        <ModalsProductFilters v-model="showProductFilters" :count="productCount" @update-products="requestFilteredProducts" />
      </ClientOnly> -->
    </template>

    <template v-else #default>
      <div class="col-6 offset-md-3 text-center p-5 my-5">
        <p class="h4 fw-light">
          {{ $t('Page not available text') }}
        </p>

        <NuxtLink to="/shop/collection/all" class="mt-3" color="secondary" variant="tonal" rounded>
          {{ $t('Voir toute la collection') }}
        </NuxtLink>
      </div>
    </template>
  </ProductsFeedLayout>
</template>

<script setup lang="ts">
import { useIntersectionObserver, useLocalStorage  } from '@vueuse/core'
import type { Product, ProductsAPIResponse } from '~/types';

const emit = defineEmits({
  'products-loaded' (_data: Product[]) {
    return true
  }
})

const route = useRoute()
const { id } = route.params
const currentGridSize = useLocalStorage('grid', 3)

// const { gtag } = useGtag()
const { $client } = useNuxtApp()
const { builLimitOffset } = useDjangoUtilies()
const { handleError } = useErrorHandler()

const isLoadingMoreProducts = ref(false)
const products = ref<Product[]>([])
const cachedResponse = ref<ProductsAPIResponse>()

const offsetsList = ref<(string | number)[]>([])
const intersectionTarget = ref<HTMLElement | null>(null)

const showProductFilters = ref(false)

// TODO: Add a provide so that all the components have access
// to the products from this parent component

const { data, status, error, refresh } = await useFetch<ProductsAPIResponse>(`/api/collections/${id}`, {
  method: 'GET',
  onResponseError({ error }) {
    // gtag('event', 'exception', {
    //   fatal: true, 
    //   description: error?.message
    // })
  },
  transform: (data) => {
    cachedResponse.value = data
    
    // TODO: Validate products with Zod
    const validItems = data.results.reduce<ValidateProduct[]>((acc, item) => {
      try {
        const product = ProductSchema.parse(item)
        acc.push(product)
        return acc
      } catch (e) {
        console.log('Failed to validate product:', e)
        return acc
      }
    }, [])
    
    console.info('validItems', validItems)
    
    products.value = data.results
    emit('products-loaded', products.value)

    return data
  }
})

if (error.value) {
  throw createError({
    statusCode: 500,
    statusText: error.value.message
  })
}

const nextPageUrl = computed(() => {
  if (cachedResponse.value) {
    return cachedResponse.value.next
  } else {
    return ''
  }
})

const isEndOfPage = computed(() => {
  return (
    nextPageUrl.value === null ||
    nextPageUrl.value === ''
  )
})

const productCount = computed(() => {
  if (products.value) {
    return products.value.length
  } else {
    return 0
  }
})

// Provide the total product count for all children
// since they do not have that information on load
const totalProductCount = computed(() => {
  if (cachedResponse.value) {
    return cachedResponse.value.count
  } else {
    return 0
  }
})

function handleNavigation (data: (number | Product)[] | null | undefined) {
  if (data) {
    const product = data[1]

    if (product && typeof product === 'object' && 'id' in product) {
      // gtag('event',  'select_item',  {
      //   items: [
      //     {
      //       item_id: product.id,
      //       item_name: product.name,
      //       price: product.get_price,
      //       item_brand: null,
      //       item_category: product.category,
      //       index: data[0]
      //     }
      //   ],
      //   item_list_name: route.params.id,
      //   item_list_id: route.params.id,
      //   currency: 'EUR'
      // })
    }
  }
}

function handleGridSize(grid: number) {
  currentGridSize.value = grid
}

/**
 * This is the main pagination function that is
 * used to load more products on the page when
 * the trigger section is reached
 */
async function requestOffsetProducts(offset: string | number, query?: string | null, replace: boolean = false) {
  try {
    let collectionUrlPath = `${route.path.toString().replace('/shop/', '/')}?offset=${offset}`

    if (query) {
      collectionUrlPath += `&${query}`
    }
    
    const response = await $client.get<ProductsAPIResponse>(collectionUrlPath)

    // Save the the offsets that were already requested
    // to prevent getting the same offset multiple times
    const result = builLimitOffset(response.data.next)
    if (result) {
      offsetsList.value.push(result.offset)
    }

    cachedResponse.value = response.data
    
    if (replace) {
      products.value = response.data.results
    } else {
      products.value.push(...response.data.results)
    }
  } catch (e) {
    handleError(e)
  }
}

/**
 * A pagination function that considers additional
 * queries that were passed by the user 
 */
async function requestFilteredProducts(query: string) {
  await requestOffsetProducts(34, query, true)
}

/**
 * Main logic that loads more products into the feed once
 * the user has reached the limit of the intersection 
 */
useIntersectionObserver(intersectionTarget, ([{ isIntersecting }]) => {
  if (isIntersecting && nextPageUrl.value !== null) {
    const result = builLimitOffset(nextPageUrl.value)
    
    if (result) {
      isLoadingMoreProducts.value = isIntersecting
      requestOffsetProducts(result.offset)
      offsetsList.value.push(result.offset)
    } else {
      isLoadingMoreProducts.value = false
    }
  } else {
    isLoadingMoreProducts.value = false
  }
}, {})
</script>
