<template>
  <div data-slot="footer-content" :class="cn('mx-auto w-full max-w-7xl pa-10', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: null
}>()
</script>
