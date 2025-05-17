<template>
  <v-dialog id="dialog-search" v-model="shopStore.showSearchModal" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar>
        <v-spacer />
        <TailButton icon="mdi-close" @click="shopStore.showSearchModal=false">
          <Icon name="fa-solid:x-mark" />
        </TailButton>
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
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
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
const search = ref<string | null>(null)

const canShowSearch = computed(() => {
  return searchedProducts.value.length > 0
})

async function requestProducts (): Promise<void> {
  if (search.value && search.value !== "") {
    const response = await $client<ProductsApiResponse>('/api/v1/shop/products', {
      params: {
        q: search.value
      },
      onRequestError({ error }) {
        handleError(error)
      },
      onResponse() {
        searchedProducts.value = response.results
      }
    })
  }
  
  // TODO: G-Analytics
  // gtag('event', 'search', { search_term: search.value })
}


const { debounce } = useDebounce()
const proxySearchProducts = debounce(requestProducts, 1000)
</script>
