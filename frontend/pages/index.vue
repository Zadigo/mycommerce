<template>
  <section id="collections" class="mt-10 mx-5">
    <div v-if="status === 'pending'" class="grid grid-cols-3 gap-2">
      <div class="">
        <div v-for="i in 3" :key="i" class="col-sm-12 col-md-4 my-1">
          <BaseSkeleton :loading="true" height="400px" />
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-3 gap-3">
      <BaseStaticCollectionCard name="All" view-name="all" image="/img4.jpeg" />
      <BaseCollectionCard v-for="collection in collections" :key="collection.id" :collection="collection" image="/img5.jpeg" />
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
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
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

useSchemaOrg([

])

const { data, status } = await useFetch('/api/collections', {
  onResponseError({ error }) {
    // handleError(error?.message)
  },
  transform (data) {
    const validCollections = data.reduce<CollectionName[]>((acc, item) => {
      try {
        const validItem = CollectionSchema.parse(item)
        acc.push(validItem)
        return acc
      } catch (e) {
        console.log('collections.validate', e)
        return acc
      }
    }, [])
    return validCollections
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
