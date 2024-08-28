<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Rechercher</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row>
        <ion-col size="12">
          <ion-input label="Rechercher"></ion-input>
        </ion-col>

        <ion-col size="12">
          <p>Cela peut t'intéresser</p>

          <ion-row>
            <ion-col v-for="i in 30" :key="i" size="6">
              <ion-img :src="`/img1.jpg`"></ion-img>

              <div class="ion-flex ion-justify-content-between">
                <p class="fw-light">Some product {{ i }}</p>
                <ion-icon :icon="heart"></ion-icon>
              </div>
              <p class="price fw-bold">12.44€</p>
              <!-- <ion-card>
              </ion-card> -->
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCol, IonContent, IonIcon, IonImg, IonInput, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/vue';
import { heart } from 'ionicons/icons';
import { onBeforeMount, ref } from 'vue';

const products = ref([])

const getProducts = async function () {
  products.value = []
}

onBeforeMount(() => {
  getProducts()
})
</script>
