<template>
  <ion-row>
    <ion-col v-for="i in 20" :key="i" :size="gridColumns" style="padding: .15rem .15rem .15rem .15rem;">
      <!-- <ion-skeleton-text></ion-skeleton-text> -->
      <div class="card-skeleton"></div>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonRow, IonCol, IonSkeletonText } from '@ionic/vue';
import { computed } from 'vue';

const props = defineProps({
  columns: {
    type: Number,
    default: 2
  }
});

/**
 * TODO: Put in composable
 */
const gridColumns = computed(() => {
  if (props.columns === 2) {
    return '6'
  } else if (props.columns === 3) {
    return '4'
  } else {
    return '4'
  }
})

</script>
