<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-nav-link router-direction="back">
          <ion-back-button :text="''" />
        </ion-nav-link>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <ion-list class="ion-margin-top ion-margin-bottom">
            <template v-for="option in options" :key="option.name">
              <ion-nav-link :component="option.component" router-direction="forward">
                <ion-item button class="ion-margin-bottom" lines="none">
                  <ion-icon slot="end" :icon="option.icon" />
                  <ion-label>
                    {{ option.name }}
                  </ion-label>
                </ion-item>
              </ion-nav-link>
            </template>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonBackButton,
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
  IonToolbar
} from '@ionic/vue';
import { card, logoGoogle } from 'ionicons/icons';
import { markRaw } from 'vue';

import CardPayment from './paymentoptions/CardPayment.vue';
import GooglePay from './paymentoptions/GooglePay.vue';

const cardPayment = markRaw(CardPayment)
const googlePayment = markRaw(GooglePay)

const options = [
  {
    name: 'Carte bancaire',
    component: cardPayment,
    icon: card
  },
  {
    name: 'Google Pay',
    component: googlePayment,
    icon: logoGoogle
  }
]
</script>

<style lang="scss" scoped>
ion-item {
  border: 1px solid black;
}
</style>
