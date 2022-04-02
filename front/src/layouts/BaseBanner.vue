<template>
  <div id="banner" class="nav">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseBanner'
}
</script>

<style scoped>
#banner {
  min-height: 30px;
  padding: .25rem 5rem;
  background-color: rgba(245, 245, 245, 1);
}

#actions a:not(:last-child)::after {
  content: "|";
  margin-left: .5rem;
  margin-right: .5rem;
  color: #7d7d7d;
}
</style>
