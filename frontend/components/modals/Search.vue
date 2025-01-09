<template>
  <v-dialog id="dialog-search" v-model="shopStore.showSearchModal" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar>
        <v-spacer />
        <v-btn icon="mdi-close" @click="shopStore.showSearchModal = false" />
      </v-toolbar>

      <v-card-text>
        <div class="container">
          <div class="row g-1">
            <div class="col-12">
              <v-text-field v-model="search" type="Search" placeholder="Ecris les produits à rechercher" variant="outlined" @keypress="proxySearchProducts">
                <template #prepend>
                  <font-awesome icon="search" />
                </template>
              </v-text-field>
            </div>
            
            <div v-if="canShowSearch" class="row gx-1 gy-1">
              <ProductsIterator :products="searchedProducts" />
            </div>
            
            <!-- Recommendations -->
            <Suspense v-else>
              <template #default>
                <AsyncRecommendations />
              </template>
              
              <template #fallback>
                <BaseLoadingRecommendations :load-cache="true" />
              </template>
            </Suspense>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRefHistory } from '@vueuse/core'
import type { Product, ProductsAPIResponse } from '~/types'

const AsyncRecommendations = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue')
})

const shopStore = useShop()

function useSearchProducts () {
  const { gtag } = useGtag()
  const { $client } = useNuxtApp()
  const { handleError } = useErrorHandler()
  
  const searchedProducts = ref<Product[]>([])
  const search = ref<string | null>(null)
  
  const { last } = useRefHistory(search)

  const canShowSearch = computed(() => {
    return searchedProducts.value.length > 0
  })

  async function requestProducts () {
    try {
      if (search.value && search.value !== "") {
        const response = await $client.get<ProductsAPIResponse>('shop/products', {
          params: {
            q: search.value
          }
        })
        
        gtag('event', 'search', {
          search_term: search.value
        })

        searchedProducts.value = response.data.results
      }
    } catch (e) {
      handleError(e)
    }
  }

  if (shopStore.sessionCache) {
    shopStore.sessionCache.searchHistory = last
  }

  return {
    search,
    requestProducts,
    searchedProducts,
    canShowSearch,
    searchHistory: history
  }
}

const { search, canShowSearch, searchedProducts, requestProducts } = useSearchProducts()
const { debounce } = useDebounce()

const proxySearchProducts = debounce(requestProducts, 1000)
</script>
