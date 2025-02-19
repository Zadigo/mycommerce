<template>
  <div v-for="(block, x) in blocks" :key="x" :class="{ 'mt-2': x > 0 }" class="card shadow-sm">
    <div class="card-body">
      <h5 v-if="block.title">
        {{ block.title }}
      </h5>

      <template v-for="(item, y) in block.items" :key="y">
        <template v-if="isString(item)">
          <p class="fw-light">
            {{ item }}
          </p>
        </template>

        <template v-else-if="isArray(item)">
          <ul>
            <li v-for="(subItem, z) in item" :key="z">
              {{ subItem }}
            </li>
          </ul>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

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
