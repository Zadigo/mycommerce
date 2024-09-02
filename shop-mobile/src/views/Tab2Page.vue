<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="12">
          <h1>Rechercher</h1>
        </ion-col>
        <ion-col size="12">
          <ion-input fill="outline" placeholder="Rechercher">
            <ion-icon slot="start" :icon="search" aria-hidden="true"></ion-icon>
            <ion-button fill="clear" slot="end" aria-label="Show/hide">
              <ion-icon slot="icon-only" :icon="close" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
        </ion-col>

        <ion-col size="12">
          <p>Cela peut t'intéresser</p>

          <ion-row>
            <ion-col v-for="product in products" :key="product.id" size="6">
              <product-card :product="product" :show-add-to-favorite="true" />              
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Product } from '@/types/collections';
import { IonButton, IonCol, IonContent, IonIcon, IonInput, IonPage, IonRow } from '@ionic/vue';
import { close, search } from 'ionicons/icons';
import { onBeforeMount, ref } from 'vue';

import ProductCard from '@/components/products/ProductCard.vue';

const products = ref<Product[]>([])

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
