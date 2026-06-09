<template>
  <nuxt-card>
    <h1 class="text-4xl font-bold text-center">
      {{ statistic }}
    </h1>

    <p class="font-light text-center">
      {{ title }}
    </p>
  </nuxt-card>
</template>

<script lang="ts" setup>
defineProps<{ title: string, statistic: string | number }>()
</script>
