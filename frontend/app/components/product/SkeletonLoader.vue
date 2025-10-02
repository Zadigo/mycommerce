<template>
  <div class="grid grid-cols-4 gap-2">
    <div v-for="i in quantity" :key="i" id="product" class="space-y-1">
      <volt-skeleton height="427px" />
      <volt-skeleton height="15px" width="240px" />
      <volt-skeleton height="15px" width="100px" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  quantity: {
    type: Number,
    default: 40
  }
})
</script>
