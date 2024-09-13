<template>
  <div id="product-feed-loading" class="row">
    <div class="col-12">
      <div class="card shadow-none mb-3">
        <div class="card-body pt-1 pb-1 px-0 d-flex justify-content-between">
          <div class="d-flex justify-content-start gap-1">
            <v-skeleton-loader type="button" width="100" />
            <v-skeleton-loader type="button" width="100" />
            <v-skeleton-loader type="button" width="100" />
          </div>

          <div class="d-flex justify-content-start gap-1">
            <v-skeleton-loader type="button" width="100" />
            <v-skeleton-loader type="button" width="100" />
          </div>
        </div>
      </div>
    </div>
    
    <div class="row gx-1 gy-1">
      <div v-for="i in 40" :key="i" class="col-3">
        <v-skeleton-loader type="image" />
        <v-skeleton-loader type="text" width="250" />
        <v-skeleton-loader type="text" width="100" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingProductsFeed'
}
</script>
