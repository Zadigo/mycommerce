<template>
  <ul>
    <h5 :class="cn('mb-3 font-bold opacity-90', props.class)">
      {{ title }}
    </h5>
    
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props { 
  class?: HTMLAttributes['class'], 
  title?: string
}

const props = defineProps<Props>()
</script>
