<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Bershka</ion-title>
        </ion-toolbar>
      </ion-header>

      <HomeExplorer />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { client } from '@/plugins/axios';
import { useVueSession } from '@/plugins/vue-storages';
import { Collections } from '@/types/collections';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';

import HomeExplorer from '@/components/home/HomeExplorer.vue';

const { instance } = useVueSession()
const collections = ref<Collections[]>([])

/**
 * Gets all the names of the collections that are
 * available to be displayed on this page
 * 
 * @listens
 */
const requestCollectionNames = async function () {
  try {
    const numberOfItems = instance.listCount('collections', false)
    if (numberOfItems === 0) {
      const response = await client.get('collection')
      instance.create('collections', response.data)
    }

    collections.value = instance.retrieve('collections')
  } catch (e) {
    console.error('CollectionPage', e)
  }
}

/**
 */
// handleGridSize (size: number): void {
//   currentGridSize = size
// }

onBeforeMount(() => {
  requestCollectionNames()
})
</script>
