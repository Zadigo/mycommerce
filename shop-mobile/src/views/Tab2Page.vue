<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-row>
        <transition name="slide" mode="out-in">
          <SimpleSearch v-if="showHeader" @search-focused="showHeader=false" />
          <FocusedSearch v-else @search-unfocused="showHeader=true" />
        </transition>

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
import SimpleSearch from '@/components/search/SimpleSearch.vue';
import FocusedSearch from '@/components/search/FocusedSearch.vue';

const products = ref<Product[]>([])
const showHeader = ref<boolean>(true)

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

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all .15s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 1;
  transform: translateY(0px)
}

.slide-enter-to,
.slide-leave-from {
  opacity: 0;
  transform: translateY(-25px)
}
</style>
