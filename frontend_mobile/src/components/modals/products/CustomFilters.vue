<template>
  <ion-modal :is-open="show" @will-dismiss="emit('close')">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="emit('close')">
            <ion-icon :icon="closeIcon" />
          </ion-button>
        </ion-buttons>

        <ion-title style="text-align: center;">Filtrer</ion-title>
        
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="handleRemoveFilters">
            Supprimer
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="block-1">
        <p>Trier par</p>
        <ion-button>Nouveautés</ion-button>
      </div>

      <hr>

      <div class="block-1">
        <p>Typologie</p>
        <ion-button>Nouveautés</ion-button>
      </div>

      <hr>

      <div class="block-1">
        <p>Color</p>
        <ion-button>Blue</ion-button>
      </div>

      <hr>

      <div class="block-1">
        <p>Taille</p>
        <ion-button>XS</ion-button>
      </div>
      
      <hr>

      <div class="block-1">
        <p>Prix</p>
        <ion-button>Jusqu'à 15€</ion-button>
      </div>

      <ion-button expand="block" @click="emit('close')">
        Voir les résulats
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/vue';
import { close as closeIcon } from 'ionicons/icons';

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

/**
 * 
 */
function handleRemoveFilters() {}
</script>
