<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-button slot="start" @click="router.back()">
            <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button>
            <font-awesome-icon :icon="['fas', 'heart']"></font-awesome-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <ion-grid style="padding-left: 0; padding-right: 0;">
        <ion-row>
          <ion-col id="img-block" size="12" style="padding-left: 0; padding-right: 0; padding-top: 0;">
            <!-- https://swiperjs.com/element -->
            <swiper-container pagination="true" @swiperslidechange="() => {}">
              <swiper-slide v-for="image in currentProduct.images" :key="image.id">
                <img :src="conditionalImagePath(image?.original)" />
              </swiper-slide>
            </swiper-container>

            <ion-button id="btn-share" color="light" shape="round" fill="clear" style="z-index: 2000;">
              <ion-icon :icon="shareSocial"></ion-icon>
            </ion-button>

            <ion-button id="btn-heart" color="light" shape="round" style="z-index: 2000;" @click="handleLike(currentProduct)">
              <font-awesome-icon v-if="isLiked" :icon="['fas', 'heart']"></font-awesome-icon>
              <font-awesome-icon v-else :icon="['far', 'heart']"></font-awesome-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- <ion-modal :is-open="true" :initial-breakpoint="0.25" :breakpoints="[0.25, 0.75, 1]" :backdrop-dismiss="false" :backdrop-breakpoint="0.5" handle-behavior="cycle">
        <ion-content class="ion-padding">
          <ion-col size="12">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h1 style="font-size: 1.2rem; margin: 1rem 0rem auto;">Product name</h1>
              <p style="margin: 1rem 0rem auto;">16€</p>
            </div>

            <ion-button color="dark" expand="block">
              Sélectionner une taille
            </ion-button>

            <p>Multicouleur: Réf: 12345</p>

            <h3>A propos du produit</h3>
            <ion-list>
              <ion-item>Composition, soin et traçabilité</ion-item>
              <ion-item>Livraison et retours</ion-item>
            </ion-list>

            <h3>Cela peut t'intéresser</h3>
            
            <grid-display :products="recommendations" :columns="2"></grid-display>
          </ion-col>
        </ion-content>
      </ion-modal> -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonToolbar,
  useIonRouter
} from '@ionic/vue';

import { useShopComposable, useShopUtilities } from '@/composables/shop';
import { useShop } from '@/stores/shop';
import { Product } from '@/types/collections';
import { shareSocial } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { register } from 'swiper/element';
import { onBeforeMount, onMounted, ref } from 'vue';

register()

const recommendations = ref<Product[]>([])
const router = useIonRouter()
const store = useShop()
const { likedProducts, currentProduct } = storeToRefs(store)
const { conditionalImagePath } = useShopUtilities()
const { isLiked, handleLike } = useShopComposable()

onBeforeMount(() => {
  requestRecommendations()
})

onMounted(() => {
  if (likedProducts.value.includes(currentProduct.value.id)) {
    isLiked.value = true
  }
})

/**
 * 
 */
const requestRecommendations = async function () {
  recommendations.value = Array.from({ length: 40}, (a, b) => {
    return {
      id: b,
      name: `Product ${b}`
    }
  })
}
</script>

<style scoped>
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
</style>
