<template>
  <div class="focused-search ion-padding">    
    <ion-col size="12">
      <ion-input v-model="search" ref="input" fill="outline" placeholder="Rechercher" @ion-blur="emit('search-unfocused')" @keypress="requestSearchProducts">
        <ion-icon slot="start" :icon="searchIcon" aria-hidden="true"></ion-icon>
        <ion-button fill="clear" slot="end" aria-label="Show/hide" @click="emit('search-unfocused')">
          <ion-icon slot="icon-only" :icon="close" aria-hidden="true"></ion-icon>
        </ion-button>
      </ion-input>
    </ion-col>

    <ion-col size="12">
      <ion-button v-for="i in 4" :key="i" class="ion-margin-top" color="warning" fill="outline" size="small" @click="handleGoToCollectionByName(`Name ${i}`)">
        <ion-icon :icon="thermometerOutline"></ion-icon>
        Jupes
      </ion-button>
    </ion-col>
  </div>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { client } from '@/plugins/axios';
import { IonButton, IonCol, IonIcon, IonInput } from '@ionic/vue';
import { close, search as searchIcon, thermometerOutline } from 'ionicons/icons';
import _ from 'lodash';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['search-focused', 'search-unfocused', 'update-search'])
const { handleGoToCollectionByName } = useShopComposable()
const search = ref<string>('')

const requestSearchProducts = _.debounce(async () => {
  try {
    const response = await client.get('/shop/products/search', {
      params: {
        q: search.value
      }
    })
    emit('update-search', response.data)
  } catch (e) {
    console.log(e)
  }
}, 400)

onMounted(() => {
  // input.value?.focus()
})
</script>
