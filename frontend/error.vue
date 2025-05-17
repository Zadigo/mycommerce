<template>
  <NuxtLayout>
    <section class="error-page my-10">
      <div class="mx-auto md:max-w-2xl">
        <TailCard class="card border-none shadow-sm">
          <TailCardContent>
            <h1>{{ error?.statusCode }}</h1>
            <p class="text-wrap">{{ error?.message }}</p>
          
            <NuxtLinkLocale id="link-home-error-page" href="/" @click="handleError">
              {{ $t('Accueil') }}
            </NuxtLinkLocale >
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
const { t } = useI18n()
const error = useError()

useHead({
  title: t(`Erreur ${error.value?.statusCode || 500}`),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

// const { gtag } = useGtag()

// TODO: G-Analytics
// gtag('event', 'exception', {
//   description: `${error.statusCode}`
// })

/**
 * Clears the error stack and redirects
 *  the user to the home page
 */
function handleError() {
  clearError({ redirect: '/' })
}
</script>
