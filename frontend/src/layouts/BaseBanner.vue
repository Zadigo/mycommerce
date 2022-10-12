<template>
  <!-- border-bottom -->
  <nav class="banner py-2 bg-light">
    <div class="container d-flex flex-wrap">
      <slot></slot>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'BaseBanner'
}
</script>
