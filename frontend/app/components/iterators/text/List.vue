<template>
  <template v-for="(subItem, x) in item" :key="x">
    <IteratorsTextParagraph v-if="typeof subItem === 'string'" :item="subItem" />

    <ul v-if="typeof subItem === 'object'" class="my-2 ps-8 font-light">
      <li v-for="(bullet, y) in subItem" class="list-disc list-outside mb-2">
        {{ bullet }}
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  item: {
    type: Object as PropType<string[]>,
    required: true
  }
})
</script>
