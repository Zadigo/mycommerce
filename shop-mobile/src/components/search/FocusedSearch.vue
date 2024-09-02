<template>
  <div class="focused-search ion-padding">    
    <ion-col size="12">
      <ion-input ref="input" fill="outline" placeholder="Rechercher" @ion-blur="emit('search-unfocused')">
        <ion-icon slot="start" :icon="search" aria-hidden="true"></ion-icon>
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
import { useProducts } from '@/composables/shop';
import { IonButton, IonCol, IonIcon, IonInput } from '@ionic/vue';
import { close, search, thermometerOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['search-focused', 'search-unfocused'])
// const input = ref<HTMLElement>()
const { handleGoToCollectionByName } = useProducts()

onMounted(() => {
  // input.value?.focus()
})
</script>
