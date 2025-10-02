<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="radio" href="/search">
          <ion-icon :icon="radio" />
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="library" href="/cart">
          <ion-icon :icon="library" />
          <ion-label>Cart</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/account">
          <ion-icon :icon="search" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { home, radio, library, search } from 'ionicons/icons'
</script>
