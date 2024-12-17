<template>
  <q-card class="bg-green-4">
    <q-card-section class="text-center">
      <h1 class="text-h3 text-weight-bold q-ma-none q-mb-sm">
        {{ statistic }}
      </h1>

      <p>
        {{ title }}
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  statistic: {
    type: [String, Number],
    default: 0
  }
})
</script>
