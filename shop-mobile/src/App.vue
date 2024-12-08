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
import { useCookies } from '@vueuse/integrations/useCookies';

const shopStore = useShop()
const authenticationStore = useAuthentication()
const { get } = useCookies()

onBeforeMount(() => {
  shopStore.loadFromCache()
  authenticationStore.access = get<string | undefined>('access')
})
</script>
