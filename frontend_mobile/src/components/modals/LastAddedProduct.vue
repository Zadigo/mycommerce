<template>
  <ion-modal :is-open="show" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]" :backdrop-breakpoint="0.5" @did-dismiss="emit('close')">
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            Produit ajouté
            
            <ion-button @click="router.push('/tabs/tab3')">
              Accéder au panier
              <ion-icon :icon="arrowForward" />
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonCol, IonContent, IonGrid, IonModal, IonRow, IonButton, IonIcon, useIonRouter } from '@ionic/vue';
import { arrowForward } from 'ionicons/icons'
import { onBeforeRouteLeave } from 'vue-router';

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

const router = useIonRouter()

onBeforeRouteLeave(() => {
  emit('close')
})
</script>
