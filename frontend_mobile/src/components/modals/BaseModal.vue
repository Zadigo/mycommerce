<template>
  <ion-modal :is-open="show" @did-dismiss="emit('close')">
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-button @click="emit('close')">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <slot />
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/vue';
import { close } from 'ionicons/icons';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits({
  close() {
    return true
  }
})
</script>
