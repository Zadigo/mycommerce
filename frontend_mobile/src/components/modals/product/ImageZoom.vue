<template>
  <base-modal :show="show" @close="emit('close')">
    <ion-grid class="ion-no-padding">
      <ion-row>
        <ion-col size="12" class="ion-no-padding">
          <div class="image-container">
            <div v-for="image in images" :key="image.original" :style="`background-image: url('${mediaPath(image.original)}');`" class="image" />
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-modal>  
</template>

<script setup lang="ts">
import { useDjangoUtilies } from '@/composables/utils';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import { PropType } from 'vue';

import { ProductImage } from '@/types';
import BaseModal from '../BaseModal.vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  images: {
    type: Object as PropType<ProductImage[]>,
    required: true
  }
})

const emit = defineEmits({
  close() {
    return true
  }
})

const { mediaPath } = useDjangoUtilies()

</script>

<style lang="scss" scoped>
.image-container {
  height: 100vh;
  width: 100%;
  
  .image {
    height: 100%;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
