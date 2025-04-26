<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { DrawerTitle } from 'vaul-vue'
import { computed, type HtmlHTMLAttributes } from 'vue'

import type { DrawerTitleProps } from 'vaul-vue'

const props = defineProps<DrawerTitleProps & { class?: HtmlHTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DrawerTitle data-slot="drawer-title" v-bind="delegatedProps" :class="cn('text-foreground font-semibold', props.class)">
    <slot />
  </DrawerTitle>
</template>
