<template>
  <div class="row mb-5" style="margin-top: 70px;">
    <div class="col-sm-6 col-md-6 offset-md-3">
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
