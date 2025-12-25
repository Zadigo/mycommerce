<template>
  <volt-drawer id="dialog-search" v-model:visible="showSearchModal" position="full" :modal="false">
    <div class="w-7xl max-w-7xl mx-auto overflow-y-scroll my-10">
      {{ history }} {{ last }}

      <div class="relative w-full items-center mb-10">
        <volt-input-text id="search" v-model="search" :placeholder="$t('Ecris les produits à rechercher')" type="search" class="pl-10 w-full" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Icon name="i-fa7-solid:search" />
        </span>
      </div>
      
      <div v-if="canShowSearch" class="row gx-1 gy-1">
        <!-- TODO: Gtag analytics to track product click from search @has-navigated -->
        <ProductsIterator />
      </div>
      
      <!-- Recommendations -->
      <suspense v-else>
        <template #default>
          <AsyncRecommendations @has-navigated="showSearchModal=false" />
        </template>
        
        <template #fallback>
          <div class="grid grid-cols-4 gap-2">
            <ProductsLoadingCards :quantity="8" />
          </div>
        </template>
      </suspense>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import { productsSymbol } from '~/data/constants/symbols'
import { doc, updateDoc } from 'firebase/firestore'
import type { SearchedProducts } from '~/types'
import { baseProductGraph } from '~/data/constants/graphs'

const AsyncRecommendations = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  suspensible: true,
  delay: 200,
  timeout: 10000
})

const showSearchModal = useState<boolean>('showSearchModal')

/**
 * Search state
 */

const search = shallowRef<string>('')
const searchDebounced = refDebounced(search, 2000)

const _cache = ref<SearchedProducts>()
const products = computed(() => isDefined(_cache) ? _cache.value.data.searchProducts.edges || [] : [])
const canShowSearch = computed(() => products.value.length > 0)

provide(productsSymbol, products)

/**
 * Search watcher
 */

// const { gtag } = useGtag()

const { $client } = useNuxtApp()
const { customHandleError } = useErrorHandler()

const { history, last } = useDebouncedRefHistory(search, { debounce: 5000 })
const { docRef, session } = useSession()

watch(searchDebounced, async () => {
  /**
   * Fetch products
   */

  if (search.value && search.value !== "") {
    try {
      const data = await $client<SearchedProducts>('/v1/graphql/', {
        method: 'POST',
        body: {
          query: `
            query($name: String!) {
              searchProducts(name: $name, first: 20) {
                edges {
                  node {
                    ${baseProductGraph}
                  }
                }
              }
            }
          `,
          variables: {
            name: search.value
          }
        },
        onRequestError({ error }) {
          customHandleError(error)
        }
      })

      _cache.value = data
    } catch (error) {
      customHandleError(error)
    } 
  }

  /**
   * Analytics
   */
  
  // TODO: G-Analytics
  // gtag('event', 'search', { search_term: search.value })

  /**
   * Save search
   */

  if (isDefined(session)) {
    await updateDoc(docRef, {
      searchHistory: history.value.map(item => ({
        term: item.snapshot,
        searchedOn: item.timestamp
      })) 
    })
  }
})
</script>
