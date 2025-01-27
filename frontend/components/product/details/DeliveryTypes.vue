<template>
  <div class="list-group-item d-flex justify-content-between gap-3 align-items-center p-3">
    <div class="d-flex gap-2 align-items-center">
      <font-awesome :icon="`${iconName}`" />

      <div v-if="subText" class="d-flex flex-column">
        <span class="fw-bold">{{ text }}</span>
        <span class="text-body-tertiary">
          {{ $t(subText) }}
        </span>
      </div>

      <span v-else class="fw-bold">{{ text }}</span>
    </div>
    
    <span class="fw-bold text-uppercase text-success">
      {{ $t("Gratuit") }}
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  subText: {
    type: String,
    default: null
  },
  iconName: {
    type: String,
    required: true
  }
})
</script>
