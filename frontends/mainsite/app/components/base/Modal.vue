<template>
  <volt-drawer v-model:visible="show">
    <slot />
  </volt-drawer>
</template>

<script lang="ts" setup>
const show = defineModel('show', { type: Boolean, required: true })
</script>
