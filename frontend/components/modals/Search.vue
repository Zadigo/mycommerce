<template>
  <TailDrawer id="dialog-search" v-model:open="shopStore.showSearchModal">
    <TailDrawerContent>
      <TailDrawerHeader>
        <!-- <TailDrawerClose as-child>
          <TailButton variant="outline" @click="shopStore.showSearchModal=false">
            <Icon name="fa-solid:window-close" />
          </TailButton>
        </TailDrawerClose> -->
      </TailDrawerHeader>
      
      <div class="w-7xl max-w-7xl mx-auto overflow-y-scroll my-10">
        {{ history }} {{ last }}

        <div class="relative w-full items-center mb-10">
          <TailInput id="search" v-model="search" :placeholder="$t('Ecris les produits à rechercher')" type="search" class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Icon name="fa-solid:search" />
          </span>
        </div>
        
        <div v-if="canShowSearch" class="row gx-1 gy-1">
          <!-- TODO: Gtag analytics to track product click from search @has-navigated -->
          <ProductsIterator :products="searchedProducts" />
        </div>
        
        <!-- Recommendations -->
        <Suspense v-else>
          <template #default>
            <AsyncRecommendations @has-navigated="shopStore.showSearchModal=false" />
          </template>
          
          <template #fallback>
            <div class="grid grid-cols-4 gap-2">
              <ProductsLoadingCards :quantity="8" />
            </div>
          </template>
        </Suspense>
      </div>
    </TailDrawerContent>
  </TailDrawer>
</template>

<script setup lang="ts">
import type { Product, ProductsApiResponse } from '~/types'

const AsyncRecommendations = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  suspensible: true,
  delay: 200,
  timeout: 10000
})

// const { gtag } = useGtag()
const shopStore = useShop()
const { $client } = useNuxtApp()
const { handleError } = useErrorHandler()

const searchedProducts = ref<Product[]>([])
const search = shallowRef<string>('')
const searchDebounced = refDebounced(search, 2000)
const { history, last } = useDebouncedRefHistory(search, { debounce: 5000 })

const canShowSearch = computed(() => {
  return searchedProducts.value.length > 0
})

/**
 * Function used to search the product's database
 */
async function requestProducts (): Promise<void> {
  if (search.value && search.value !== "") {
    const response = await $client<ProductsApiResponse>('/api/v1/shop/products', {
      params: {
        q: search.value
      },
      onRequestError({ error }) {
        handleError(error)
      }
    })
    searchedProducts.value = response.results
  }
}

// const { debounce } = useDebounce()
// const proxySearchProducts = debounce(requestProducts, 1000)

watch(searchDebounced, async () => {
  await requestProducts()
  
  // TODO: G-Analytics
  // gtag('event', 'search', { search_term: search.value })
})
</script>
