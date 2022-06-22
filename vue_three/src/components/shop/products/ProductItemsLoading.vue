<template>
  <div class="col-12">
    <p class="text-center text-muted m-0 mt-3 mb-3">
      Loading...
    </p>

    <div class="row">
      <div v-for="i in 100" :key="i" class="col-sm-2 col-md-3">
        Loading...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductItemsLoading'
}
</script>
