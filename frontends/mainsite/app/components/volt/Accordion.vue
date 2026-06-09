<template>
  <Accordion unstyled :pt="theme" :pt-options="{ mergeProps: ptViewMerge }">
    <slot />
  </Accordion>
</template>

<script setup lang="ts">
import Accordion, { type AccordionPassThroughOptions, type AccordionProps } from 'primevue/accordion'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ AccordionProps { }
defineProps<Props>()

const theme = ref<AccordionPassThroughOptions>({
  root: ``
})
</script>
