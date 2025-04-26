<template>
  <div class="my-10">
    <div class="w-5/6 mx-auto md:w-2/3">
      <TextIterator :blocks="privacyText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { privacyText } from '~/data/privacy';

useHead({
  title: 'Confidentialité',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
