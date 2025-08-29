<template>
  <TailDrawer id="dialog-search" v-model:open="globalModals.showSearchModal.value">
    <TailDrawerContent>
      <TailDrawerHeader>
        <!-- <TailDrawerClose as-child>
          <TailButton variant="outline" @click="shopStore.showSearchModal=false">
            <Icon name="i-fa7-solid:window-close" />
          </TailButton>
        </TailDrawerClose> -->
      </TailDrawerHeader>
      
      <div class="w-7xl max-w-7xl mx-auto overflow-y-scroll my-10">
        {{ history }} {{ last }}

        <div class="relative w-full items-center mb-10">
          <TailInput id="search" v-model="search" :placeholder="$t('Ecris les produits à rechercher')" type="search" class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Icon name="i-fa7-solid:search" />
          </span>
        </div>
        
        <div v-if="canShowSearch" class="row gx-1 gy-1">
          <!-- TODO: Gtag analytics to track product click from search @has-navigated -->
          <ProductsIterator />
        </div>
        
        <!-- Recommendations -->
        <Suspense v-else>
          <template #default>
            <AsyncRecommendations @has-navigated="globalModals.showSearchModal.value=false" />
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
import { productSymbol } from '~/data/constants/symbols'
import { doc, updateDoc } from 'firebase/firestore'
import type { Product, ProductsApiResponse } from '~/types'

const AsyncRecommendations = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  suspensible: true,
  delay: 200,
  timeout: 10000
})

const globalModals = useGlobalModals()

// const { gtag } = useGtag()
const { $client } = useNuxtApp()
const { customHandleError } = useErrorHandler()

const searchedProducts = ref<Product[]>([])

const search = shallowRef<string>('')
const searchDebounced = refDebounced(search, 2000)

const canShowSearch = computed(() => searchedProducts.value.length > 0)

provide(productSymbol, searchedProducts)

const db = useFirestore()
const { history, last } = useDebouncedRefHistory(search, { debounce: 5000 })
const { sessionId } = await useStorageSetup()

watch(searchDebounced, async () => {
  /**
   * Fetch products
   */

  if (search.value && search.value !== "") {
    const data = await $client<ProductsApiResponse>('/api/v1/shop/products', {
      params: {
        q: search.value
      },
      onRequestError({ error }) {
        customHandleError(error)
      }
    })

    searchedProducts.value = data.results
  }

  /**
   * Analytics
   */
  
  // TODO: G-Analytics
  // gtag('event', 'search', { search_term: search.value })

  /**
   * Save search
   */

  if (isDefined(sessionId)) {
    const docRef = doc(db, 'sessions', sessionId.value)
    await updateDoc(docRef, { searchHistory: history.value || [] }, { merge: true })
  }
})
</script>
