<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-button slot="start" @click="router.back()">
            <font-awesome-icon icon="chevron-left" />
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button>
            <font-awesome-icon :icon="['fas', 'heart']"></font-awesome-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header> -->
    
    <ion-content>
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

      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col id="img-block" size="12" class="ion-no-padding ion-padding-bottom">
            <!-- https://swiperjs.com/element -->
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

      <ion-modal :is-open="showDetailsModal" :initial-breakpoint="0.35" :breakpoints="[0.35, 1]" :backdrop-dismiss="false" :backdrop-breakpoint="0.5" handle-behavior="cycle">
        <ion-content class="ion-padding">
          <ion-col size="12">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h1 v-if="currentProduct" style="font-size: 1.2rem; margin: 1rem 0rem auto;">
                {{ currentProduct.name }}
              </h1>

              <p v-if="currentProduct" style="margin: 1rem 0rem auto;">
                {{ currentProduct.get_price }}€  
              </p>
            </div>

            <ion-button color="dark" expand="block">
              Sélectionner une taille
            </ion-button>

            <p>Multicouleur: Réf: 12345</p>
          </ion-col>

          <ion-col size="12">
            <h3>A propos du produit</h3>
            <ion-list>
              <ion-item button lines="full">Composition, soin et traçabilité</ion-item>
              <ion-item button lines="full">Livraison et retours</ion-item>
            </ion-list>
          </ion-col>

          <ion-col size="12">
            <h3>Cela peut t'intéresser</h3>
            <grid-display :products="recommendations" :columns="2"></grid-display>
          </ion-col>
        </ion-content>
      </ion-modal>
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
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  useIonRouter
} from '@ionic/vue';

import { useCartComposable } from '@/composables/cart';
import { useShopComposable } from '@/composables/shop';
import { useDjangoUtilies } from '@/composables/utils';
import { client } from '@/plugins/axios';
import { useShop } from '@/stores/shop';
import { Product } from '@/types';
import { useLocalStorage } from '@vueuse/core';
import { shareSocial } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { register } from 'swiper/element';
import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import GridDisplay from '@/components/products/GridDisplay.vue';

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
const { addToCart } = useCartComposable()

const showDetailsModal = ref(false)
const recommendations = ref<Product[]>([])

/**
 * 
 */
async function requestRecommendations () {
  try {
    if (currentProduct.value) {
      const response = await client.get('shop/products/recommendations', {
        params: {
          q: 30,
          p: currentProduct.value.id
        }
      })
      recommendations.value = response.data
    }
  } catch (e) {
    console.log(e)
  }
}

onBeforeMount(async () => {
  showDetailsModal.value = true
  await requestRecommendations()
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
