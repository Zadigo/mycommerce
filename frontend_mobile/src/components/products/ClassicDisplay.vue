<template>
  <ion-row>
    <template v-if="products.length > 0">
      <ion-col size="12">
        <product-card v-for="product in products" :key="product.id" :product="product" @show-product-sizes="emit('show-product-sizes', product)" />
      </ion-col>
    </template>

    <template v-else>
      <ion-col v-for="i in 20" :key="i" size="12">
        <BaseSkeleton :loading="true" height="400px" />
      </ion-col>
    </template>
  </ion-row>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { Product, ProductsAPIResponse } from '@/types/shop';
import { IonCol, IonRow } from '@ionic/vue';
import { ref } from 'vue';

import ProductCard from './ProductCard.vue';
import BaseSkeleton from '../BaseSkeleton.vue';

const emit = defineEmits({
  'show-product-sizes' (_data: Product) {
    return true
  },
  'update-cache' (_data: ProductsAPIResponse) {
    return true
  }
})

const products = ref<Product[]>([])
const cachedResponse = ref<ProductsAPIResponse>()
const { requestProductsFromCollection } = useShopComposable()

requestProductsFromCollection((data) => {
  cachedResponse.value = data
  products.value = data.results
  emit('update-cache', cachedResponse.value)
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
