<template>
  <section>
    <TailCard v-for="(block, x) in blocks" :key="x" :class="{ 'mt-2': x > 0 }" class="border-none shadow-sm">
      <TailCardContent>
        <h2 v-if="block.title" class="font-bold text-2xl mb-2">
          {{ block.title }}
        </h2>
        
        <template v-for="(item, y) in block.text" :key="y">
          <h2 v-if="item.title" class="font-semibold text-1xl mb-2">
            {{ item.title }}
          </h2>
          
          <IteratorsTextParagraph v-if="item.type === 'text'" :item="item.content" />
          <IteratorsTextList v-else-if="item.type === 'points'" :item="item.content" />
        </template>
      </TailCardContent>
    </TailCard>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { GuideText } from '~/types'

defineProps({
  blocks: {
    type: Object as PropType<GuideText[]>,
    required: true
  }
})
</script>
