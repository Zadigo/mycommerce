<template>
  <div id="product-feed-loading" class="row">
    <div class="col-12">
      <div class="card shadow-none mb-3">
        <div class="card-body pt-1 pb-1 px-0 d-flex justify-content-between">
          <div class="d-flex justify-content-start gap-1">
            <base-skeleton :loading="true" width="270px" height="37px" border-radius />
          </div>

          <div class="d-flex justify-content-start gap-1">
            <base-skeleton :loading="true" width="270px" height="37px" border-radius />
          </div>
        </div>
      </div>
    </div>
    
    <div class="row gx-1 gy-1">
      <div v-for="i in 40" :key="i" class="col-3">
        <base-skeleton :loading="true" height="334px" />
        <base-skeleton :loading="true" class="mt-2" width="50%" height="10px" />
        <base-skeleton :loading="true" class="mt-2" width="20%" height="10px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BaseSkeleton from '@/layouts/BaseSkeleton.vue';

export default defineComponent({
  name: 'LoadingProductsFeed',
  components: {
    BaseSkeleton
  }
})
</script>
