<template>
  <button v-if="isButton" type="button" class="px-5 py-2 rounded-md cursor-pointer transition-all ease-in-out bg-gray-50 hover:bg-gray-100 active:bg-gray-100">
    <slot />
  </button>

  <NuxtLink v-else :to="to" class="text-blue-300 underline cursor-pointer underline-offset-5 hover:text-blue-500 active:text-blue-500">
    <slot />
  </NuxtLink>
</template>


<script setup lang="ts">
defineProps({
  isButton: {
    type: Boolean
  },
  to: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
/* .router-link-exact-active {
  color: white
} */
</style>
