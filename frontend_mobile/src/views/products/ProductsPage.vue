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
            <AsyncClassicDisplay v-if="currentGridSize===1" @update-cache="handleUpdateCache" @show-product-sizes="handleAddToCart" />
            <AsyncGridDisplay v-else-if="currentGridSize===2" @update-cache="handleUpdateCache" :columns="2"  @show-product-sizes="handleAddToCart" />
            <AsyncGridDisplay v-else-if="currentGridSize===3" @update-cache="handleUpdateCache" :columns="3"  @show-product-sizes="handleAddToCart" />
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
      <ion-modal :is-open="showProductsFilterModal" @willDismiss="handleShowProductFilters">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="showProductsFilterModal=false">
                <ion-icon :icon="closeIcon"></ion-icon>
              </ion-button>
            </ion-buttons>

            <ion-title style="text-align: center;">Filtrer</ion-title>
            
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="handleRemoveFilters">
                Supprimer
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="block-1">
            <p>Trier par</p>
            <ion-button>Nouveautés</ion-button>
          </div>

          <hr>

          <div class="block-1">
            <p>Typologie</p>
            <ion-button>Nouveautés</ion-button>
          </div>

          <hr>

          <div class="block-1">
            <p>Color</p>
            <ion-button>Blue</ion-button>
          </div>

          <hr>

          <div class="block-1">
            <p>Taille</p>
            <ion-button>XS</ion-button>
          </div>
          
          <hr>

          <div class="block-1">
            <p>Prix</p>
            <ion-button>Jusqu'à 15€</ion-button>
          </div>

          <ion-button expand="block">Voir les résulats</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Action Sheet -->
      <ion-modal :is-open="showSizeChoices" :initial-breakpoint="0.5" :backdrop-breakpoint="0" handle-behavior="cycle" @onDidDismiss="showSizeChoices=false">
        <ion-content class="ion-padding">
          <div class="infos">
            <p>Ajouter au panier</p>

            <ion-button fill="clear" color="dark">
              <ion-icon :icon="calculatorOutline" />
              <span>Guide des tailles</span>
            </ion-button>
          </div>

          <ion-list>
            <ion-item button>XS</ion-item>
            <ion-item button>S</ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useDjangoUtilies } from '@/composables/utils';
import { client } from '@/plugins/axios';
import { useShop } from '@/stores/shop';
import { ProductsAPIResponse } from '@/types/shop';
import { InfiniteScrollCustomEvent, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/vue';
import { useLocalStorage } from '@vueuse/core';
import { calculatorOutline, close as closeIcon } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useTitle } from '@vueuse/core'

import LoadingProducts from '@/components/products/LoadingProducts.vue';
import { useShopComposable } from '@/composables/shop';
import { baseGrids } from '@/data';

const AsyncClassicDisplay = defineAsyncComponent({
  loader: async () => import('@/components/products/ClassicDisplay.vue'),
  timeout: 3000
})

const AsyncGridDisplay = defineAsyncComponent({
  loader: async () => import('@/components/products/GridDisplay.vue'),
  timeout: 3000
})

const showProductsFilterModal = ref(false)
const showSizeChoices = ref(false)
const cachedResponse = ref<ProductsAPIResponse>()

const { handleGoToCollectionByName, requestProductsFromCollection } = useShopComposable()

const router = useIonRouter()
const storeShop = useShop()
const { currentCollectionName } = storeToRefs(storeShop)
const currentGridSize = useLocalStorage<1 | 2 | 3>('grid', 3)
const selectedSubcategory = ref('all')

const products = computed(() => {
  return cachedResponse.value?.results
})

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
 * 
 */
function handleRemoveFilters() {}

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
function handleShowProductFilters() {}

// 
function handleAddToCart() {
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
