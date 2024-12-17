<template>
  <router-view :key="$route.name" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'App'
})
</script>
