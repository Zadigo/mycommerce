<template>
  <article class="col-sm-12 col-md-4 my-1">
    <NuxtLink :to="`/shop/collection/${viewName}`">
      <div :aria-label="name" class="card shadow-none">
        <NuxtImg :alt="name" :src="image" class="card-img" />
        
        <h1 class="text-white text-left h3 fw-bold text-uppercase px-2 py-4">
          {{ name }}
        </h1>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  },
  viewName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/img5.jpeg'
  }
})
</script>

<style lang="scss" scoped>
article {
  h1 {
    position: absolute;
    bottom: 3%;
    left: 3%;
    width: 100%;
  }
}
</style>
