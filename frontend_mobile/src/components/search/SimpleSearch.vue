<template>
  <div class="simple-search ion-padding" style="padding-top: 0;">
    <ion-col size="12">
      <h3 style="margin-top: 0;">Rechercher</h3>
    </ion-col>

    <ion-col size="12">
      <ion-input fill="outline" placeholder="Rechercher" @ion-focus="emit('search-focused', true)">
        <ion-icon slot="start" :icon="search" aria-hidden="true"></ion-icon>
        <ion-button fill="clear" slot="end" aria-label="Show/hide">
          <ion-icon slot="icon-only" :icon="close" aria-hidden="true"></ion-icon>
        </ion-button>
      </ion-input>
    </ion-col>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonCol, IonIcon, IonInput } from '@ionic/vue';
import { close, search } from 'ionicons/icons';

const emit = defineEmits(['search-focused', 'search-unfocused'])
</script>
