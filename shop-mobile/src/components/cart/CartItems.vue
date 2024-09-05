<template>
  <ion-row class="ion-padding">
    <ion-col v-for="i in 2" :key="i" size="12">
      <ion-card>
        <div class="cart-item">
          <ion-img src="/img1.jpg" @click="handleGoToProduct"></ion-img>
          <div class="infos">
            <div class="price">
              <span>9.99€</span>
              <div class="actions">
                <ion-button fill="clear" size="small" color="dark" @click="handleProductModification">
                  <ion-icon :icon="pencil"></ion-icon>
                </ion-button>
                <ion-button fill="clear" size="small" color="dark">
                  <ion-icon :icon="trash"></ion-icon>
                </ion-button>
              </div>
            </div>
            <p>Top sans manche avec autre chose</p>
            <span>XS</span>
          </div>
        </div>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { IonRow, IonCol, IonCard, IonImg, IonButton, IonIcon, useIonRouter } from '@ionic/vue';
import { pencil, trash } from 'ionicons/icons';

const { handleGoToProduct } = useShopComposable()

const router = useIonRouter()

const handleProductModification = function () {
  router.push('tab3/product/modify')
}
</script>

<style scoped>
ion-card {
  box-shadow: none;
  border-radius: 0;
  padding: 0;
}

ion-img {
  width: 200px;
  height: auto;
  margin-right: 5%;
}

.cart-item {
  display: flex;
  justify-content: start;
}

.infos .price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
