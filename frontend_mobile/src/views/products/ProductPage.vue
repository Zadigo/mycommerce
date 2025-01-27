<template>
  <ion-page>    
    <ion-content>
      <!-- Nav -->
      <div class="top-nav">
        <ion-buttons>
          <ion-button slot="start" @click="router.back()">
            <font-awesome-icon icon="chevron-left" />
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button>
            <font-awesome-icon :icon="['fas', 'heart']" />
          </ion-button>
        </ion-buttons>
      </div>

      <!-- Content -->
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col id="img-block" size="12" class="ion-no-padding ion-padding-bottom" @click="showImageZoomed=true">
            <swiper-container v-if="currentProduct" pagination="true" @swiperslidechange="() => {}">
              <swiper-slide v-for="image in currentProduct.images" :key="image.id">
                <!-- <img :src="mediaPath(image?.original)" /> -->
                <div class="image-container">
                  <div class="image" :style="`background-image: url('${mediaPath(image.original)}');`" />
                </div>
              </swiper-slide>
            </swiper-container>
            <div v-else>Images to swipe</div>

            <ion-button id="btn-share" color="light" shape="round" fill="clear" style="z-index: 2000;">
              <ion-icon :icon="shareSocial" />
            </ion-button>

            <ion-button id="btn-heart" color="light" shape="round" style="z-index: 2000;" @click="handleLike(likedProducts, currentProduct)">
              <font-awesome-icon v-if="isLiked" :icon="['fas', 'heart']" />
              <font-awesome-icon v-else :icon="['far', 'heart']" />
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Modals -->
      <composition-info :show="showCompositionInfoModal" @close="showCompositionInfoModal=false" />
      <delivery-info :show="showDeliveryInfoModal" @close="showDeliveryInfoModal=false" />
      <product-info :show="showDetailsModal" @composition-modal="showCompositionInfoModal=true" @delivery-modal="showDeliveryInfoModal=true" />
      <image-zoom v-if="currentProduct" :images="currentProduct.images" :show="showImageZoomed" @close="showImageZoomed=false" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  useIonRouter
} from '@ionic/vue';

import { useShopComposable } from '@/composables/shop';
import { useDjangoUtilies } from '@/composables/utils';
import { useShop } from '@/stores/shop';
import { useLocalStorage } from '@vueuse/core';
import { shareSocial } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { register } from 'swiper/element';
import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import CompositionInfo from '@/components/modals/product/CompositionInfo.vue';
import DeliveryInfo from '@/components/modals/product/DeliveryInfo.vue';
import ImageZoom from '@/components/modals/product/ImageZoom.vue';
import ProductInfo from '@/components/modals/product/ProductInfo.vue';

// https://swiperjs.com/element
register()

const likedProducts = useLocalStorage('likedProducts', null, {
  serializer: {
    read(raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    },
  }
})

const router = useIonRouter()
const shopStore = useShop()
const { visitedProducts, currentProduct } = storeToRefs(shopStore)
const { isLiked, handleLike } = useShopComposable()
const { mediaPath } = useDjangoUtilies()

const showDetailsModal = ref(false)
const showCompositionInfoModal = ref(false)
const showDeliveryInfoModal = ref(false)
const showImageZoomed = ref(false)

onBeforeMount(async () => {
  showDetailsModal.value = true
})

onMounted(() => {
  if (currentProduct.value) {
    const currentProductId = currentProduct.value.id
    
    if (likedProducts.value.includes(currentProductId)) {
      isLiked.value = true
    }
  
    nextTick(() => {
      visitedProducts.value.push(currentProductId)
    })
  }
})

onBeforeRouteLeave(() => {
  showDetailsModal.value = false
})
</script>

<style lang="scss" scoped>
ion-grid {
  padding-top: 0;
}

#img-block {
  position: relative;
}

#btn-share {
  position: absolute;
  right: 3%;
  bottom: 3%;
}

#btn-heart {
  position: absolute;
  right: 3%;
  bottom: 13%;
}

.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}

ion-content {
  position: relative;
}

#img-block {
  position: relative;
}

.image-container {
  height: 630px;
  width: 100%;

  .image {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    z-index: 1001;
  }
}
</style>
