<template>
  <section id="collections" class="my-5 max-w-7xl mx-auto md:my-10 md:px-5">
    <!-- <div class="my-10 w-full h-[40vh] bg-center bg-no-repeat bg-cover rounded-lg text-white p-10" :style="{ backgroundImage: 'url(/images/group2/img1.jpg )' }">
      Something
    </div> -->

    <div class="grid grid-cols-1 xl:grid-cols-3 w-full gap-3 overflow-hidden">
      <template v-if="status === 'pending'">
        <volt-skeleton v-for="i in 3" :key="i" class="w-full h-full" />
      </template>

      <template v-else>
        <client-only>
          <base-collection-card custom-name="All" view-name="all" image="/images/group2/img2.jpg" v-motion-slide-bottom />
        </client-only>

        <client-only>
          <base-collection-card v-for="collectionItem in collections?.data.allCollections" :key="collectionItem.slug" :collection="collectionItem" image="/images/group2/img2.jpg" v-motion-slide-bottom @click="viewCollection(collectionItem)" />
        </client-only>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BaseProductCollection, ProductCollection } from '~/types'

const { t } = useI18n()
const { customHandleError } = useErrorHandler()

const { data: collections, status } = await useFetch<ProductCollection>('/api/collections', {
  onResponseError({ error }) {
    customHandleError(error)
  }
})

/**
 * Analytics
 */

const { sendEvent } = useAnalyticsEvent()

if (isDefined(collections)) {
  sendEvent(
    defineAnalyticsEvent('view_item_list', {
      items: collections.value.data.allCollections.map((collection) => ({
        item_id: collection.slug,
        item_name: collection.name,
        item_category: 'Collection',
        item_category2: collection.subCategory
      }))
    })
  )
}

function viewCollection(collection: BaseProductCollection) {
  if (isDefined(collection)) {
    sendEvent(
      defineAnalyticsEvent('select_item', {
        items: [
          {
            item_id: collection.slug,
            item_name: collection.name,
            item_category: 'Collection',
            item_category2: collection.subCategory
          }
        ]
      })
    )
  }
}

/**
 * SEO
 */

const title = t('Achat en ligne de vêtements')
const description = t('Découvrez notre collection de vêtements en ligne')

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogImage: '/images/group1/img1.jpeg',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: '/images/group1/img1.jpeg',
  twitterCard: 'summary_large_image'
})

defineOgImage('Nuxt', {
  url: '/images/group1/img1.jpeg',
  width: 1200,
  height: 630,
  alt: title
})
</script>
