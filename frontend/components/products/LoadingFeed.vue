<template>
  <ProductsFeedLayout>
    <template #filtering>
      <div class="card shadow-none mb-3">
        <div class="card-body pt-1 pb-1 px-0 d-flex justify-content-between">
          <div class="d-flex justify-content-start gap-1">
            <BaseSkeleton :loading="true" width="270px" height="37px" border-radius />
          </div>

          <div class="d-flex justify-content-start gap-1">
            <BaseSkeleton :loading="true" width="270px" height="37px" border-radius />
          </div>
        </div>
      </div>
    </template>

    <template #default>
      <div v-for="i in 40" :key="i" class="col-3">
        <BaseSkeleton :loading="true" height="334px" />
        <BaseSkeleton :loading="true" class="mt-2" width="50%" height="10px" />
        <BaseSkeleton :loading="true" class="mt-2" width="20%" height="10px" />
      </div>
    </template>
  </ProductsFeedLayout>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'LoadingFeed'
})
</script>
