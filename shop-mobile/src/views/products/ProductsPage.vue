<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="large" shape="round" @click="router.back()">
            <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
          </ion-button>
        </ion-buttons>
    
        <ion-title style="text-align: center;">{{ currentCollectionName }}</ion-title>
    
        <ion-buttons slot="end">
          <ion-button size="large" shape="round" @click="showProductsFilterModal=true">
            <font-awesome-icon :icon="['fas', 'sliders']"></font-awesome-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12" style="padding-top: 1.25rem;padding-bottom: 1.25rem;">
            <ion-button color="dark" fill="solid" size="small" class="btn-flat">
              Tous
            </ion-button>
            
            <ion-button v-for="subCategory in subCategories" :key="subCategory" color="dark" fill="outline" size="small" class="btn-tonal">
              {{ subCategory }}
            </ion-button>
          </ion-col>
        </ion-row>

        <ion-row id="top-bar" class="ion-justify-content-between" style="border-top: 1px solid black;">
          <!-- Grids -->
          <ion-col size="6">
            <ion-button v-for="grid in grids" :key="grid.display" :fill="currentGridDisplay === grid.display ? 'solid':'outline'" color="dark" size="small" class="btn-plain" @click="handleGridDisplay(grid.display)">
              <font-awesome-icon :icon="grid.icon"></font-awesome-icon>
            </ion-button>
          </ion-col>
          
          <!-- Filters -->
          <ion-col size="6">
            <p>{{ products?.length }} résultats</p>
            <span>|</span>
            <ion-button color="dark" fill="outline" size="small" @click="showProductsFilterModal=true">
              <font-awesome-icon :icon="['fas', 'sliders']"></font-awesome-icon>
            </ion-button>
          </ion-col>
        </ion-row>

        <!-- Products -->
        <Suspense>
          <template #default>
            <AsyncClassicDisplay v-if="currentGridDisplay===1" @update-next-url="(data) => cachedResponse = data" @show-product-sizes="handleAddToCart" />
            <AsyncGridDisplay v-else-if="currentGridDisplay===2" @update-next-url="(data) => cachedResponse = data" :columns="2"  @show-product-sizes="handleAddToCart" />
            <AsyncGridDisplay v-else-if="currentGridDisplay===3" @update-next-url="(data) => cachedResponse = data" :columns="3"  @show-product-sizes="handleAddToCart" />
          </template>

          <template #fallback>
            <LoadingProducts :columns="currentGridDisplay" /> 
          </template>
        </Suspense>
        
        <ion-infinite-scroll @ionInfinite="requestProductsProxy">
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

            <ion-button fill="clear" size="small" color="dark">
              <ion-icon :icon="calculatorOutline"></ion-icon>
              Guide des tailles
            </ion-button>
          </div>
          <ion-list>
            <ion-item>XS</ion-item>
            <ion-item>S</ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { client } from '@/plugins/axios';
import { useVueLocalStorage } from '@/plugins/vue-storages/local-storage';
import { useShop } from '@/stores/shop';
import { APIResponse } from '@/types/shop';
import { InfiniteScrollCustomEvent, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonModal, IonPage, IonRow, IonSkeletonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/vue';
import { calculatorOutline, close as closeIcon } from 'ionicons/icons';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { Type } from 'typescript';
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue';

import LoadingProducts from '@/components/products/LoadingProducts.vue';

const currentGridDisplay = ref<1 | 2 | 3>(1)
const showProductsFilterModal = ref(false)
const showSizeChoices = ref(false)
const cachedResponse = ref<APIResponse | Record<string, Type>>({})
const grids = ref([
  {
    display: 1,
    icon: ['far', 'square'],
  },
  {
    display: 2,
    icon: ['fas', 'table-cells-large'],
  },
  {
    display: 3,
    icon: ['fas', 'table-cells'],
  }
])

const router = useIonRouter()
const { data, instance } = useVueLocalStorage()

const storeShop = useShop()
const { currentCollectionName } = storeToRefs(storeShop)

const products = computed(() => {
  return cachedResponse.value?.results
})


const AsyncClassicDisplay = defineAsyncComponent({
  loader: () => import('@/components/products/ClassicDisplay.vue'),
  timeout: 3000
})

const AsyncGridDisplay = defineAsyncComponent({
  loader: () => import('@/components/products/GridDisplay.vue'),
  timeout: 3000
})

const subCategories = computed<string[]>(() => {
  const result = _.map(cachedResponse.value.results, (product) => {
    return product.sub_category
  })
  return _.uniq(result)
})

onBeforeMount(() => {  
  if (data.value?.gridDisplay) {
    currentGridDisplay.value = data.value.gridDisplay
  }
})

/**
 * 
 */
const handleRemoveFilters = function () {}


/**
 * This function allows us to paginate through the rest
 * of the collection by parsing the limit and offset
 * search parameters of the next url from the response
 */
const requestProductsProxy = async function (e: InfiniteScrollCustomEvent) {
  try {
    if (cachedResponse.value?.next !== null) {
      const url = new URL(cachedResponse.value?.next)
      const limit = url.searchParams.get('limit')
      const offset = url.searchParams.get('offset')

      const collectionUrlPath = `collection/${currentCollectionName.value.toLowerCase()}`

      const response = await client.get<APIResponse>(collectionUrlPath, {
        params: {
          limit,
          offset
        }
      })
      
      cachedResponse.value.next = response.data.next

      if (Array.isArray(cachedResponse.value?.results)) {
        cachedResponse.value?.results.push(...response.data.results)
      }
    }
    setTimeout(() => e.target.complete(), 500);
  } catch (e) {
    console.log(e)
  }
}

/**
 * 
 */
const handleShowProductFilters = () => {}

/**
 * 
 */
const handleAddToCart = () => {
  showSizeChoices.value = !showSizeChoices.value
}

/**
 * 
 */
const handleGridDisplay = (grid: number) => {
  currentGridDisplay.value = grid
  instance?.create('gridDisplay', grid)
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
