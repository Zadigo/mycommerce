<template>
  <ProductsFeedLayout>
    <template #filtering>
      <ProductsFeedHeader :products="products" :count="totalProductCount" @update:grid-size="handleGridSize" @show-product-filters="showProductFilters=true" />
    </template>

    <template #default>
      <!-- Products -->
      <ProductsIterator :products="products" :columns="currentGridSize" />

      <!-- Intersect -->
      <div ref="intersectionTarget" class="fw-bold text-uppercase d-flex justify-content-center mt-5">
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
      </div>
      
      <!-- Modals -->
      <ModalsProductFilters :show="showProductFilters" :count="products.length" @update-products="requestFilteredProducts" @close="showProductFilters=false" />
    </template>
  </ProductsFeedLayout>
</template>

<script lang="ts" setup>
import { useIntersectionObserver, watchArray  } from '@vueuse/core'
import { AxiosError } from 'axios';
import type { Product, ProductsAPIResponse } from '~/types';

// type Actions = 'sorted by' | 'typology' | 'colors' | 'sizes' | 'price'

const emit = defineEmits({
  'products-loaded' (_data: Product[]) {
    return true
  }
})

// const idbConnection = createConnection('e-commerce')
// const storage = useIDBStorage(idbConnection)
const route = useRoute()
const currentGridSize = ref(3)
const { $client } = useNuxtApp()
const { scrollToTop } = useUtilities()
const { builLimitOffset } = useDjangoUtilies()

const isLoadingMoreProducts = ref(false)
const offsetsList = ref<(string | number)[]>([])
const intersectionTarget = ref<HTMLElement | null>(null)
const showProductFilters = ref(false)
const cachedResponse = ref<ProductsAPIResponse>()
const products = ref<Product[]>([])

/**
 * TODO: 
 */
watchArray(products, () => {

})

const { data, status } = await useFetch<ProductsAPIResponse>(`/api/collections/${route.params.id}`, {
  method: 'GET',
  transform: (data) => {
    cachedResponse.value = data
    products.value = data.results
    return data
  }
})

if (status.value === 'success') {
  emit('products-loaded', products.value)
}

// const products = computed(() => {
//   return cachedResponse.value?.results ?? []
// })

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

// Provide the total product count for all children
// since they do not have that information on load
const totalProductCount = computed(() => {
  if (cachedResponse.value) {
    return cachedResponse.value.count
  } else {
    return 0
  }
})

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
    // instance.create(collectionUrlPath, response.data)
    // instance.create('products', products.value)
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // messagesStore.addNetworkError()
    }
  }
}

/**
 * A pagination function that considers additional
 * queries that were passed by the user 
 */
async function requestFilteredProducts(query: string) {
  await requestOffsetProducts(34, query, true)
}

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
