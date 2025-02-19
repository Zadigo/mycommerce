<template>
  <NuxtLayout>
    <section class="error-page container">
      <div class="row" style="margin-top: 5rem;margin-bottom: 3rem;">
        <div class="col-sm-12 col-md-6 offset-md-3 my-5">
          <div class="card shadow-sm">
            <div class="card-body">
              <h1>{{ error?.statusCode }}</h1>
              <p>{{ error }}</p>
              <NuxtLink href="/" @click="handleError">
                {{ $t('Accueil') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const error = useError()

useHead({
  title: "La page n'exist pas"
})

// const { gtag } = useGtag()

// gtag('event', 'exception', {
//   description: `${error.statusCode}`
// })

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 4rem;
  font-weight: 800;
}
</style>
