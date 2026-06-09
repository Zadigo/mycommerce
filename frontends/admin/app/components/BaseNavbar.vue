<template>
  <nav v-if="canShow" id="navbar" class="fixed top-0 left-0 w-full px-5 p-2 border-b border-gray-200 z-30 bg-gray-100">
    <ul class="flex space-x-4 ms-auto text-sm">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/dashboard/products">Products</router-link></li>
      <li><router-link to="/dashboard/images">Images</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const canShow = computed(() => route.meta.name !== 'Login')
</script>
