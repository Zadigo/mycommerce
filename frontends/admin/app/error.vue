<template>
  <div class="flex flex-center">
    <div>
      <div class="text-4xl">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <nuxt-button to="/">
        Go Home
      </nuxt-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ErrorNotFound'
})
</script>
