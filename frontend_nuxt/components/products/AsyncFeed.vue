<template>
  <ProductsFeedLayout>
    <template #filtering>
    <ProductsFeedHeader :count="totalProductCount" @update:grid-size="handleGridSize"  @show-product-filters="showProductFilters=true" />
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

      <ModalsProductFilters :show="showProductFilters" @close="showProductFilters=false" />
    </template>
  </ProductsFeedLayout>
</template>

<script lang="ts" setup>
// import { useStorageAsync  } from '@vueuse/core'
import type { Product, ProductsAPIResponse } from '~/types';
const { scrollToTop } = useUtilities()

// type Actions = 'sorted by' | 'typology' | 'colors' | 'sizes' | 'price'

const emit = defineEmits({
  'products-loaded' (_data: Product[]) {
    return true
  }
})

const route = useRoute()
// const idbConnection = createConnection('e-commerce')
// const storage = useIDBStorage(idbConnection)
const currentGridSize = ref(3)

const isLoadingMoreProducts = ref(false)
const offsetsList = ref<string[]>([])
const intersectionTarget = ref<HTMLElement | null>(null)
const showProductFilters = ref(false)

// const cache = useStorageAsync(route.params.id as string, '', storage, {
//     deep: true,
//     initOnMounted: true,
//     onError: (e) => {
//       console.log('useStorageAsync [id].vue', e)
//     }
// })

// console.info('cache.value', cache.value)
// if (cache.value.length > 0) {
//   console.info('Get the products from the cache')
// }

const { data, status } = await useFetch<ProductsAPIResponse>(`/api/collections/${route.params.id}`, {
  method: 'GET',
  transform: (data) => {
    return data
  }
})

const products = computed(() => {
  return data.value?.results ?? []
})

const nextPageUrl = computed(() => {
  if (data.value) {
    return data.value.next
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
  if (data.value) {
    return data.value.count
  } else {
    return 0
  }
})

if (status.value === 'success') {
  emit('products-loaded', products.value)
}

function handleGridSize(grid: number) {
  currentGridSize.value = grid
}
</script>
