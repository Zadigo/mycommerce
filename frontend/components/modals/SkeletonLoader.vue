<template>
  <div class="col-12">
    <BaseSkeleton :loading="true" class="mb-1" height="30px" />

    <div class="d-flex justify-content-end gap-2 mb-4">
      <BaseSkeleton :loading="true" width="40px" height="30px" />
      <BaseSkeleton :loading="true" width="40px" height="30px" />
    </div>

    <BaseSkeleton :loading="true" height="200px" />
    <BaseSkeleton :loading="true" height="200px" class="mt-2" />
  </div>
</template>
