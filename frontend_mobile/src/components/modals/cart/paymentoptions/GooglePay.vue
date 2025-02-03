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
          <ion-input type="text" autocomplete="cc-number" />
          <ion-input type="text" autocomplete="cc-exp" />
          <ion-input type="text" autocomplete="cc-csc" />
          <ion-input type="text" autocomplete="name" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonButtons,
  IonGrid,
  IonInput,
  IonRow,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonNavLink,
  IonCol
} from '@ionic/vue'
</script>
