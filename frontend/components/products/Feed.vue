<template>
  <ProductsFeedLayout>
    <!-- Filters -->
    <template #filtering>
      <ProductsFeedHeader :products="products" :count="totalProductCount" @update:grid-size="handleGridSize" @show-product-filters="showProductFilters=true" />
    </template>

    <!-- Products -->
    <template v-if="products.length > 0" #default>
      <ProductsIterator :products="products" :columns="currentGridSize" @has-navigated="handleNavigation" />

      <ClientOnly>
        <!-- Modals -->
        <Teleport to="body">
          <ModalsProductFilters v-model="showProductFilters" :count="productCount" @update-query="requestFilteredProducts" />
        </Teleport>
      </ClientOnly>
    </template>
    
    <template v-else #default>
      <div class="col-6 offset-md-3 text-center p-5 my-5">
        <p class="h4 fw-light">
          {{ $t('Page not available text') }}
        </p>

        <NuxtLink to="/shop/collection/all" class="mt-3" color="secondary" variant="tonal" rounded @click="resetQuery">
          {{ $t('Voir toute la collection') }}
        </NuxtLink>
      </div>
    </template>

    <template #intersect>
      <!-- Intersect -->
      <ClientOnly>
        <div v-if="products.length > 0" id="product-pagination" ref="intersectionTarget" class="fw-bold text-uppercase d-flex justify-content-center mt-5">
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
      </ClientOnly>    
    </template>

  </ProductsFeedLayout>
</template>

<script setup lang="ts">
import { useIntersectionObserver, useLocalStorage  } from '@vueuse/core'
import type { Product, ProductsAPIResponse, ProductsQuery, SelectedFilters } from '~/types';

const emit = defineEmits({
  'products-loaded' (_data: Product[]) {
    return true
  }
})

const route = useRoute()
const { id } = route.params
const currentGridSize = useLocalStorage('grid', 3)

// const { gtag } = useGtag()
const { handleError } = useErrorHandler()

const isLoadingMoreProducts = ref(false)
const products = ref<Product[]>([])
const cachedResponse = ref<ProductsAPIResponse>()

const intersectionTarget = ref<HTMLElement | null>(null)

const showProductFilters = ref(false)

const query = ref<ProductsQuery>({
  sorted_by: 'New',
  typology: '',
  colors: '',
  sizes: '',
  price: null,
  offset: 0
})

// TODO: Add a provide so that all the components have access
// to the products from this parent component

const { data, status, error, refresh } = await useFetch<ProductsAPIResponse>(`/api/collections/${id}`, {
  method: 'GET',
  query,
  onRequest() {
    isLoadingMoreProducts.value = true
  },
  onResponseError({ error }) {
    // gtag('event', 'exception', {
    //   fatal: true, 
    //   description: error?.message
    // })
  },
  transform: (data) => {
    cachedResponse.value = data
    
    // TODO: Use the schema ValidateProduct from zod to unify the typing for Product
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
        
    products.value.push(...data.results)
    // products.value = validItems
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

const isEndOfPage = computed(() => {
  return cachedResponse.value?.next === null
})

const productCount = computed(() => {
  if (products.value) {
    return products.value.length
  } else {
    return 0
  }
})

// Provides the total product count for all children
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

function resetQuery() {
  query.value = {
    sorted_by: 'New',
    typology: '',
    colors: '',
    sizes: '',
    price: null,
    offset: 0
  }
}

/**
 * This is the main pagination function that is
 * used to load more products on the page when
 * the trigger section is reached
 */
async function requestOffsetProducts(offset: number) {
  query.value.offset = offset
  refresh()
}

/**
 * A pagination function that considers additional
 * queries that were passed by the user via the 
 * select filters panel
 */
async function requestFilteredProducts(newQuery: SelectedFilters) {
  query.value.colors = newQuery.colors.join(',')
  query.value.sizes = newQuery.sizes.join(',')
  query.value.typology = newQuery.typology.join(',')
  query.value.price = newQuery.price
  query.value.sorted_by = newQuery.sorted_by
  await requestOffsetProducts(34)
}

/**
 * Main logic that loads more products into the feed once
 * the user has reached the limit of the intersection 
 */
useIntersectionObserver(intersectionTarget, ([{ isIntersecting }]) => {
  if (isIntersecting && cachedResponse.value?.next) {
    requestOffsetProducts(cachedResponse.value.next)
    isLoadingMoreProducts.value = false
  }
}, {})
</script>
