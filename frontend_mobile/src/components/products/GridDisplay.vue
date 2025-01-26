<template>
  <ion-row>
    <ion-col v-for="product in products" :key="product.id" :size="gridColumns" style="padding: .15rem .15rem .15rem .15rem;">
      <product-card :product="product" :show-product-info="showProductInfo" @show-product-sizes="emit('show-product-sizes', product)" />
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { ProductsAPIResponse, Product } from '@/types/shop';
import { IonCol, IonRow } from '@ionic/vue';
import { computed, defineEmits, defineProps, ref } from 'vue';

import ProductCard from './ProductCard.vue';

const emit = defineEmits({
  'show-product-sizes' (_data: Product) {
    return true
  },
  'update-cache' (_data: ProductsAPIResponse) {
    return true
  }
})

const { requestProductsFromCollection } = useShopComposable()

const products = ref<Product[]>([])
const cachedResponse = ref<ProductsAPIResponse>()

const props = defineProps({
  columns: {
    type: Number,
    default: 2
  }
});

/**
 * TODO: Put in composable
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

/**
 * 
 */
const showProductInfo = computed(() => {
  if (props.columns === 3) {
    return false
  } else {
    return true
  }
})

requestProductsFromCollection((data) => {
  cachedResponse.value = data
  products.value = data.results
  emit('update-cache', cachedResponse.value)
})
</script>

<style scoped>
ion-card {
  margin: 0px;
}
</style>
