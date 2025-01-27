<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-button>
          <ion-icon :icon="close" />
        </ion-button>
      </ion-buttons>

      <ion-title>
        Mode d'expéditions
      </ion-title>
    </ion-toolbar>
  </ion-header>
  
  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <ion-list class="ion-margin-top">
            <ion-nav-link v-for="option in options" :key="option.name" :component="option.component" router-direction="forward">
              <ion-item button class="ion-margin-bottom" lines="none">
                <ion-label>
                  <p class="fw-bold">{{ option.name  }}</p>
                  <p>Some quick description</p>
                  <p class="fw-bold">5€</p>
                </ion-label>
              </ion-item>
            </ion-nav-link>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
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
  IonItem,
  IonLabel,
  IonList,
  IonNavLink,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { markRaw, ref } from 'vue';
import { close } from 'ionicons/icons'

import RelayOptions from './RelayOptions.vue';
import ShippingOptions from './ShippingOptions.vue';
import ShopOptions from './ShopOptions.vue';

defineEmits({
  close() {
    return true
  }
})

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const shopOptions = markRaw(ShopOptions)
const shippingOptions = markRaw(ShippingOptions)
const relayOptions = markRaw(RelayOptions)

const options = ref([
  {
    name: 'Récupération en 4h',
    component: shopOptions
  },
  {
    name: 'Livraison en magasin',
    component: shopOptions
  },
  {
    name: 'Standard à domicile',
    component: shippingOptions
  },
  {
    name: 'Express à domicile',
    component: shippingOptions
  },
  {
    name: 'Point relais',
    component: relayOptions
  }
])
</script>

<style lang="scss" scoped>
ion-item {
  border: 1px solid rgba(0, 0, 0, .15);
}
</style>
