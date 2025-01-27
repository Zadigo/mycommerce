<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="large" shape="round" @click="router.back()">
            <font-awesome-icon icon="chevron-left" />
          </ion-button>
        </ion-buttons>
    
        <ion-title>
          {{ currentCollectionName }}
        </ion-title>
    
        <!-- <ion-buttons slot="end">
          <ion-button size="large" shape="round" @click="showProductsFilterModal=true">
            <font-awesome-icon icon="sliders" />
          </ion-button>
        </ion-buttons> -->
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header>
        <h1 class="ion-padding-start ion-padding-top ion-no-margin">
          {{ useTitle(currentCollectionName) }}
        </h1>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="12" style="padding-top: 1.25rem;padding-bottom: 1.25rem;">
            <ion-button color="dark" :fill="selectedSubcategory === 'all' ? 'solid' : 'outline'" size="small" class="btn-flat" @click="handleRefreshCollection('all')">
              Tous
            </ion-button>
            
            <ion-button v-for="subCategory in subCategories" :key="subCategory" color="dark" :fill="selectedSubcategory === subCategory ? 'solid' : 'outline'" size="small" class="btn-tonalx" @click="handleRefreshCollection(subCategory)">
              {{ subCategory }}
            </ion-button>
          </ion-col>
        </ion-row>

        <ion-row id="top-bar" class="ion-justify-content-between" style="border-top: 1px solid black;">
          <!-- Grids -->
          <ion-col size="6">
            <ion-button v-for="grid in baseGrids" :key="grid.display" :fill="currentGridSize === grid.display ? 'solid':'outline'" color="dark" size="small" class="btn-plain" @click="handleGridDisplay(grid.display)">
              <font-awesome-icon :icon="grid.icon" />
            </ion-button>
          </ion-col>
          
          <!-- Filters -->
          <ion-col size="6">
            <p class="fw-light">{{ products?.length }} résultats</p>
            <span>|</span>
            <ion-button color="dark" fill="outline" size="small" @click="showProductsFilterModal=true">
              <font-awesome-icon icon="sliders" />
            </ion-button>
          </ion-col>
        </ion-row>

        <!-- Products -->
        <Suspense>
          <template #default>
            <AsyncClassicDisplay v-if="currentGridSize===1" @update-cache="handleUpdateCache" @show-product-sizes="handleShowProductSizes" />
            <AsyncGridDisplay v-else-if="currentGridSize===2" @update-cache="handleUpdateCache" :columns="2"  @show-product-sizes="handleShowProductSizes" />
            <AsyncGridDisplay v-else-if="currentGridSize===3" @update-cache="handleUpdateCache" :columns="3" />
          </template>

          <template #fallback>
            <LoadingProducts :columns="currentGridSize" /> 
          </template>
        </Suspense>
        
        <ion-infinite-scroll @ionInfinite="requestMoreProducts">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-grid>
      
      <!-- Modals -->
      <custom-filters :show="showProductsFilterModal" @close="showProductsFilterModal=false" />
      <size-choices :show="showSizeChoices" :product="selectedProduct" @size-selected="handleSizeSelected" @close="showSizeChoices=false" />
      <last-added-product :show="showLastAddedProduct" @close="showLastAddedProduct=false" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { useDjangoUtilies } from '@/composables/utils';
import { baseGrids } from '@/data';
import { client } from '@/plugins/axios';
import { useShop } from '@/stores/shop';
import { Product, ProductsAPIResponse } from '@/types/shop';
import { InfiniteScrollCustomEvent, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/vue';
import { useLocalStorage, useTitle } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent, ref } from 'vue';

import CustomFilters from '@/components/modals/products/CustomFilters.vue';
import SizeChoices from '@/components/modals/SizeChoices.vue';
import LoadingProducts from '@/components/products/LoadingProducts.vue';
import LastAddedProduct from '@/components/modals/LastAddedProduct.vue';

const AsyncClassicDisplay = defineAsyncComponent({
  loader: async () => import('@/components/products/ClassicDisplay.vue'),
  timeout: 3000
})

const AsyncGridDisplay = defineAsyncComponent({
  loader: async () => import('@/components/products/GridDisplay.vue'),
  timeout: 3000
})

const router = useIonRouter()
const storeShop = useShop()
const { currentCollectionName } = storeToRefs(storeShop)
const currentGridSize = useLocalStorage<1 | 2 | 3>('grid', 3)
const { requestProductsFromCollection } = useShopComposable()

const showProductsFilterModal = ref(false)
const cachedResponse = ref<ProductsAPIResponse>()
const selectedProduct = ref<Product>()
const selectedSubcategory = ref('all')
const showSizeChoices = ref(false)
const showLastAddedProduct = ref(false)

const products = computed(() => {
  return cachedResponse.value?.results
})

// Sub-categories used to filter the products
// in to be seen
const subCategories = computed<string[]>(() => {
  if (cachedResponse.value) {
    const result = cachedResponse.value.results.map((product) => {
      return product.sub_category
    })
    return Array.from(new Set(result))
  } else {
    return []
  }
})

function handleUpdateCache(data: ProductsAPIResponse) {
  console.log('handleUpdateCache', data)
  cachedResponse.value = data
}

/**
 * This function allows us to paginate through the rest
 * of the collection by parsing the limit and offset
 * search parameters of the next url from the response
 */
async function requestMoreProducts (e: InfiniteScrollCustomEvent) {
  try {
    if (cachedResponse.value) {
      if (cachedResponse.value.next) {
        const { builLimitOffset } = useDjangoUtilies()
        const result = builLimitOffset(cachedResponse.value.next)
        const collection = currentCollectionName.value || 'all'
        const collectionUrlPath = `collection/${collection.toLowerCase()}` 

        const response = await client.get<ProductsAPIResponse>(collectionUrlPath, {
          params: {
            limit: result.limit,
            offset: result.offset
          }
        })

        cachedResponse.value.next = response.data.next
        cachedResponse.value.results.push(...response.data.results)
      }
      setTimeout(() => e.target.complete(), 500);
    } else {
      console.log('no cached response')
    }
  } catch (e) {
    console.log(e)
  }
}

// 
function handleShowProductSizes(product: Product) {
  selectedProduct.value = product
  showSizeChoices.value = !showSizeChoices.value
}

// 
function handleGridDisplay(grid: 1 | 2 | 3) {
  console.log(grid)
  currentGridSize.value = grid
}

// TODO: This should use a filter for a subcategories instead
// of using the collection
function handleRefreshCollection(name: 'all' | string) {
  selectedSubcategory.value = name
  requestProductsFromCollection((data) => {
    cachedResponse.value = data
  }, selectedSubcategory.value)
}

function handleSizeSelected() {
  showSizeChoices.value = false
  showLastAddedProduct.value = true
}
</script>

<style scoped>
#top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#top-bar ion-col:nth-child(2) {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: nowrap
}

ion-grid {
  padding-left: 0px;
  padding-right: 0px;
}

.infos {
  display: flex;
  justify-content: space-between;
}

.infos p:first-child {
  font-weight: 500;
}

.infos ion-button {
  justify-content: end;
}

ion-button.btn-plain::part(native) {
  opacity: .62;
}

/* ion-button::part(native) {
  border-width: 1px;
  border-style: solid;
} */

ion-button.btn-flat::part(native) {
  box-shadow: none;
}

ion-button.btn-tonal::part(native) {
  background: transparent;
  color: inherit;
  box-shadow: none;
  border-style: solid;
  border-width: 0;
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
