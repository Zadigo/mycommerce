<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/">
          <ion-icon :icon="homeOutline" />
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon :icon="searchOutline" />
        </ion-tab-button>

        <!-- href="/cart" -->
        <ion-tab-button>
          <ion-icon :icon="cartOutline" />
        </ion-tab-button>

        <ion-tab-button tab="account" href="/account">
          <ion-icon :icon="personCircleOutline" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { homeOutline, personCircleOutline, cartOutline, searchOutline } from 'ionicons/icons'
</script>
