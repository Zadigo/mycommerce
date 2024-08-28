<template>
  <ion-grid>
    <!-- Hero -->
    <ion-col size="12">
      <!-- <ion-img src="/img1.jpg"></ion-img> -->
      <div id="video-container">
        <video autoplay muted loop>
          <source src="/vid1.mp4" type="video/mp4">
        </video>
      </div>
    </ion-col>

    <!-- Carousel -->
    <ion-row id="carousel" class="ion-justify-content-around">
      <ion-col v-for="i in 4" :key="i" size="3">
        <ion-img :src="`/img${i}.jpg`"></ion-img>
      </ion-col>
    </ion-row>

    <ion-col size="12">
      <ion-img src="/img3.jpg"></ion-img>
    </ion-col>

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
import { IonGrid, IonRow, IonButton, IonCol, IonImg } from '@ionic/vue';
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
