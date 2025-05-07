<template>
  <ProductsFeedLayout>
    <!-- Filters -->
    <template #filtering>
      <ProductsFeedHeader :products="products" :count="totalProductCount" @update:grid-size="handleGridSize" @product-filters="emit('products-filter')" />
    </template>

    <!-- Products -->
    <template v-if="products.length > 0" #default>
      <ProductsIterator :products="products" :columns="currentGridSize" @has-navigated="handleNavigation" />
    </template>
    
    <template v-else #default>
      <div class="mx-auto text-center font-light text-2xl max-w-3xl p-10 my-10">
        <p class="h4 fw-light">
          {{ $t('Page not available text') }}
        </p>

        <TailButton variant="default" size="lg" as-child>
          <NuxtLinkLocale  id="link-collections-more" to="/shop/collection/all" class="mt-8" color="secondary" @click="query.offset=0">
            {{ $t('Voir toute la collection') }}
          </NuxtLinkLocale >
        </TailButton>
      </div>
    </template>

    <template #intersect>
      <!-- Intersect -->
      <ClientOnly>
        <div v-if="products.length > 0" id="product-pagination" ref="intersectionTarget" class="font-bold text-uppercase flex justify-content-center mt-5">
          <TailButton v-if="isEndOfPage" size="lg" @click="scrollToTop">
            <font-awesome icon="arrow-up" class="me-2" />
            {{ $t('Tu es arrivé à la fin') }}
          </TailButton>

          <div v-else class="flex-grow">
            <v-progress-circular v-if="isLoadingMoreProducts" :size="50" color="dark" indeterminate />

            <TailButton v-else size="lg">
              <font-awesome icon="arrow-down" class="me-2" />
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

const emit = defineEmits({
  'products-loaded' (_data: Product[]) {
    return true
  },
  'products-filter'() {
    return true
  }
})

const { id } = useRoute().params
const currentGridSize = useLocalStorage('grid', 3)

// const { gtag } = useGtag()
const { handleError } = useErrorHandler()

const isLoadingMoreProducts = ref(false)
const products = ref<Product[]>([])
const cachedResponse = ref<ProductsApiResponse>()

const intersectionTarget = ref<HTMLElement | null>(null)

const query = ref<ProductsQuery>({
  offset: 0
})

// TODO: Add a provide so that all the components have access
// to the products from this parent component

const { data, status, error, refresh } = await useFetch<ProductsApiResponse>(`/api/collections/${id}`, {
  method: 'GET',
  query: query.value,
  onResponseError({ error }) {
    // TODO: G-Analytics
    // gtag('event', 'exception', {
    //   fatal: true, 
    //   description: error?.message
    // })
    handleError(error)
  },
  transform(data) {
    cachedResponse.value = data
    
    // TODO: Use the schema ValidateProduct from zod to unify the typing for Product
    // const validItems = data.results.reduce<ValidateProduct[]>((acc, item) => {
    //   try {
    //     const product = ProductSchema.parse(item)
    //     acc.push(product)
    //     return acc
    //   } catch (e) {
    //     console.log('Failed to validate product:', e)
    //     return acc
    //   }
    // }, [])
        
    products.value.push(...data.results)
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

/**
 *  Provides the total product count for all children
 * since they do not have that information on load
 */
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

/**
 * Changes the size of the grid
 */
function handleGridSize(grid: number) {
  currentGridSize.value = grid
}

/**
 * This is the main pagination function that is
 * used to load more products on the page when
 * the trigger section is reached
 * 
 * @param offset The page to get
 */
async function requestOffsetProducts(offset: number) {
  query.value.offset = offset
  refresh()
}

/**
 * Main logic that loads more products into the feed once
 * the user has reached the limit of the intersection 
 */
useIntersectionObserver(intersectionTarget, ([{ isIntersecting }]) => {
  if (isIntersecting && cachedResponse.value?.next) {
    isLoadingMoreProducts.value = true
    requestOffsetProducts(cachedResponse.value.next)
    isLoadingMoreProducts.value = false
  }
}, {})
</script>
