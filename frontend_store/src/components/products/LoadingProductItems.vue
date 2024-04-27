<template>
  <div class="row gx-1 gy-1">
    <div v-for="i in 40" :key="i" class="col-3">
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingProductItems'
}
</script>
