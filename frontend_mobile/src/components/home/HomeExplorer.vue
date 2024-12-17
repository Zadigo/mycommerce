<template>
  <ion-grid style="padding-left: 0;padding-right: 0;padding-top: 0;">
    <!-- Collections -->
    <ion-row>
      <ion-col size="12" style="padding-left: 0;padding-right: 0;padding-top: 0;">
        <div id="video-container">
          <swiper-container pagination="true" @swiperslidechange="() => {}">
            <swiper-slide>
              <video autoplay muted loop lazy="true" @click="handleGoToCollectionByName('all')">
                <source src="/vid1.mp4" type="video/mp4">
              </video>
            </swiper-slide>

            <swiper-slide lazy="true" @click="handleGoToCollectionByName('jupes')">
              <img src="/img1.jpg" loading="lazy" />
            </swiper-slide>

            <swiper-slide lazy="true" @click="handleGoToCollection('all')">
              <img src="/img4.jpg" loading="lazy" />
            </swiper-slide>
          </swiper-container>
        </div>
      </ion-col>

      <ion-col v-for="collection in collections" :key="collection.id" size="3">
        <ion-img :src="`/img4.jpg`" @click="handleGoToCollection(collection)" />
        <p style="font-size: .6rem;text-align: center;">
          {{ collection.name }}
        </p>
      </ion-col>
    </ion-row>

    <!-- Product Highlight -->
    <ion-row v-if="highlightProduct">
      <ion-col size="12" style="padding-left: 0;padding-right: 0;padding-top: 0;">
        <ion-img src="/img1.jpg" :alt="highlightProduct.name" @click="handleGoToProduct(highlightProduct)" />
      </ion-col>
    </ion-row>

    <!-- Recommendations -->
    <Suspense>
      <template #default>
        <AysncHomeRecommendations @hightlight-product="handleHighlightProduct" />
      </template>
    </Suspense>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/vue';
import { useShopComposable } from '@/composables/shop';
import { client } from '@/plugins/axios';
// import { useErrorHandler } from '@/composables/errors'
import { ProductCollection, Product } from '@/types/shop';
import { useSessionStorage } from '@vueuse/core'
import { register } from 'swiper/element';
import { defineAsyncComponent, onBeforeMount, ref } from 'vue';

register()

const AysncHomeRecommendations = defineAsyncComponent({
  loader: async () => import('./HomeRecommendations.vue'),
  timeout: 5000
})

const collections = useSessionStorage('collections', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const { handleGoToProduct, handleGoToCollection, handleGoToCollectionByName } = useShopComposable()

function useLoadCollections () {
  // const { handleError } = useErrorHandler()
  const highlightProduct = ref<Product>()

  async function requestCollectionNames () {
    try {
      if (!collections.value) {
        const response = await client.get<ProductCollection[]>('collection')
        collections.value = response.data 
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  async function handleHighlightProduct (product: Product) {
    highlightProduct.value = product
  }
  
  return {
    highlightProduct,
    handleHighlightProduct,
    requestCollectionNames
  }
}

const { requestCollectionNames, highlightProduct, handleHighlightProduct } = useLoadCollections()

onBeforeMount(requestCollectionNames)
</script>

<style scoped>
#carousel {
  overflow-y: hidden;
}

#video-container {
  width: 100%;
  height: auto;
}

#video-container video {
  width: 100%;
}
</style>
