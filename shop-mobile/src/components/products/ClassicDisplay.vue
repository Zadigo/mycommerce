<template>
  <ion-row>
    <ion-col size="12">
      <product-card v-for="product in products" :key="product.id" :product="product" @show-product-sizes="emit('show-product-sizes', product)" />
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
// import { useProducts } from '@/composables/shop';
import { IonCol, IonRow } from '@ionic/vue';
import { defineEmits, defineProps } from 'vue';

import ProductCard from './ProductCard.vue';

const emit = defineEmits(['show-product-sizes'])
defineProps({
  products: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.product-info {
  display: flex;
  justify-content: space-between;
}

.product-info h5 {
  font-weight: bold;
}

.product-info p {
  font-weight: lighter
}

ion-card {
  box-shadow: none;
}

ion-col {
  padding-left: 0px;
  padding-right: 0px;
}

ion-card {
  margin-left: 0px;
  margin-right: 0px;
}
</style>
