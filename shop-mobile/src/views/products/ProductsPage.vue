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
            <ion-button color="dark" fill="solid" size="small">Tous</ion-button>
            <ion-button color="dark" fill="outline" size="small">Jupes</ion-button>
            <ion-button color="dark" fill="outline" size="small">Corsets</ion-button>
          </ion-col>
        </ion-row>
        <ion-row id="top-bar" class="ion-justify-content-between" style="border-top: 1px solid black;">
          <!-- Grids -->
          <ion-col size="6">
            <ion-button v-for="grid in grids" :key="grid.value" :fill="currentGridDisplay === grid.value ? 'solid':'outline'" color="dark" size="small" @click="handleGridDisplay(grid.value)">
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
        <ClassicDisplay v-if="currentGridDisplay===1" :products="products" @show-product-sizes="handleAddToCart" />
        <GridDisplay v-else-if="currentGridDisplay===2" :products="products" :columns="2" @show-product-sizes="handleAddToCart" />
        <GridDisplay v-else-if="currentGridDisplay===3" :products="products" :columns="3" @show-product-sizes="handleAddToCart" />
        
        <ion-infinite-scroll @ionInfinite="requestProductsProxy">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-grid>
      
      <!-- Modals -->
      <ion-modal :is-open="showProductsFilterModal" @willDismiss="handleShowProductFilters">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="showProductsFilterModal=false">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Welcome</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="handleRemoveFilters">Supprimer</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          Filter the products
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
import { InfiniteScrollCustomEvent, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/vue';
import { calculatorOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, ref } from 'vue';

import ClassicDisplay from '@/components/products/ClassicDisplay.vue';
import GridDisplay from '@/components/products/GridDisplay.vue';

const currentGridDisplay = ref(1)
const showProductsFilterModal = ref(false)
const showSizeChoices = ref(false)
const cachedResponse = ref<APIResponse>()
const grids = ref([
  {
    value: 1,
    icon: ['far', 'square'],
  },
  {
    value: 2,
    icon: ['fas', 'table-cells-large'],
  },
  {
    value: 3,
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

onBeforeMount(() => {
  requestProducts()
  
  if (data.value?.gridDisplay) {
    currentGridDisplay.value = data.value.gridDisplay
  }
})

/**
 * 
 */
const handleRemoveFilters = function () {}

/**
 * 
 */
// const requestProducts = async function () {
//   products.value = Array.from({ length: 50 }, (a, b) => {
//     return {
//       id: b,
//       name: `Product ${b}`,
//     };
//   })
// }

async function requestProducts () {
  try {
    const collectionUrlPath = `collection/${currentCollectionName.value.toLowerCase()}`

    // if (instance.keyExists(collectionUrlPath)) {
    //   cachedResponse.value = instance.retrieve(collectionUrlPath)
    // } else {
    // }
    const response = await client.get(collectionUrlPath)
    instance.create(collectionUrlPath, response.data)
    cachedResponse.value = response.data
    instance.create('products', products.value)
  } catch (e) {
    console.log(e)
    // If we fail to get the collectionName
    // redirect to the 404 page
    // messagesStore.addNetworkError()

    // if (e.response.status === 404) {
    //   router.push({ name: 'not_found' })
    // }
  }
}

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

      const response = await client.get(collectionUrlPath, {
        params: {
          limit,
          offset
        }
      })
      cachedResponse.value.next = response.data.next
      cachedResponse.value?.results.push(...response.data.results)
    }
    setTimeout(() => e.target.complete(), 500);
  } catch (e) {
    console.log(e)
  }
}

/**
 * 
 */
const handleShowProductFilters = function () {}

/**
 * 
 */
const handleAddToCart = function () {
  showSizeChoices.value = !showSizeChoices.value
}

/**
 * 
 */
const handleGridDisplay = function (grid: number) {
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
</style>
