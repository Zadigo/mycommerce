<template>
  <ion-row>
    <ion-col v-for="product in products" :key="product.id" size="6">
      <product-card :product="product" :show-add-to-favorite="showAddToFavorite" />              
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { Product } from '@/types/shop';
import { IonRow, IonCol } from '@ionic/vue';

import ProductCard from './products/ProductCard.vue';

defineProps({
  products: {
    type: Array<Product>,
    default: () => []
  },
  showAddToFavorite: {
    type: Boolean,
    default: false
  }
})
</script>
