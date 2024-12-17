<template>
  <ion-row>
    <ion-col v-for="sampleProduct in sampleProducts" :key="sampleProduct.id" size="6">
      <ion-img :src="mediaPath(sampleProduct.get_main_image?.original)" :alt="sampleProduct.name" @click="handleGoToProduct(sampleProduct)" />
    </ion-col>

    <ion-col size="12" style="display: flex; justify-content: center;">
      <ion-button fill="outline" color="dark" @click="handleGoToCollectionByName('all')">
        Voir tout les styles
      </ion-button>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { useDjangoUtilies } from '@/composables/utils';
import { client } from '@/plugins/axios';
// import { useVueSession } from '@/plugins/vue-storages';
import { Product } from '@/types';
import { IonButton, IonCol, IonImg, IonRow } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';
import { useSessionStorage } from '@vueuse/core'

const sampleProducts = ref<Product[]>([])
const { handleGoToCollectionByName, handleGoToProduct } = useShopComposable()
const { mediaPath } = useDjangoUtilies()
// const { instance  } = useVueSession()

const emit = defineEmits({
  'hightlight-product' (_data: Product | undefined) {
    return true
  }
})

const recommendations = useSessionStorage<Product[]>('recommendations', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    },
  }
})

/**
 * Gets a sample amount of products that can be shown
 * on the initial home of the app
 */
async function requestSampleProducts () {
  async function getProducts (): Promise<[Product, Product[]]> {
    const response = await client.get('/shop/products/recommendations', {
      params: { m: 1, q: 5, i: 1 }
    })
    const result = response.data
    return [result[2], result]
  }

  try {
    if (!recommendations.value) {
      const data = await getProducts()
      recommendations.value = data[1]
      emit('hightlight-product', data[0])
    } else {
      emit('hightlight-product', recommendations.value[1])
    }
  } catch (e) {
    console.log(e)
  }
}

onBeforeMount(requestSampleProducts)
</script>
