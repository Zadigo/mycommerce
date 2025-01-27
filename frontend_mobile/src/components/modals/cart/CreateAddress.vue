<template>
  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <p class="fw-bold">Mes addresses</p>
          <ion-list>
            <ion-input v-model="cartStore.requestData.firstname" placeholder="Firstname" />
            <ion-input v-model="cartStore.requestData.lastname" placeholder="Lastname" />
            <ion-input v-model="cartStore.requestData.email" placeholder="Email" />
            <ion-input v-model="cartStore.requestData.telephone" placeholder="Telephone" />
            <ion-input v-model="cartStore.requestData.address_line" placeholder="Address line" />
            <ion-input v-model="cartStore.requestData.zip_code" placeholder="Zip code" />
            <ion-input placeholder="Province" />
            <ion-input v-model="cartStore.requestData.city" placeholder="City" />

            <ion-nav-link :component="shippingOptions" router-direction="back">
              <ion-button expand="block">
                Continuer
              </ion-button>
            </ion-nav-link>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import { useCart } from '@/stores/cart';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonList,
  IonNavLink,
  IonRow
} from '@ionic/vue';
import { markRaw } from 'vue';
import ShippingOptions from './ShippingOptions.vue';

const cartStore = useCart()

const shippingOptions = markRaw(ShippingOptions)
</script>
