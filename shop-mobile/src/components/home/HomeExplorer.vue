<template>
  <ion-grid>
    <!-- Collections -->
    <ion-row id="carousel" class="ion-justify-content-around">
      <ion-col size="12">
        <div id="video-container">
          <video autoplay muted loop>
            <source src="/vid1.mp4" type="video/mp4">
          </video>
        </div>
      </ion-col>

      <ion-col v-for="i in 4" :key="i" size="3">
        <ion-img :src="`/img${i}.jpg`" @click="handleGoToProduct(i)"></ion-img>
        {{ `Collection ${i}` }}
      </ion-col>
    </ion-row>

    <!-- Highlight -->
    <ion-row>
      <ion-col size="12">
        <ion-img src="/img3.jpg"></ion-img>
      </ion-col>
    </ion-row>

    <!-- Recommendations -->
    <ion-row>
      <ion-col v-for="i in 4" :key="i" size="6">
        <ion-img :src="`/img${i}.jpg`"></ion-img>
      </ion-col>

      <ion-col size="12">
        <div class="ion-justify-content-center">
          <ion-button fill="outline">Voir tout les styles</ion-button>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { useShop } from '@/stores/shop';
import { IonButton, IonCol, IonGrid, IonImg, IonRow, useIonRouter } from '@ionic/vue';
import { storeToRefs } from 'pinia';

const store = useShop()
const router = useIonRouter()

const { currentProduct } = storeToRefs(store)

const handleGoToProduct = function (product: number): void {
  currentProduct.value = product
  router.push('/tabs/tab1/products')
}
</script>

<style scoped>
#carousel {
  overflow-y: hidden;
}

#video-container {
  width: 100%;
  height: 500px;
}

#video-container video {
  height: 100%;
  width: 100%;
}
</style>
