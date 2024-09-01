<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="large" shape="round" @click="router.back()">
            <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Collection n°1</ion-title>
        <ion-buttons slot="end">
          <ion-button size="large" shape="round" @click="showProductsFilterModal=true">
            <font-awesome-icon :icon="['fas', 'sliders']"></font-awesome-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row id="top-bar" class="ion-justify-content-between">
          <ion-col size="6">
            <ion-button fill="solid" size="small" shape="round" @click="handleGridDisplay(1)">
              <font-awesome-icon :icon="['far', 'square']"></font-awesome-icon>
            </ion-button>
            <ion-button fill="solid" size="small" shape="round" @click="handleGridDisplay(2)">
              <font-awesome-icon :icon="['fas', 'table-cells-large']"></font-awesome-icon>
            </ion-button>
            <ion-button fill="solid" size="small" shape="round" @click="handleGridDisplay(3)">
              <font-awesome-icon :icon="['fas', 'table-cells']"></font-awesome-icon>
            </ion-button>
          </ion-col>
          <ion-col size="6">
            <p>209 résultats</p>
            <span>|</span>
            <ion-button size="small" shape="round" @click="showProductsFilterModal=true">
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
      <ion-modal :is-open="showSizeChoices" :initial-breakpoint="0.25" :breakpoints="[0.25, 0.5, 0.75]" :backdrop-dismiss="false" :backdrop-breakpoint="0.5" handle-behavior="cycle">
        <ion-content class="ion-padding">
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
import { useVueLocalStorage } from '@/plugins/vue-storages/local-storage';
import { InfiniteScrollCustomEvent, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';

import ClassicDisplay from '@/components/products/ClassicDisplay.vue';
import GridDisplay from '@/components/products/GridDisplay.vue';

const currentGridDisplay = ref(1)
const showProductsFilterModal = ref(false)
const showSizeChoices = ref(false)
const products = ref([])

const router = useIonRouter()
const { data, instance } = useVueLocalStorage()

onBeforeMount(() => {
  requestProducts()
  
  if (data.value.gridDisplay) {
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
const requestProducts = async function () {
  products.value = Array.from({ length: 50 }, (a, b) => {
    return {
      id: b,
      name: `Product ${b}`,
    };
  })
}

/**
 * 
 */
const requestProductsProxy = function (e: InfiniteScrollCustomEvent) {
  requestProducts()
  setTimeout(() => e.target.complete(), 500);
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
</style>
