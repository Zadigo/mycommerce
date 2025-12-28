<template>
  <div class="my-20">
    <div class="w-5/6 mx-auto md:w-2/3">
      <iterators-text-block :blocks="guideText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { guideText } from '~/data'

// const { t } = useI18n()

// useSeoMeta({
//   title: t('Guide'),
//   titleTemplate: '%s | E-Woman'
// })
</script>
