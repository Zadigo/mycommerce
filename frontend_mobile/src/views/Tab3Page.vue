<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Panier</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <!-- <EmptyCart @show-login-modal="() => {}" /> -->
      <CartItems />

      <ion-row class="ion-padding">
        <ion-col size="12">
          <p>Cela peut t'intéresser</p>
        </ion-col>
      </ion-row>

      <ion-row class="ion-padding">
        <ion-col size="12">
          <div class="price" style="display:flex;justify-content:space-between;">
            <span>Total</span>
            <span>45.99€</span>
          </div>

          <ion-row style="text-align: center;">
            <ion-col size="6">
              <ion-button color="dark" expand="block">
                Commander
              </ion-button>
            </ion-col>
            <ion-col size="6">
              <ion-button color="dark" expand="block">
                Google pay
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useCart } from '@/stores/cart';
import { IonButton, IonCol, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/vue';
import { storeToRefs } from 'pinia';


import CartItems from '@/components/cart/CartItems.vue';
// import EmptyCart from '@/components/cart/EmptyCart.vue';


const router = useIonRouter()
const storeShop = useCart()
const { products } = storeToRefs(storeShop)

/**
 * 
 */
function handleGoToCollection (name: string) {
  name
  router.push('/tabs/tab1/products')
}
</script>

<style scoped>
.price {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}
.price span:first-child, .price span:last-child {
  font-weight: 700;
}
</style>
