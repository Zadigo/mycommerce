<template>
  <ion-row>
    <template v-if="sampleProducts.length > 0">
      <ion-col v-for="sampleProduct in sampleProducts" :key="sampleProduct.id" size="6">
        <ion-img :src="mediaPath(sampleProduct.get_main_image?.original)" :alt="sampleProduct.name" @click="handleGoToProduct(sampleProduct)" />
      </ion-col>
    </template>

    <template v-else>
      <ion-col size="12" class="ion-text-center">
        No recommendations...
      </ion-col>
    </template>

    <ion-col size="12" class="ion-text-center">
      <ion-button fill="outline" color="dark" @click="handleGoToCollectionByName('all')">
        Voir tout les styles
      </ion-button>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useErrorHandler } from '@/composables/errors';
import { useShopComposable } from '@/composables/shop';
import { useDjangoUtilies } from '@/composables/utils';
import { client } from '@/plugins/axios';
import { useShop } from '@/stores/shop';
import { Product } from '@/types';
import { IonButton, IonCol, IonImg, IonRow } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';

const shopStore = useShop()
const { handleGoToCollectionByName, handleGoToProduct } = useShopComposable()
const { mediaPath } = useDjangoUtilies()
const { handleError } = useErrorHandler()

const sampleProducts = ref<Product[]>([])

const emit = defineEmits({
  'hightlight-product' (_data: Product | undefined) {
    return true
  }
})

/**
 * Gets a sample amount of products that can be shown
 * on the initial home of the app
 */
async function requestSampleProducts () {
  async function getProducts (): Promise<[Product | null, Product[]]> {
    try {
      const response = await client.get('/shop/products/recommendations', {
        params: { m: 1, q: 5, i: 1 }
      })
      const result = response.data
      return [result[2], result]
    } catch (e) {
      handleError(e)
      return [null, []]
    }
  }

  try {
    if (shopStore.sessionCache) {
      if (shopStore.sessionCache.recommendations.length === 0) {
        const data = await getProducts()
        
        if (data[0]) {
          shopStore.sessionCache.recommendations = data[1]
          emit('hightlight-product', data[0])
        }
      } else {
        emit('hightlight-product', shopStore.sessionCache.recommendations[1])
      }
    }
    // if (!recommendations.value) {
    //   const data = await getProducts()
    //   recommendations.value = data[1]
    //   emit('hightlight-product', data[0])
    // } else {
    //   emit('hightlight-product', recommendations.value[1])
    // }
  } catch (e) {
    console.log(e)
  }
}

onBeforeMount(requestSampleProducts)
</script>
