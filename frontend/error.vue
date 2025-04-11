<template>
  <NuxtLayout>
    <section class="error-page my-10">
      <div class="mx-auto md:max-w-2xl">
        <TailCard class="card border-none shadow-sm">
          <TailCardContent>
            <h1>{{ error?.statusCode }}</h1>
            <p class="text-wrap">{{ error?.message }}</p>
          
            <NuxtLink href="/" @click="handleError">
              {{ $t('Accueil') }}
            </NuxtLink>
          </TailCardContent>
        </TailCard>

        <DevOnly>
          <div class="text-wrap overflow-y-scroll pa-10 rounded-3xl bg-red-300 mt-10">
            {{ error }}
          </div>
        </DevOnly>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { TailCardContent } from '#components';

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
