<template>
  <div v-for="i in quantity" :key="i" id="product" class="card">    
    <volt-skeleton height="427px" class="bg-gray-100" />
    <volt-skeleton height="15px" width="200px" class="mt-1 bg-gray-100" />
    <volt-skeleton height="15px" width="200px" class="mt-1 bg-gray-100" />
  </div>
</template>

<script setup lang="ts">
const { quantity = 20 } = defineProps<{ quantity?: number }>()
</script>
