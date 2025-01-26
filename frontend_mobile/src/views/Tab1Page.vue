<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <h1>My commerce</h1>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <Suspense>
        <AsyncHomeExplorer />

        <template #fallback>
          <ion-skeleton-text :animated="true" />
        </template>
      </Suspense>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { IonContent, IonHeader, IonPage, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/vue';

const AsyncHomeExplorer = defineAsyncComponent({
  loader: async () => import('@/components/home/HomeExplorer.vue'),
  timeout: 5000
})
</script>

<style scoped>
h1 {
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
  font-size: 1.4rem;
}
</style>
