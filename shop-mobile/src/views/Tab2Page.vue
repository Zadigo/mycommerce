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
            <ion-col v-for="product in products" :key="product.id" size="6">
              <product-card :product="product":show-add-to-favorite="true" />              
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCol, IonContent, IonHeader, IonInput, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';

import ProductCard from '@/components/products/ProductCard.vue';

const products = ref([])

onBeforeMount(() => {
  getProducts()
})

const getProducts = async function () {
  products.value = Array.from({ length: 30 }, (a, b) => {
    return {
      id: b,
      name: `Product ${b}`
    }
  })
}
</script>
