<template>
  <div :class="listItemClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class'],
  active?: boolean
}>(), {
  active: false
})

const listItemClass = cn(
  'text-black font-light normal-case text-left',
  'py-4 px-5 cursor-pointer hover:bg-slate-50',
  'first:hover:rounded-tl-md first:hover:rounded-tr-md last:hover:rounded-bl-md last:hover:rounded-br-md',
  'not:last:border-b-1 not:last:border-slate-50',
  props.active ? 'active': '',
  props.class
)
</script>
