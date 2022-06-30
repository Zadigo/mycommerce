<template>
  <div class="nav banner">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseBanner'
}
</script>

<style>

.banner {
  min-height: 30px;
  padding: .25rem 5rem;
  background-color: rgba(245, 245, 245, 1);
}

.actions a:not(:last-child)::after {
  content: "";
  border-left: 1px solid;
  margin-left: .5rem;
  margin-right: .5rem;
  color: rgba(0, 0, 0, .55);
}
</style>
