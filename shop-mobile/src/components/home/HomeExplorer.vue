<template>
  <ion-grid style="padding-left: 0;padding-right: 0;padding-top: 0;">
    <!-- Collections -->
    <ion-row>
      <ion-col size="12" style="padding-left: 0;padding-right: 0;padding-top: 0;">
        <div id="video-container">
          <video autoplay muted loop>
            <source src="/vid1.mp4" type="video/mp4">
          </video>
        </div>
      </ion-col>

      <ion-col v-for="collection in collections" :key="collection.id" size="3">
        <ion-img :src="`/img3.jpg`" @click="handleGoToCollection(collection)"></ion-img>
        <p style="font-size: .6rem;text-align: center;">{{ `Collection ${collection.id}` }}</p>
      </ion-col>
    </ion-row>

    <!-- Product Highlight -->
    <ion-row>
      <ion-col size="12">
        <ion-img src="/img3.jpg"></ion-img>
      </ion-col>
    </ion-row>

    <!-- Product Recommendations -->
    <ion-row>
      <ion-col v-for="sampleProduct in sampleProducts" :key="sampleProduct.id" size="6">
        <ion-img :src="`/img3.jpg`" @click="handleGoToProduct(sampleProduct)"></ion-img>
      </ion-col>

      <ion-col size="12">
        <div class="ion-justify-content-center">
          <ion-button fill="outline">
            Voir tout les styles
          </ion-button>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { useShop } from '@/stores/shop';
import { Product, ProductCollections } from '@/types/collections';
import { IonButton, IonCol, IonGrid, IonImg, IonRow, useIonRouter } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { onBeforeMount, PropType, ref } from 'vue';

const store = useShop()
const router = useIonRouter()

const { currentProduct, currentCollection } = storeToRefs(store)
const sampleProducts = ref<Product[]>([])

defineProps({
  collections: {
    type: Array as PropType<ProductCollections[]>,
    required: true
  }
})

onBeforeMount(() => {
  requestSampleProducts()
})

const requestSampleProducts = async function () {
  Array.from({ length: 4 }, (a, b) => {
    sampleProducts.value.push({
      id: b,
      name: `Product ${b}`
    })
  })
}

/**
 * See the details for the current given collection
 * in the collection's page 
 */
const handleGoToCollection = function (collection: ProductCollections): void {
  currentCollection.value = collection
  router.push('/tabs/tab1/products')
}

/**
 * See the details for the current given collection
 * in the collection's page 
 */
const handleGoToProduct = function (product: Product): void {
  currentProduct.value = product
  router.push('/tabs/tab1/product')
}
</script>

<style scoped>
#carousel {
  overflow-y: hidden;
}

#video-container {
  width: 100%;
  height: auto;
}

#video-container video {
  /* height: 100%; */
  width: 100%;
}
</style>
