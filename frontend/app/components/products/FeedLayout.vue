<template>
  <section id="feed-structure" class="relative">
    <!-- Filtering -->
    <div id="feed-header">
      <slot name="filtering" />
    </div>

    <!-- Feed -->
    <slot />
    
    <!-- Intersect -->
    <div class="flex justify-center mt-4 mb-10">
      <slot name="intersect" />
    </div>
  </section>
</template>
