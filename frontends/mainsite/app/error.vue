<template>
  <NuxtLayout>
    <section class="error-page my-20">
      <div class="mx-auto md:max-w-2xl">
        <volt-card class="card border-none shadow-sm">
          <h1 class="text-8xl font-title font-bold">{{ error?.statusCode }}</h1>
          <p class="text-wrap font-light text-3xl">{{ error?.message }}</p>
          
          <volt-button class="mt-10" as-child>
            <NuxtLinkLocale id="link-home-error-page" href="/" @click="handleError">
              {{ $t('Accueil') }}
            </NuxtLinkLocale >
          </volt-button>
        </volt-card>

        <DevOnly>
          <div class="text-wrap p-10 rounded-3xl bg-destructive mt-10">
            <div class="overflow-y-scroll">
              {{ error }}
            </div>
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
