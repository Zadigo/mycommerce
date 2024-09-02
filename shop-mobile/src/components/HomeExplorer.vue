<template>
  <ion-grid style="padding-left: 0;padding-right: 0;padding-top: 0;">
    <!-- Collections -->
    <ion-row>
      <ion-col size="12" style="padding-left: 0;padding-right: 0;padding-top: 0;">
        <div id="video-container">
          <swiper-container pagination="true" @swiperslidechange="() => {}">
            <swiper-slide>
              <video autoplay muted loop lazy="true" @click="handleGoToCollection({ id: 1 })">
                <source src="/vid1.mp4" type="video/mp4">
              </video>
            </swiper-slide>

            <swiper-slide lazy="true" @click="handleGoToCollection({ id: 2 })">
              <img src="/img1.jpg" loading="lazy" />
            </swiper-slide>

            <swiper-slide lazy="true" @click="handleGoToCollection({ id: 2 })">
              <img src="/img4.jpg" loading="lazy" />
            </swiper-slide>
          </swiper-container>
        </div>
      </ion-col>

      <ion-col v-for="collection in collections" :key="collection.id" size="3">
        <ion-img :src="`/img3.jpg`" @click="handleGoToCollection(collection)"></ion-img>
        <p style="font-size: .6rem;text-align: center;">{{ `Collection ${collection.id}` }}</p>
      </ion-col>
    </ion-row>

    <!-- Product Highlight -->
    <ion-row>
      <ion-col size="12" style="padding-left: 0;padding-right: 0;padding-top: 0;">
        <ion-img src="/img3.jpg" @click="handleGoToProduct({ id: 1, name: 'Jupe' })"></ion-img>
      </ion-col>
    </ion-row>

    <!-- Product Recommendations -->
    <ion-row>
      <ion-col v-for="sampleProduct in sampleProducts" :key="sampleProduct.id" size="6">
        <ion-img :src="`/img3.jpg`" :alt="sampleProduct.name" @click="handleGoToProduct(sampleProduct)"></ion-img>
      </ion-col>

      <ion-col size="12" style="display: flex; justify-content: center;">
        <ion-button fill="outline" color="dark" @click="handleGoToCollection({ id: 1 })">
          Voir tout les styles
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { useProducts } from '@/composables/shop';
import { Product, ProductCollections } from '@/types/collections';
import { IonButton, IonCol, IonGrid, IonImg, IonRow } from '@ionic/vue';
import { onBeforeMount, PropType, ref } from 'vue';
import { register } from 'swiper/element';

register()

const sampleProducts = ref<Product[]>([])
const { handleGoToProduct, handleGoToCollection } = useProducts()

defineProps({
  collections: {
    type: Array as PropType<ProductCollections[]>,
    required: true
  }
})

onBeforeMount(() => {
  requestSampleProducts()
})

/**
 * 
 */
const requestSampleProducts = async function () {
  Array.from({ length: 4 }, (a, b) => {
    sampleProducts.value.push({
      id: b,
      name: `Product ${b}`
    })
  })
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
  /* height: 100%; */
  width: 100%;
}
</style>
