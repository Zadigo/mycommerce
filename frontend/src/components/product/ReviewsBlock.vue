<template>
  <div class="fw-bold d-flex justify-content-start gap-1">
    <div aria-label="3 stars" data-rating="3" class="stars">
      <font-awesome-icon v-for="i in 5" :key="i" :icon="['fas', 'star']" />
    </div>

    <span class="fs-6 fw-light text-body-secondary">
      ({{ $t('avis', { n: 45 }) }})
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ReviewsBlock'
})
</script>
