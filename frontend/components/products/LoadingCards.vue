<template>
  <div v-for="i in quantity" :key="i" id="product">
    <TailSkeleton class="h-[427px] w-full bg-gray-100" />
    <TailSkeleton class="h-[15px] w-[200px] mt-1 bg-gray-100" />
    <TailSkeleton class="h-[15px] w-[100px] mt-1 bg-gray-100" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  quantity: {
    type: Number,
    default: 10
  }
})
</script>
