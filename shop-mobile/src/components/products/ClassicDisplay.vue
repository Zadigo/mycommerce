<template>
  <ion-row>
    <ion-col size="12">
      <product-card v-for="product in products" :key="product.id" :product="product" @show-product-sizes="emit('show-product-sizes', product)" />
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { APIResponse, Product } from '@/types/shop';
import { IonCol, IonRow } from '@ionic/vue';
import { defineEmits, ref } from 'vue';

import ProductCard from './ProductCard.vue';

const emit = defineEmits({
  'show-product-sizes' (_data: Product) {
    return true
  },
  'update-next-url' (_data: APIResponse) {
    return true
  }
})

const products = ref<Product[]>([])
const cachedResponse = ref<APIResponse>()
const { requestProductsFromCollection } = useShopComposable()

requestProductsFromCollection((data) => {
  cachedResponse.value = data
  products.value = data.results
  emit('update-next-url', cachedResponse.value)
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
