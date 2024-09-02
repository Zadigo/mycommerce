<template>
  <ion-row>
    <ion-col v-for="product in products" :key="product.id" :size="gridColumns">
      <product-card :product="product" :show-product-info="showProductInfo" @show-product-sizes="emit('show-product-sizes', product)" />
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { Product } from '@/types/collections';
import { IonCol, IonRow } from '@ionic/vue';
import { computed, defineEmits, defineProps } from 'vue';

import ProductCard from './ProductCard.vue';

const emit = defineEmits(["show-product-sizes"]);
const props = defineProps({
  columns: {
    type: Number,
    default: 2
  },
  products: {
    type: Array<Product>,
    default: () => []    
  }
});

// const { handleGoToProduct } = useProducts()

/**
 * 
 */
const gridColumns = computed(() => {
  if (props.columns === 2) {
    return '6'
  } else if (props.columns === 3) {
    return '4'
  } else {
    return '4'
  }
})

const showProductInfo = computed(() => {
  if (props.columns === 3) {
    return false
  } else {
    return true
  }
})
</script>

<style scoped>
ion-card {
  margin: 0px;
}
</style>
