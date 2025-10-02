<template>
  <tail-card v-for="(block, x) in blocks" :key="x" :class="{ 'mt-2': x > 0 }" class="border-none shadow-sm">
    <tail-card-content>
      <h5 v-if="block.title" class="font-bold font-title text-2xl mb-2">
        {{ block.title }}
      </h5>

      <template v-for="(item, y) in block.items" :key="y">
        <template v-if="isString(item)">
          <p class="font-light leading-7">
            {{ item }}
          </p>
        </template>

        <template v-else-if="isArray(item)">
          <ul class="font-light list-inside list-disc ms-5 my-2 leading-7">
            <li v-for="(subItem, z) in item" :key="z" class="">
              {{ subItem }}
            </li>
          </ul>
        </template>
      </template>
    </tail-card-content>
  </tail-card>
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
