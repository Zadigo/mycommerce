<template>
  <section id="collections" class="my-5 max-w-7xl mx-auto md:my-10 md:px-5">
    <div class="my-10 w-full h-[40vh] bg-center bg-no-repeat bg-cover rounded-lg text-white p-10" :style="{ backgroundImage: 'url(/images/group2/img1.jpg )' }">
      Something
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 w-full gap-3">
      <template v-if="status === 'pending'">
        <volt-skeleton v-for="i in 3" :key="i" class="w-full h-full" />
      </template>

      <template v-else>
        <base-collection-card custom-name="All" view-name="all" image="/images/group2/img1.jpg" v-motion-slide-bottom />
        <base-collection-card v-for="collectionItem in collections" :key="collectionItem.id" :collection="collectionItem" image="/images/group2/img2.jpg" v-motion-slide-bottom />
      </template>
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
