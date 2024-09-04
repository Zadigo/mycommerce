<template>
  <ion-row>
    <ion-col v-for="sampleProduct in sampleProducts" :key="sampleProduct.id" size="6">
      <ion-img :src="conditionalImagePath(sampleProduct.get_main_image?.original)" :alt="sampleProduct.name" @click="handleGoToProduct(sampleProduct)"></ion-img>
    </ion-col>

    <ion-col size="12" style="display: flex; justify-content: center;">
      <ion-button fill="outline" color="dark" @click="handleGoToCollectionByName('all')">
        Voir tout les styles
      </ion-button>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useShopComposable, useShopUtilities } from '@/composables/shop';
import { client } from '@/plugins/axios';
import { useVueSession } from '@/plugins/vue-storages';
import { Product } from '@/types/shop';
import { IonButton, IonCol, IonImg, IonRow } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';

const sampleProducts = ref<Product[]>([])
const { handleGoToCollectionByName, handleGoToProduct } = useShopComposable()
const { conditionalImagePath } = useShopUtilities()
const { instance  } = useVueSession()

const emit = defineEmits(['hightlight-product'])

onBeforeMount(() => {
  requestSampleProducts()
})

/**
 * Gets a sample amount of products that can be shown
 * on the initial home of the app
 */
const requestSampleProducts = async function () {
  const getProducts = async (): Promise<[Product, Product[]]> => {
    const response = await client.get('/shop/products/recommendations', {
      params: { m: 1, q: 5, i: 1 }
    })
    const result = response.data
    return [result.pop(0), result]
  }

  try {
    if (instance.keyExists('recommendations')) {
      sampleProducts.value = instance.getOrExpire('recommendations', () => {
        const response = getProducts()
        instance.expire('recommendations', response.data, 22500)
      })
    } else {
      const items = getProducts()
      emit('hightlight-product', items[0])
      sampleProducts.value = items[1]
      instance.expire('recommendations', items[1], 54000)
    }
  } catch (e) {
    console.log(e)
  }
}
</script>
