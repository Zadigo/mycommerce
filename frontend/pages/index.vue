<template>
  <section id="collections" class="my-5 md:my-10 mx-5">
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <TailSkeleton v-for="i in 3" :key="i" class="w-full h-full" />
    </div>

    <div v-else class="grid grid-cols-1 grid-rows-3 auto-rows-fr md:grid-cols-3 md:grid-rows-1 gap-3">
      <BaseCollectionCard custom-name="All" view-name="all" image="/img4.jpeg" />
      <BaseCollectionCard v-for="collection in collections" :key="collection.id" :collection="collection" image="/img5.jpeg" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CollectionName } from '~/types'

// const { gtag } = useGtag()
const { t } = useI18n()
const { handleError } = useErrorHandler()

useSeoMeta({
  description: 'Découvrez notre collection de vêtements en ligne',
  ogDescription: 'Découvrez notre collection de vêtements en ligne',
  ogImage: '/img4.jpeg',
  twitterTitle: '[twitter:title]',
  twitterDescription: 'Découvrez notre collection de vêtements en ligne',
  twitterImage: '/img4.jpeg',
  twitterCard: 'summary'
})

const { data: collections, status } = await useFetch('/api/collections', {
  onResponseError({ error }) {
    handleError(error)
  },
  
  // TODO: Review this code
  // transform (data) {
  //   const validCollections = data.reduce<CollectionName[]>((acc, item) => {
  //     try {
  //       const validItem = CollectionSchema.parse(item)
  //       acc.push(validItem)
  //       return acc
  //     } catch (e) {
  //       console.log('collections.validate', e)
  //       return acc
  //     }
  //   }, [])
  //   return validCollections
  // }
})

onMounted(() => {
  // gtag('event', 'page_view', {
  //   screen_name: 'Achat en ligne de vêtements'
  // })
})

useHead({
  title: t('Achat en ligne de vêtements'),
  meta: [
    {
      key: 'description',
      content: t('Découvrez notre collection de vêtements en ligne')
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ]
})
</script>
