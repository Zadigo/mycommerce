<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onBeforeMount } from 'vue';
import { useShop } from './stores/shop';
import { useAuthentication } from './stores/authentication';

const shopStore = useShop()
const authenticationStore = useAuthentication()

onBeforeMount(() => {
  shopStore.loadFromCache()
  authenticationStore.loadFromCache()
})
</script>
