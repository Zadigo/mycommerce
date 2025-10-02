<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button :icon="arrowBackOutline" :text="null" default-href="/" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Feed -->
      <products-feed-base />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { arrowBackOutline } from 'ionicons/icons'
</script>
