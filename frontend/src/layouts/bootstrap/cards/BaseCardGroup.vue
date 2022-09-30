<template>
  <div class="card-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseCardGroup',
}
</script>

<style>
.card-group .card.hoverable:hover {
  border-radius: .5rem;
  border: none;
  z-index: 10;
}
.card-group .card {
  border: 1px solid rgba(0, 0, 0, 0.175);
}
</style>
