<template>
  <div :class="theme.root[size]" class="mx-auto">
    <slot />
  </div>
</template>

<script setup lang="ts">
const { size = 'xl' } = defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()
// max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
const theme = ref({
  root: {
    sm: 'max-w-2xl px-1',
    md: 'max-w-5xl px-1',
    lg: 'max-w-6xl sm:px-1 lg:px-2',
    xl: 'max-w-8xl sm:px-1 lg:px-4'
  }
})
</script>
