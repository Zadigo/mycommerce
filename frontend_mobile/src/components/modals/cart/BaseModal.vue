<template>
  <ion-modal :is-open="show">
    <ion-content>
      <ion-nav :root="shipmentOptions" />
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonModal,
  IonNav
} from '@ionic/vue';
import { markRaw } from 'vue';

import ShipmentOptions from './ShipmentOptions.vue';

const emit = defineEmits({
  close() {
    return true
  }
})

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const shipmentOptions = markRaw(ShipmentOptions)
</script>
