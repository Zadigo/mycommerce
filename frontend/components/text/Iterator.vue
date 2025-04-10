<template>
  <TailCard v-for="(block, x) in blocks" :key="x" :class="{ 'mt-2': x > 0 }" class="border-none shadow-sm">
    <TailCardContent>
      <h5 v-if="block.title" class="font-bold text-2xl mb-2">
        {{ block.title }}
      </h5>

      <template v-for="(item, y) in block.items" :key="y">
        <template v-if="isString(item)">
          <p class="font-light">
            {{ item }}
          </p>
        </template>

        <template v-else-if="isArray(item)">
          <ul class="font-light">
            <li v-for="(subItem, z) in item" :key="z" class="">
              {{ subItem }}
            </li>
          </ul>
        </template>
      </template>
    </TailCardContent>
  </TailCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  blocks: Object as PropType<TextBlock[]>
})

function isString(value: string | object) {
  return typeof value === 'string'
}

function isArray(value: string | object) {
  return Array.isArray(value)
}
</script>
