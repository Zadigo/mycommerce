<template>
  <footer data-slot="footer" :class="cn(footerVariants({ variant }), props.class)">
    <slot />
  </footer>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'
import { footerVariants, type FooterVariants } from './index'

interface Props {
  variant?: FooterVariants['variant']
}

const props = defineProps<{
  variant?: FooterVariants['variant'],
  class?: HTMLAttributes['class']
}>()
</script>
