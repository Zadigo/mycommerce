<template>
  <section id="collections" class="container-fluid section-margin-1 mb-5">
    <div class="row">
      <div class="col-sm-12 col-md-10 offset-md-1">
        <div v-if="status === 'pending'" class="row g-1">
          <div v-for="i in 3" :key="i" class="col-sm-12 col-md-4 my-1">
            <BaseSkeleton :loading="true" height="400px" />
          </div>
        </div>
        
        <div v-else class="row g-1">
          <BaseStaticCollectionCard name="All" view-name="all" image="/img4.jpeg" />
          <BaseCollectionCard v-for="collection in collections" :key="collection.id" :collection="collection" image="/img5.jpeg" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CollectionName } from '~/types'

const collections = ref<CollectionName[]>([])

const { handleError } = useErrorHandler()
// const { gtag } = useGtag()

useHead({
  title: 'Achat en ligne de vêtements',
  meta: [
    {
      key: 'description',
      content: 'Découvrez notre collection de vêtements en ligne'
    }
  ]
})

useSeoMeta({
  description: 'Découvrez notre collection de vêtements en ligne',
  ogDescription: 'Découvrez notre collection de vêtements en ligne',
  ogImage: '/img4.jpeg',
  twitterTitle: '[twitter:title]',
  twitterDescription: 'Découvrez notre collection de vêtements en ligne',
  twitterImage: '/img4.jpeg',
  twitterCard: 'summary'
})

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ]
})

useSchemaOrg([

])

const { data, status } = await useFetch('/api/collections/all', {
  onResponseError({ error }) {
    handleError(error?.message)
  }
})

if (data.value) {
  collections.value = data.value
}

onMounted(() => {
  // gtag('event', 'page_view', {
  //   screen_name: 'Achat en ligne de vêtements'
  // })
})
</script>
