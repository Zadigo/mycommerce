<template>
  <section id="collections" class="my-5 md:my-10 mx-5">
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <volt-skeleton v-for="i in 3" :key="i" class="w-full h-full" />
    </div>

    <div v-else class="grid grid-cols-1 grid-rows-3 auto-rows-fr md:grid-cols-3 md:grid-rows-1 gap-3">
      <base-collection-card custom-name="All" view-name="all" image="/img4.jpeg" />
      <base-collection-card v-for="collectionItem in collections" :key="collectionItem.id" :collection="collectionItem" image="/img5.jpeg" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CollectionApiResponse } from '~/types'

const { t } = useI18n()
const { customHandleError } = useErrorHandler()

const { data: collections, status } = await useFetch<CollectionApiResponse[]>('/api/collections', {
  onResponseError({ error }) {
    customHandleError(error)
  }
})

const title = t('Achat en ligne de vêtements')
const description = t('Découvrez notre collection de vêtements en ligne')

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogImage: '/img4.jpeg',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: '/img4.jpeg',
  twitterCard: 'summary'
})
</script>
