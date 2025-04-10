<template>
  <div class="my-10">
    <div class="mx-auto w-2/3">
      <IteratorsTextBlock :blocks="guideText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { guideText } from '~/data'

useHead({
  title: 'Guide'
})
</script>
