<template>
  <volt-drawer id="dialog-search" v-model:visible="showSearchModal" position="full" :modal="false">
    <div class="w-7xl max-w-7xl mx-auto overflow-y-scroll my-10">
      {{ history }} {{ last }}

      <div class="relative w-full items-center mb-10">
        <volt-input-text id="search" v-model="search" :placeholder="$t('Ecris les produits à rechercher')" type="search" class="pl-10 w-full" />
        <span class="absolute inset-s-0 inset-y-0 flex items-center justify-center px-2">
          <icon name="i-fa7-solid:search" />
        </span>
      </div>

      <div v-if="canShowSearch" class="row gx-1 gy-1">
        <!-- TODO: Gtag analytics to track product click from search @has-navigated -->
        <products-iterator />
      </div>
      
      <!-- Recommendations -->
      <suspense v-else>
        <template #default>
          <async-recommendations list-name="Recommendations Search" @has-navigated="showSearchModal=false" />
        </template>
        
        <template #fallback>
          <div class="grid grid-cols-4 gap-2">
            <products-loading-cards :quantity="8" />
          </div>
        </template>
      </suspense>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
const AsyncRecommendations = defineAsyncComponent({
  loader: async () => import('~/components/base/Recommendations.vue'),
  suspensible: true,
  delay: 200,
  timeout: 10000
})

const showSearchModal = useState<boolean>('showSearchModal')

/**
 * Search
 */

const { history, last, search, products, canShowSearch } = useSearchComposable()
provide(productsSymbol, products)
</script>
