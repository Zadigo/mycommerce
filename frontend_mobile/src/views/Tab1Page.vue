<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="font-weight: 800;text-transform: uppercase;text-align: center;font-size: 1.4rem;">
          My commerce
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <Suspense>
        <template #default>
          <AsyncHomeExplorer />
        </template>
        
        <template #fallback>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </template>
      </Suspense>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonSkeletonText, IonToolbar } from '@ionic/vue';

const AsyncHomeExplorer = defineAsyncComponent({
  loader: async () => import('@/components/home/HomeExplorer.vue'),
  timeout: 5000
})
</script>
