<template>
<p v-if="typeof item === 'string'" :class="paragraphClass">
  {{ item }}
</p>

<template v-else>
  <p v-for="text in item" :class="paragraphClass">
    {{ text }}
  </p>
</template>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  item: {
    type: [String, Array] as PropType<string | string[]>,
    required: true
  }
})

const paragraphClass = computed(() => {
  return [
    'font-light',
    'mb-2'
  ]
})
</script>
