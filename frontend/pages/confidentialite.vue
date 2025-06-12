<template>
  <div class="my-20">
    <div class="w-5/6 mx-auto md:w-2/3">
      <TextIterator :blocks="privacyText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { privacyText } from '~/data/privacy'

const { t } = useI18n()

useHead({
  title: t('Confidentialité'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
