<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onBeforeMount } from 'vue';
import { useShop } from './stores/shop';

const shopStore = useShop()

onBeforeMount(() => {
  shopStore.loadFromCache()
})
</script>
