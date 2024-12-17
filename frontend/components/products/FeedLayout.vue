<template>
  <section id="product-feed" class="row">
    <!-- Filtering -->
    <div class="col-12">
      <slot name="filtering" />
    </div>

    <!-- Feed -->
    <div class="row gx-1 gy-1">
      <slot />
    </div>

    <!-- Intersect -->
    <slot name="intersect" />
  </section>
</template>
