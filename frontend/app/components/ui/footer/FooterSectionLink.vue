<template>
  <li data-slot="footer-section-link">
    <NuxtLinkLocale :to="to" :class="cn('py-1.5 font-normal transition-colors hover:text-blue-gray-900', props.class)">
      <slot />
    </NuxtLinkLocale >
  </li>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: null,
  to: string
}>()
</script>
