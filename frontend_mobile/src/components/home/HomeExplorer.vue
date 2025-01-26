<template>
  <ion-grid class="ion-no-padding">
    <!-- Collections -->
    <ion-row>
      <ion-col size="12">
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

            <swiper-slide lazy="true" @click="handleGoToCollectionByName('all')">
              <img src="/img4.jpg" loading="lazy" />
            </swiper-slide>
          </swiper-container>
        </div>
      </ion-col>

      <ion-col v-for="collection in cachedCollections" :key="collection.id" size="3">
        <ion-img :src="`/img4.jpg`" @click="handleGoToCollection(collection)" />
        <!-- style="font-size: .6rem;text-align: center;" -->
        <p>
          {{ collection.name }}
        </p>
      </ion-col>
    </ion-row>

    <!-- Product Highlight -->
    <ion-row v-if="highlightProduct">
      <!-- style="padding-left: 0;padding-right: 0;padding-top: 0;" -->
      <ion-col size="12">
        <ion-img src="/img1.jpg" :alt="highlightProduct.name" @click="handleGoToProduct(highlightProduct)" />
      </ion-col>
    </ion-row>

    <!-- Recommendations -->
    <Suspense>
      <AysncHomeRecommendations @hightlight-product="handleHighlightProduct" />
    </Suspense>
  </ion-grid>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { useAxiosClient } from '@/plugins/client';
import { Product, ProductCollection } from '@/types/shop';
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/vue';
import { useLocalStorage } from '@vueuse/core';
import { register } from 'swiper/element';
import { defineAsyncComponent, onBeforeMount, ref } from 'vue';

register()

const AysncHomeRecommendations = defineAsyncComponent({
  loader: async () => import('./HomeRecommendations.vue'),
  timeout: 5000
})

const cachedCollections = useLocalStorage<ProductCollection[]>('collections', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

// Composable for Collection Fetching
function useLoadCollections () {
  const highlightProduct = ref<Product>()
  const { client } = useAxiosClient()

  async function requestCollectionNames () {
    try {
      if (!cachedCollections.value) {
        const response = await client.get<ProductCollection[]>('collection')
        cachedCollections.value = response.data 
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

const { handleGoToProduct, handleGoToCollection, handleGoToCollectionByName } = useShopComposable()
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
