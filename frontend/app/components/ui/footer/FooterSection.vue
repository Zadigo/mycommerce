<template>
  <div data-slot="footer-section" :class="cn(sectionClass, props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props { 
  class?: HTMLAttributes['class'], 
  title?: string,
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3
})

const sectionClass = computed(() => `grid grid-cols-${props.columns} justify-between gap-4`)
</script>
