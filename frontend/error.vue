<template>
  <NuxtLayout>
    <section class="error-page">
      <div class="card shadow-none">
        <div class="card">
          <div class="card-content">
            <h1>{{ error?.statusCode }}</h1>
            <p>{{ $t("La page n'existe pas") }}</p>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const error = useError()
// import type { NuxtError } from '#app'

// const props = defineProps({
//   error: Object as () => NuxtError
// })
</script>

<style lang="scss" scoped>
.error-page {
  width: 100%;
  height: 100vh;
}
</style>
