<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Panier
        </ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Panier ({{ cartStore.numberOfProducts }})
          </ion-title>
        </ion-toolbar>
      </ion-header>
      
      <!-- <EmptyCart @show-login-modal="() => {}" /> -->
      <cart-items />

      <ion-row class="ion-padding">
        <ion-col size="12">
          <p>Cela peut t'intéresser</p>
          <grid-display :columns="3" />
        </ion-col>
      </ion-row>

      <ion-row class="ion-padding">
        <ion-col size="12">
          <div class="price" style="display:flex;justify-content:space-between;">
            <span>Total</span>
            <span>{{ cartStore.cartTotal }}€</span>
          </div>

          <ion-row style="text-align: center;">
            <ion-col size="6">
              <ion-button v-if="authStore.isAuthenticated" color="dark" expand="block" @click="showPaymentModal=true">
                Commander
              </ion-button>
              <ion-button v-else color="dark" expand="block" @click="authStore.showLoginDrawer=true">
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

    <!-- Modals -->
    <login-modal />
    <payment-modal :show="showPaymentModal" @close="showPaymentModal=false" />
  </ion-page>
</template>

<script setup lang="ts">
import { useAuthentication } from '@/stores/authentication';
import { useCart } from '@/stores/cart';
import { IonButton, IonCol, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/vue';
import { useHead } from '@unhead/vue';
import { ref } from 'vue';

import CartItems from '@/components/cart/CartItems.vue';
import PaymentModal from '@/components/modals/cart/BaseModal.vue';
import LoginModal from '@/components/modals/LoginModal.vue';
import GridDisplay from '@/components/products/GridDisplay.vue';

// import EmptyCart from '@/components/cart/EmptyCart.vue';

const authStore = useAuthentication()
const cartStore = useCart()

useHead({
  script: [
    {
      async: true,
      src: 'https://js.stripe.com/v3/'
    }
  ]
})


const showPaymentModal= ref(false)
</script>

<style scoped>
.price {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.price span:first-child, .price span:last-child {
  font-weight: 700;
}

.cart-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
}
</style>
