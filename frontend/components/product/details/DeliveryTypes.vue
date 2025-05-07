<template>
  <div class="list-group-item flex justify-between gap-3 items-center p-3">
    <div class="flex gap-2 items-center">
      <font-awesome :icon="`${iconName}`" />

      <div v-if="subText" class="flex  flex-column">
        <span class="font-bold">{{ text }}</span>
        <span class="text-body-tertiary">
          {{ subText }}
        </span>
      </div>

      <span v-else class="font-bold">{{ text }}</span>
    </div>
    
    <span class="font-bold text-uppercase text-success">
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
