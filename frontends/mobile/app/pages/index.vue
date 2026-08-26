<template>
  <div id="home">
    <span>Some text {{ state }}</span>
    <button @click="increment">
      Press
    </button>
  </div>
</template>

<script setup lang="ts">
const { state, increment } = useSimpleComposable()
// const newNumber = debouncedRef(state, 3000)
</script>
