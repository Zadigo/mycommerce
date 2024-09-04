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

            <swiper-slide lazy="true" @click="handleGoToCollectionByName('all')">
              <img src="/img1.jpg" loading="lazy" />
            </swiper-slide>

            <swiper-slide lazy="true" @click="handleGoToCollection('all')">
              <img src="/img4.jpg" loading="lazy" />
            </swiper-slide>
          </swiper-container>
        </div>
      </ion-col>

      <ion-col v-for="collection in collections" :key="collection.id" size="3">
        <ion-img :src="`/img4.jpg`" @click="handleGoToCollection(collection)"></ion-img>
        <p style="font-size: .6rem;text-align: center;">
          {{ collection.name }}
        </p>
      </ion-col>
    </ion-row>

    <!-- Product Highlight -->
    <ion-row>
      <ion-col size="12" style="padding-left: 0;padding-right: 0;padding-top: 0;">
        <ion-img src="/img1.jpg" :alt="highlightProduct.name" @click="handleGoToProduct(highlightProduct)"></ion-img>
      </ion-col>
    </ion-row>

    <!-- Recommendations -->
    <AysncHomeRecommendations @hightlight-product="handleHighlightProduct" />
  </ion-grid>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { client } from '@/plugins/axios';
import { useVueSession } from '@/plugins/vue-storages';
import { ProductCollection, Product } from '@/types/shop';
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/vue';
import { register } from 'swiper/element';
import { defineAsyncComponent, onBeforeMount, ref } from 'vue';

const AysncHomeRecommendations = defineAsyncComponent({
  loader: () => import('./HomeRecommendations.vue'),
  timeout: 5000
})

register()

const collections = ref<ProductCollection[]>([])
const highlightProduct = ref<Product>({})
const { handleGoToProduct, handleGoToCollection, handleGoToCollectionByName } = useShopComposable()
const { instance } = useVueSession()

onBeforeMount(() => {
  requestCollectionNames()
})

/**
 * Gets all the names of the collections that are
 * available to be displayed on this page
 * 
 * @listens
 */
const requestCollectionNames = async function (): Promise<void> {
  try {
    const numberOfItems = instance.listCount('collections', false)
    
    if (numberOfItems === 0) {
      const response = await client.get('collection')
      instance.create('collections', response.data)
    }

    collections.value = instance.retrieve('collections')
  } catch (e) {
    console.error('CollectionPage', e)
  }
}

const handleHighlightProduct = function (product: Product) {
  highlightProduct.value = product
}
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
