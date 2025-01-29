<template>
  <section class="error-page container p-5" style="margin-top: 59px;">
    <div class="card shadow-none">
      <div class="card-content">
        <h1>{{ error?.statusCode }}</h1>
        <p>{{ $t("La page n'existe pas") }}</p>
        <NuxtLink to="/">
          {{ $t('Accueil') }}
        </NuxtLink>
      </div>
    </div>
  </section>
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
  // height: 100vh;
}
</style>
