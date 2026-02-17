<template>
  <div class="my-20">
    <div class="w-5/6 mx-auto md:w-2/3">
      <text-iterator :blocks="privacyText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { privacyText } from '~~/layers/base/data/privacy'

const { t } = useI18n()

useSeoMeta({
  title: t('Confidentialité'),
  titleTemplate: '%s | E-Woman'
})
</script>
