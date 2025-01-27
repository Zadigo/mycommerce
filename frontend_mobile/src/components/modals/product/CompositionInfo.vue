<template>
  <base-modal :show="show" @close="emit('close')">
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <h5>Extérieur</h5>
          <p class="fw-light">100% coton</p>
          <p class="fw-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore corporis debitis fuga doloribus distinctio assumenda similique rem maxime sunt. Quibusdam exercitationem, modi soluta at debitis nobis voluptas obcaecati sint aliquam?</p>
        </ion-col>

        <ion-col size="12">
          <h5>Entretien</h5>
          <p class="fw-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum minus deleniti sunt veritatis recusandae nesciunt, eos quos sit maxime repellendus, tempore itaque tenetur soluta voluptas dolor ea perspiciatis possimus? Neque?</p>

          <ion-list>
            <ion-item v-for="item in ['No bleaching', 'Washing 30']" :key="item" lines="none">
              <ion-img :src="findLaundryIcon(item)" slot="start" />
              <ion-label class="fw-light">{{ findLaundryIcon(item, 'label') }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-col>

        <ion-col size="12">
          <h5>Traçabilité</h5>
          <p class="fw-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum minus deleniti sunt veritatis recusandae nesciunt, eos quos sit maxime repellendus, tempore itaque tenetur soluta voluptas dolor ea perspiciatis possimus? Neque?</p>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-modal>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonImg, IonItem, IonLabel, IonList, IonRow } from '@ionic/vue';

import { findLaundryIcon } from '@/data';
import BaseModal from '../BaseModal.vue';

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
