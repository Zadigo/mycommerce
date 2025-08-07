<template>
  <div data-slot="footer-socials" :class="cn('mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between', props.class)">
    <div class="mb-4 text-center font-normal text-blue-gray-900 md:mb-0">
      <slot name="copywrite" />
    </div>

    <div class="flex gap-4 text-blue-gray-900 sm:justify-center">
      <slot name="socials" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>
