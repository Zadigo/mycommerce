<template>
  <v-dialog id="dialog-search" v-model="shopStore.showSearchModal" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar>
        <v-toolbar-title class="fw-bold text-uppercase">
          My company
        </v-toolbar-title>

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

            <Suspense v-else>
              <template #default>
                <AsyncRecommendations />
              </template>
              
              <template #fallback>
                <BaseLoadingRecommendations />
              </template>
            </Suspense>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import _ from 'lodash'

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
    
  const search = ref<string | null>(null)
  const { history } = useRefHistory(search)
  
  const searchedProducts = ref<Product[]>([])

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

        // $fbq('track', 'Search', {
        //   search_string: search.value
        // })

        searchedProducts.value = response.data.results
      }
    } catch (e) {
      handleError(e)
    }
  }

  const proxySearchProducts = _.debounce(requestProducts, 1000)

  return {
    search,
    searchedProducts,
    proxySearchProducts,
    canShowSearch,
    searchHistory: history
  }
}

const { search, canShowSearch, searchedProducts, proxySearchProducts } = useSearchProducts()
</script>
