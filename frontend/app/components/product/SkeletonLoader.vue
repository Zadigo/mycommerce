<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
    <template v-for="i in quantity" :key="i">
      <div class="overflow-hidden">
        <volt-skeleton height="427px" />
        <volt-skeleton height="15px" width="240px" />
        <volt-skeleton height="15px" width="100px" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { quantity = 40 } = defineProps<{ quantity?: number }>()
</script>
