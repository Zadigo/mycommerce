<template>
  <div :class="cn('rounded-md shadow-md bg-white w-full has-active:bg-slate-100', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class'],
  active?: boolean
}>()
</script>
